"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToastIcon = exports.Toast = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _animations = require("./animations.js");
var _constants = require("./constants.js");
var _context = require("./context.js");
var _gestures = require("./gestures.js");
var _icons = require("./icons.js");
var _types = require("./types.js");
var _useAppState = require("./use-app-state.js");
var _useDefaultStyles = require("./use-default-styles.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const Toast = exports.Toast = /*#__PURE__*/React.forwardRef(({
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
  dismissible = _constants.toastDefaultValues.dismissible,
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
  richColors: richColorsProps
}, ref) => {
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
      closeButtonIconStyle: closeButtonIconStyleCtx
    }
  } = (0, _context.useToastContext)();
  const invert = invertProps ?? invertCtx;
  const richColors = richColorsProps ?? richColorsCtx;
  const unstyled = unstyledProps ?? unstyledCtx;
  const duration = durationProps ?? durationCtx;
  const closeButton = closeButtonProps ?? closeButtonCtx;
  const {
    entering,
    exiting
  } = (0, _animations.useToastLayoutAnimations)(position);
  const isDragging = React.useRef(false);
  const timer = React.useRef();
  const timerStart = React.useRef();
  const timeLeftOnceBackgrounded = React.useRef();
  const isResolvingPromise = React.useRef(false);
  const wiggleSharedValue = (0, _reactNativeReanimated.useSharedValue)(1);
  const wiggleAnimationStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [{
        scale: wiggleSharedValue.value
      }]
    };
  }, [wiggleSharedValue]);
  const startTimer = React.useCallback(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!isDragging.current) {
        onAutoClose?.(id);
      }
    }, _animations.ANIMATION_DURATION + duration);
  }, [duration, id, onAutoClose]);
  const wiggle = React.useCallback(() => {
    'worklet';

    wiggleSharedValue.value = (0, _reactNativeReanimated.withRepeat)((0, _reactNativeReanimated.withTiming)(Math.min(wiggleSharedValue.value * 1.035, 1.035), {
      duration: 150
    }), 4, true);
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
      wiggleSharedValue.value = (0, _reactNativeReanimated.withTiming)(1, {
        duration: 150
      }, wiggle);
    } else {
      wiggle();
    }
  }, [wiggle, wiggleSharedValue, startTimer, duration]);
  React.useImperativeHandle(ref, () => ({
    wiggle: wiggleHandler
  }));
  const onBackground = React.useCallback(() => {
    if (!pauseWhenPageIsHidden) {
      return;
    }
    if (timer.current) {
      timeLeftOnceBackgrounded.current = duration - (Date.now() - timerStart.current);
      clearTimeout(timer.current);
      timer.current = undefined;
      timerStart.current = undefined;
    }
  }, [duration, pauseWhenPageIsHidden]);
  const onForeground = React.useCallback(() => {
    if (!pauseWhenPageIsHidden) {
      return;
    }
    if (timeLeftOnceBackgrounded.current && timeLeftOnceBackgrounded.current > 0) {
      timer.current = setTimeout(() => {
        if (!isDragging.current) {
          onAutoClose?.(id);
        }
      }, Math.max(timeLeftOnceBackgrounded.current, 1000) // minimum 1 second to avoid weird behavior
      );
    } else {
      onAutoClose?.(id);
    }
  }, [id, onAutoClose, pauseWhenPageIsHidden]);
  (0, _useAppState.useAppStateListener)(React.useMemo(() => ({
    onBackground,
    onForeground
  }), [onBackground, onForeground]));
  React.useEffect(() => {
    const handlePromise = async () => {
      if (isResolvingPromise.current) {
        return;
      }
      if (promiseOptions?.promise) {
        isResolvingPromise.current = true;
        try {
          await promiseOptions.promise.then(data => {
            addToast({
              title: promiseOptions.success(data) ?? 'Success',
              id,
              variant: 'success',
              promiseOptions: undefined
            });
          });
        } catch (error) {
          addToast({
            title: promiseOptions.error ?? 'Error',
            id,
            variant: 'error',
            promiseOptions: undefined
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
  }, [duration, id, onDismiss, promiseOptions, addToast, onAutoClose, startTimer]);
  React.useEffect(() => {
    // Cleanup function to clear the timer if it's still the same timer
    return () => {
      clearTimeout(timer.current);
      timer.current = undefined;
      timerStart.current = undefined;
    };
  }, [id]);
  const defaultStyles = (0, _useDefaultStyles.useDefaultStyles)({
    invert,
    richColors,
    unstyled,
    description,
    variant
  });
  if (jsx) {
    return jsx;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_gestures.ToastSwipeHandler, {
    onRemove: () => {
      onDismiss?.(id);
    },
    onBegin: () => {
      isDragging.current = true;
    },
    onFinalize: () => {
      isDragging.current = false;
      const timeElapsed = Date.now() - timerStart.current;
      if (timeElapsed < duration) {
        timer.current = setTimeout(() => {
          onDismiss?.(id);
        }, duration - timeElapsed);
      } else {
        onDismiss?.(id);
      }
    },
    enabled: !promiseOptions && dismissible,
    style: [toastContainerStyleCtx, styles?.toastContainer],
    className: cn(classNamesCtx?.toastContainer, classNames?.toastContainer),
    unstyled: unstyled,
    important: important,
    position: position,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      className: cn(className, classNamesCtx?.toast, classNames?.toast),
      style: [unstyled ? undefined : elevationStyle, defaultStyles.toast, toastStyleCtx, styles?.toast, style, wiggleAnimationStyle],
      entering: entering,
      exiting: exiting,
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
        style: [defaultStyles.toastContent, toastContentStyleCtx, styles?.toastContent],
        className: cn(classNamesCtx?.toastContent, classNames?.toastContent),
        children: [promiseOptions || variant === 'loading' ? 'loading' in icons ? icons.loading : /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.ActivityIndicator, {}) : icon ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
          children: icon
        }) : variant in icons ? icons[variant] : /*#__PURE__*/(0, _jsxRuntime.jsx)(ToastIcon, {
          variant: variant,
          invert: invert,
          richColors: richColors
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
          style: {
            flex: 1
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: [defaultStyles.title, titleStyleCtx, styles?.title],
            className: cn(classNamesCtx?.title, classNames?.title),
            children: title
          }), description ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
            style: [defaultStyles.description, descriptionStyleCtx, styles?.description],
            className: cn(classNamesCtx?.description, classNames?.description),
            children: description
          }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_reactNative.View, {
            style: [unstyled || !action && !cancel ? undefined : defaultStyles.buttons, buttonsStyleCtx, styles?.buttons],
            className: cn(classNamesCtx?.buttons, classNames?.buttons),
            children: [(0, _types.isToastAction)(action) ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
              onPress: action.onClick,
              className: actionButtonClassName,
              style: [defaultStyles.actionButton, actionButtonStyleCtx, actionButtonStyle],
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
                numberOfLines: 1,
                style: [defaultStyles.actionButtonText, actionButtonTextStyleCtx, actionButtonTextStyle],
                className: actionButtonTextClassName,
                children: action.label
              })
            }) : action || undefined, (0, _types.isToastAction)(cancel) ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
              onPress: () => {
                cancel.onClick();
                onDismiss?.(id);
              },
              className: cancelButtonClassName,
              style: [defaultStyles.cancelButton, cancelButtonStyleCtx, cancelButtonStyle],
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Text, {
                numberOfLines: 1,
                style: [defaultStyles.cancelButtonText, cancelButtonTextStyleCtx, cancelButtonTextStyle],
                className: cancelButtonTextClassName,
                children: cancel.label
              })
            }) : cancel || undefined]
          })]
        }), closeButton && dismissible ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.Pressable, {
          onPress: () => onDismiss?.(id),
          hitSlop: 10,
          style: [closeButtonStyleCtx, styles?.closeButton],
          className: cn(classNamesCtx?.closeButton, classNames?.closeButton),
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.X, {
            size: 20,
            color: defaultStyles.closeButtonColor,
            style: [closeButtonIconStyleCtx, styles?.closeButtonIcon],
            className: cn(classNamesCtx?.closeButtonIcon, classNames?.closeButtonIcon)
          })
        }) : null]
      })
    })
  });
});
Toast.displayName = 'Toast';
const ToastIcon = ({
  variant,
  invert,
  richColors
}) => {
  const color = (0, _useDefaultStyles.useDefaultStyles)({
    variant,
    invert,
    richColors,
    unstyled: false,
    description: undefined
  }).iconColor;
  switch (variant) {
    case 'success':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.CircleCheck, {
        size: 20,
        color: color
      });
    case 'error':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.CircleX, {
        size: 20,
        color: color
      });
    case 'warning':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.TriangleAlert, {
        size: 20,
        color: color
      });
    default:
    case 'info':
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_icons.Info, {
        size: 20,
        color: color
      });
  }
};
exports.ToastIcon = ToastIcon;
const elevationStyle = {
  shadowOpacity: 0.0015 * 4 + 0.1,
  shadowRadius: 3 * 4,
  shadowOffset: {
    height: 4,
    width: 0
  },
  elevation: 4
};
//# sourceMappingURL=toast.js.map