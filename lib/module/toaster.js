"use strict";

import * as React from 'react';
import { Platform } from 'react-native';
import { FullWindowOverlay } from 'react-native-screens';
import { toastDefaultValues } from "./constants.js";
import { ToastContext } from "./context.js";
import { Positioner } from "./positioner.js";
import { Toast } from "./toast.js";
import { areToastsEqual } from "./toast-comparator.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
let addToastHandler;
let dismissToastHandler;
let wiggleHandler;
export const Toaster = ({
  ToasterOverlayWrapper,
  ...props
}) => {
  if (ToasterOverlayWrapper) {
    return /*#__PURE__*/_jsx(ToasterOverlayWrapper, {
      children: /*#__PURE__*/_jsx(ToasterUI, {
        ...props
      })
    });
  }
  if (Platform.OS === 'ios') {
    return /*#__PURE__*/_jsx(FullWindowOverlay, {
      children: /*#__PURE__*/_jsx(ToasterUI, {
        ...props
      })
    });
  }
  return /*#__PURE__*/_jsx(ToasterUI, {
    ...props
  });
};
export const ToasterUI = ({
  duration = toastDefaultValues.duration,
  position = toastDefaultValues.position,
  offset = toastDefaultValues.offset,
  visibleToasts = toastDefaultValues.visibleToasts,
  swipeToDismissDirection = toastDefaultValues.swipeToDismissDirection,
  closeButton,
  invert,
  toastOptions = {},
  icons,
  pauseWhenPageIsHidden,
  cn,
  gap,
  theme,
  autoWiggleOnUpdate,
  richColors,
  ...props
}) => {
  const [toasts, setToasts] = React.useState([]);
  const toastsCounter = React.useRef(1);
  const toastRefs = React.useRef({});
  addToastHandler = React.useCallback(options => {
    const id = typeof options?.id === 'number' || options.id && options.id?.length > 0 ? options.id : toastsCounter.current++;
    const newToast = {
      ...options,
      id: options?.id ?? id,
      variant: options.variant ?? toastDefaultValues.variant
    };
    const existingToast = toasts.find(currentToast => currentToast.id === options?.id);
    if (existingToast && options?.id) {
      // we're updating
      setToasts(currentToasts => currentToasts.map(currentToast => {
        if (currentToast.id === options.id) {
          return {
            ...currentToast,
            ...newToast,
            duration: options.duration ?? duration,
            id: options.id
          };
        }
        return currentToast;
      }));
      if (autoWiggleOnUpdate === 'always' || autoWiggleOnUpdate === 'toast-change' && !areToastsEqual(newToast, existingToast)) {
        wiggleHandler(options.id);
      }
      return options.id;
    }
    setToasts(currentToasts => {
      const newToasts = [...currentToasts, newToast];
      if (!(newToast.id in toastRefs.current)) {
        toastRefs.current[newToast.id] = /*#__PURE__*/React.createRef();
      }
      if (newToasts.length > visibleToasts) {
        newToasts.shift();
      }
      return newToasts;
    });
    return id;
  }, [autoWiggleOnUpdate, duration, toasts, visibleToasts]);
  const dismissToast = React.useCallback((id, origin) => {
    if (!id) {
      toasts.forEach(currentToast => {
        if (origin === 'onDismiss') {
          currentToast.onDismiss?.(currentToast.id);
        } else {
          currentToast.onAutoClose?.(currentToast.id);
        }
      });
      setToasts([]);
      toastsCounter.current = 1;
      return;
    }
    setToasts(currentToasts => currentToasts.filter(currentToast => currentToast.id !== id));
    const toastForCallback = toasts.find(currentToast => currentToast.id === id);
    if (origin === 'onDismiss') {
      toastForCallback?.onDismiss?.(id);
    } else {
      toastForCallback?.onAutoClose?.(id);
    }
    return id;
  }, [toasts]);
  dismissToastHandler = React.useCallback(id => {
    return dismissToast(id);
  }, [dismissToast]);
  wiggleHandler = React.useCallback(id => {
    const toastRef = toastRefs.current[id];
    if (toastRef && toastRef.current) {
      toastRef.current.wiggle();
    }
  }, []);
  const {
    style,
    className,
    unstyled
  } = toastOptions;
  const value = React.useMemo(() => ({
    duration: duration ?? toastDefaultValues.duration,
    position: position ?? toastDefaultValues.position,
    offset: offset ?? toastDefaultValues.offset,
    swipeToDismissDirection: swipeToDismissDirection ?? toastDefaultValues.swipeToDismissDirection,
    closeButton: closeButton ?? toastDefaultValues.closeButton,
    unstyled: unstyled ?? toastDefaultValues.unstyled,
    addToast: addToastHandler,
    invert: invert ?? toastDefaultValues.invert,
    icons: icons ?? {},
    pauseWhenPageIsHidden: pauseWhenPageIsHidden ?? toastDefaultValues.pauseWhenPageIsHidden,
    cn: cn ?? toastDefaultValues.cn,
    gap: gap ?? toastDefaultValues.gap,
    theme: theme ?? toastDefaultValues.theme,
    toastOptions,
    autoWiggleOnUpdate: autoWiggleOnUpdate ?? toastDefaultValues.autoWiggleOnUpdate,
    richColors: richColors ?? toastDefaultValues.richColors
  }), [duration, position, offset, swipeToDismissDirection, closeButton, unstyled, invert, icons, pauseWhenPageIsHidden, cn, gap, theme, toastOptions, autoWiggleOnUpdate, richColors]);
  const orderToastsFromPosition = React.useCallback(currentToasts => {
    return position === 'bottom-center' ? currentToasts : currentToasts.slice().reverse();
  }, [position]);
  const dynamicPositionedToasts = React.useMemo(() => {
    return toasts.filter(currentToast => currentToast.position && currentToast.position !== position);
  }, [position, toasts]);
  const nonDynamicToasts = React.useMemo(() => {
    return toasts.filter(currentToast => !dynamicPositionedToasts.includes(currentToast));
  }, [dynamicPositionedToasts, toasts]);
  const positionedNonDynamicToasts = React.useMemo(() => {
    return orderToastsFromPosition(nonDynamicToasts);
  }, [nonDynamicToasts, orderToastsFromPosition]);
  const positionedDynamicToasts = React.useMemo(() => {
    return orderToastsFromPosition(dynamicPositionedToasts);
  }, [dynamicPositionedToasts, orderToastsFromPosition]);
  const onDismiss = React.useCallback(id => {
    dismissToast(id, 'onDismiss');
  }, [dismissToast]);
  const onAutoClose = React.useCallback(id => {
    dismissToast(id, 'onAutoClose');
  }, [dismissToast]);
  return /*#__PURE__*/_jsxs(ToastContext.Provider, {
    value: value,
    children: [/*#__PURE__*/_jsx(Positioner, {
      className: className,
      style: style,
      position: position,
      children: positionedNonDynamicToasts.map(positionedToast => {
        return /*#__PURE__*/_jsx(Toast, {
          ...positionedToast,
          onDismiss: onDismiss,
          onAutoClose: onAutoClose,
          ref: toastRefs.current[positionedToast.id],
          ...props
        }, positionedToast.id);
      })
    }), /*#__PURE__*/_jsx(Positioner, {
      className: className,
      style: style,
      position: positionedDynamicToasts?.[0]?.position ?? toastDefaultValues.position,
      children: positionedDynamicToasts.map(positionedToast => {
        return /*#__PURE__*/_jsx(Toast, {
          ...positionedToast,
          onDismiss: onDismiss,
          onAutoClose: onAutoClose,
          ...props
        }, positionedToast.id);
      })
    })]
  });
};
export const getToastContext = () => {
  if (!addToastHandler || !dismissToastHandler || !wiggleHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return {
    addToast: addToastHandler,
    dismissToast: dismissToastHandler,
    wiggleToast: wiggleHandler
  };
};
//# sourceMappingURL=toaster.js.map