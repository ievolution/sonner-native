import * as React from 'react';
import { ActivityIndicator, Pressable, Text, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ANIMATION_DURATION, useToastLayoutAnimations } from './animations';
import { toastDefaultValues } from './constants';
import { useToastContext } from './context';
import { ToastSwipeHandler } from './gestures';
import { CircleCheck, CircleX, Info, TriangleAlert, X } from './icons';
import { isToastAction, type ToastProps, type ToastRef } from './types';
import { useAppStateListener } from './use-app-state';
import { useDefaultStyles } from './use-default-styles';

export const Toast = React.forwardRef<ToastRef, ToastProps>(
  (
    {
      id,
      title,
      jsx,
      description,
      icon,
      duration: durationProps,
      variant,
      action,
      cancel,
      onDismiss,
      onAutoClose,
      dismissible = toastDefaultValues.dismissible,
      closeButton: closeButtonProps,
      actionButtonStyle,
      actionButtonTextStyle,
      actionButtonClassName,
      actionButtonTextClassName,
      cancelButtonStyle,
      cancelButtonTextStyle,
      cancelButtonClassName,
      cancelButtonTextClassName,
      style,
      className,
      classNames,
      styles,
      promiseOptions,
      position,
      unstyled: unstyledProps,
      important,
      invert: invertProps,
      richColors: richColorsProps,
    },
    ref
  ) => {
    const {
      duration: durationCtx,
      addToast,
      closeButton: closeButtonCtx,
      icons,
      pauseWhenPageIsHidden,
      cn,
      invert: invertCtx,
      richColors: richColorsCtx,
      toastOptions: {
        unstyled: unstyledCtx,
        toastContainerStyle: toastContainerStyleCtx,
        classNames: classNamesCtx,
        actionButtonStyle: actionButtonStyleCtx,
        actionButtonTextStyle: actionButtonTextStyleCtx,
        cancelButtonStyle: cancelButtonStyleCtx,
        cancelButtonTextStyle: cancelButtonTextStyleCtx,
        style: toastStyleCtx,
        toastContentStyle: toastContentStyleCtx,
        titleStyle: titleStyleCtx,
        descriptionStyle: descriptionStyleCtx,
        buttonsStyle: buttonsStyleCtx,
        closeButtonStyle: closeButtonStyleCtx,
        closeButtonIconStyle: closeButtonIconStyleCtx,
      },
    } = useToastContext();
    const invert = invertProps ?? invertCtx;
    const richColors = richColorsProps ?? richColorsCtx;
    const unstyled = unstyledProps ?? unstyledCtx;
    const duration = durationProps ?? durationCtx;
    const closeButton = closeButtonProps ?? closeButtonCtx;

    const { entering, exiting } = useToastLayoutAnimations(position);

    const isDragging = React.useRef(false);
    const timer = React.useRef<NodeJS.Timeout>();
    const timerStart = React.useRef<number | undefined>();
    const timeLeftOnceBackgrounded = React.useRef<number | undefined>();
    const isResolvingPromise = React.useRef(false);

    const wiggleSharedValue = useSharedValue(1);

    const wiggleAnimationStyle = useAnimatedStyle(() => {
      return {
        transform: [{ scale: wiggleSharedValue.value }],
      };
    }, [wiggleSharedValue]);

    const startTimer = React.useCallback(() => {
      clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        if (!isDragging.current) {
          onAutoClose?.(id);
        }
      }, ANIMATION_DURATION + duration);
    }, [duration, id, onAutoClose]);

    const wiggle = React.useCallback(() => {
      'worklet';

      wiggleSharedValue.value = withRepeat(
        withTiming(Math.min(wiggleSharedValue.value * 1.035, 1.035), {
          duration: 150,
        }),
        4,
        true
      );
    }, [wiggleSharedValue]);

    const wiggleHandler = React.useCallback(() => {
      // we can't send Infinity over to the native layer.
      if (duration === Infinity) {
        return;
      }

      // reset the duration
      timerStart.current = Date.now();
      startTimer();

      if (wiggleSharedValue.value !== 1) {
        // we should animate back to 1 and then wiggle
        wiggleSharedValue.value = withTiming(1, { duration: 150 }, wiggle);
      } else {
        wiggle();
      }
    }, [wiggle, wiggleSharedValue, startTimer, duration]);

    React.useImperativeHandle(ref, () => ({
      wiggle: wiggleHandler,
    }));

    const onBackground = React.useCallback(() => {
      if (!pauseWhenPageIsHidden) {
        return;
      }

      if (timer.current) {
        timeLeftOnceBackgrounded.current =
          duration - (Date.now() - timerStart.current!);
        clearTimeout(timer.current);
        timer.current = undefined;
        timerStart.current = undefined;
      }
    }, [duration, pauseWhenPageIsHidden]);

    const onForeground = React.useCallback(() => {
      if (!pauseWhenPageIsHidden) {
        return;
      }

      if (
        timeLeftOnceBackgrounded.current &&
        timeLeftOnceBackgrounded.current > 0
      ) {
        timer.current = setTimeout(
          () => {
            if (!isDragging.current) {
              onAutoClose?.(id);
            }
          },
          Math.max(timeLeftOnceBackgrounded.current, 1000) // minimum 1 second to avoid weird behavior
        );
      } else {
        onAutoClose?.(id);
      }
    }, [id, onAutoClose, pauseWhenPageIsHidden]);

    useAppStateListener(
      React.useMemo(
        () => ({
          onBackground,
          onForeground,
        }),
        [onBackground, onForeground]
      )
    );

    React.useEffect(() => {
      const handlePromise = async () => {
        if (isResolvingPromise.current) {
          return;
        }

        if (promiseOptions?.promise) {
          isResolvingPromise.current = true;

          try {
            await promiseOptions.promise.then((data) => {
              addToast({
                title: promiseOptions.success(data) ?? 'Success',
                id,
                variant: 'success',
                promiseOptions: undefined,
              });
            });
          } catch (error) {
            addToast({
              title: promiseOptions.error ?? 'Error',
              id,
              variant: 'error',
              promiseOptions: undefined,
            });
          } finally {
            isResolvingPromise.current = false;
          }

          return;
        }

        if (duration === Infinity) {
          return;
        }

        // Start the timer only if it hasn't been started yet
        if (!timerStart.current) {
          timerStart.current = Date.now();
          startTimer();
        }
      };

      handlePromise();
    }, [
      duration,
      id,
      onDismiss,
      promiseOptions,
      addToast,
      onAutoClose,
      startTimer,
    ]);

    React.useEffect(() => {
      // Cleanup function to clear the timer if it's still the same timer
      return () => {
        clearTimeout(timer.current);
        timer.current = undefined;
        timerStart.current = undefined;
      };
    }, [id]);

    const defaultStyles = useDefaultStyles({
      invert,
      richColors,
      unstyled,
      description,
      variant,
    });

    if (jsx) {
      return jsx;
    }

    return (
      <ToastSwipeHandler
        onRemove={() => {
          onDismiss?.(id);
        }}
        onBegin={() => {
          isDragging.current = true;
        }}
        onFinalize={() => {
          isDragging.current = false;
          const timeElapsed = Date.now() - timerStart.current!;

          if (timeElapsed < duration) {
            timer.current = setTimeout(() => {
              onDismiss?.(id);
            }, duration - timeElapsed);
          } else {
            onDismiss?.(id);
          }
        }}
        enabled={!promiseOptions && dismissible}
        style={[toastContainerStyleCtx, styles?.toastContainer]}
        className={cn(
          classNamesCtx?.toastContainer,
          classNames?.toastContainer
        )}
        unstyled={unstyled}
        important={important}
        position={position}
      >
        <Animated.View
          className={cn(className, classNamesCtx?.toast, classNames?.toast)}
          style={[
            unstyled ? undefined : elevationStyle,
            defaultStyles.toast,
            toastStyleCtx,
            styles?.toast,
            style,
            wiggleAnimationStyle,
          ]}
          entering={entering}
          exiting={exiting}
        >
          <View
            style={[
              defaultStyles.toastContent,
              toastContentStyleCtx,
              styles?.toastContent,
            ]}
            className={cn(
              classNamesCtx?.toastContent,
              classNames?.toastContent
            )}
          >
            {promiseOptions || variant === 'loading' ? (
              'loading' in icons ? (
                icons.loading
              ) : (
                <ActivityIndicator />
              )
            ) : icon ? (
              <View>{icon}</View>
            ) : variant in icons ? (
              icons[variant]
            ) : (
              <ToastIcon
                variant={variant}
                invert={invert}
                richColors={richColors}
              />
            )}
            <View style={{ flex: 1 }}>
              <Text
                style={[defaultStyles.title, titleStyleCtx, styles?.title]}
                className={cn(classNamesCtx?.title, classNames?.title)}
              >
                {title}
              </Text>
              {description ? (
                <Text
                  style={[
                    defaultStyles.description,
                    descriptionStyleCtx,
                    styles?.description,
                  ]}
                  className={cn(
                    classNamesCtx?.description,
                    classNames?.description
                  )}
                >
                  {description}
                </Text>
              ) : null}
              <View
                style={[
                  unstyled || (!action && !cancel)
                    ? undefined
                    : defaultStyles.buttons,
                  buttonsStyleCtx,
                  styles?.buttons,
                ]}
                className={cn(classNamesCtx?.buttons, classNames?.buttons)}
              >
                {isToastAction(action) ? (
                  <Pressable
                    onPress={action.onClick}
                    className={actionButtonClassName}
                    style={[
                      defaultStyles.actionButton,
                      actionButtonStyleCtx,
                      actionButtonStyle,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        defaultStyles.actionButtonText,
                        actionButtonTextStyleCtx,
                        actionButtonTextStyle,
                      ]}
                      className={actionButtonTextClassName}
                    >
                      {action.label}
                    </Text>
                  </Pressable>
                ) : (
                  action || undefined
                )}
                {isToastAction(cancel) ? (
                  <Pressable
                    onPress={() => {
                      cancel.onClick();
                      onDismiss?.(id);
                    }}
                    className={cancelButtonClassName}
                    style={[
                      defaultStyles.cancelButton,
                      cancelButtonStyleCtx,
                      cancelButtonStyle,
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        defaultStyles.cancelButtonText,
                        cancelButtonTextStyleCtx,
                        cancelButtonTextStyle,
                      ]}
                      className={cancelButtonTextClassName}
                    >
                      {cancel.label}
                    </Text>
                  </Pressable>
                ) : (
                  cancel || undefined
                )}
              </View>
            </View>
            {closeButton && dismissible ? (
              <Pressable
                onPress={() => onDismiss?.(id)}
                hitSlop={10}
                style={[closeButtonStyleCtx, styles?.closeButton]}
                className={cn(
                  classNamesCtx?.closeButton,
                  classNames?.closeButton
                )}
              >
                <X
                  size={20}
                  color={defaultStyles.closeButtonColor}
                  style={[closeButtonIconStyleCtx, styles?.closeButtonIcon]}
                  className={cn(
                    classNamesCtx?.closeButtonIcon,
                    classNames?.closeButtonIcon
                  )}
                />
              </Pressable>
            ) : null}
          </View>
        </Animated.View>
      </ToastSwipeHandler>
    );
  }
);

Toast.displayName = 'Toast';

export const ToastIcon: React.FC<
  Pick<ToastProps, 'variant'> & {
    invert: boolean;
    richColors: boolean;
  }
> = ({ variant, invert, richColors }) => {
  const color = useDefaultStyles({
    variant,
    invert,
    richColors,
    unstyled: false,
    description: undefined,
  }).iconColor;

  switch (variant) {
    case 'success':
      return <CircleCheck size={20} color={color} />;
    case 'error':
      return <CircleX size={20} color={color} />;
    case 'warning':
      return <TriangleAlert size={20} color={color} />;
    default:
    case 'info':
      return <Info size={20} color={color} />;
  }
};

const elevationStyle = {
  shadowOpacity: 0.0015 * 4 + 0.1,
  shadowRadius: 3 * 4,
  shadowOffset: {
    height: 4,
    width: 0,
  },
  elevation: 4,
};
