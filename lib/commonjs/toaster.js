"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getToastContext = exports.ToasterUI = exports.Toaster = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeScreens = require("react-native-screens");
var _constants = require("./constants.js");
var _context = require("./context.js");
var _positioner = require("./positioner.js");
var _toast = require("./toast.js");
var _toastComparator = require("./toast-comparator.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
let addToastHandler;
let dismissToastHandler;
let wiggleHandler;
const Toaster = ({
  ToasterOverlayWrapper,
  ...props
}) => {
  if (ToasterOverlayWrapper) {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(ToasterOverlayWrapper, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ToasterUI, {
        ...props
      })
    });
  }
  if (_reactNative.Platform.OS === 'ios') {
    return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeScreens.FullWindowOverlay, {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(ToasterUI, {
        ...props
      })
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ToasterUI, {
    ...props
  });
};
exports.Toaster = Toaster;
const ToasterUI = ({
  duration = _constants.toastDefaultValues.duration,
  position = _constants.toastDefaultValues.position,
  offset = _constants.toastDefaultValues.offset,
  visibleToasts = _constants.toastDefaultValues.visibleToasts,
  swipeToDismissDirection = _constants.toastDefaultValues.swipeToDismissDirection,
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
      variant: options.variant ?? _constants.toastDefaultValues.variant
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
      if (autoWiggleOnUpdate === 'always' || autoWiggleOnUpdate === 'toast-change' && !(0, _toastComparator.areToastsEqual)(newToast, existingToast)) {
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
    duration: duration ?? _constants.toastDefaultValues.duration,
    position: position ?? _constants.toastDefaultValues.position,
    offset: offset ?? _constants.toastDefaultValues.offset,
    swipeToDismissDirection: swipeToDismissDirection ?? _constants.toastDefaultValues.swipeToDismissDirection,
    closeButton: closeButton ?? _constants.toastDefaultValues.closeButton,
    unstyled: unstyled ?? _constants.toastDefaultValues.unstyled,
    addToast: addToastHandler,
    invert: invert ?? _constants.toastDefaultValues.invert,
    icons: icons ?? {},
    pauseWhenPageIsHidden: pauseWhenPageIsHidden ?? _constants.toastDefaultValues.pauseWhenPageIsHidden,
    cn: cn ?? _constants.toastDefaultValues.cn,
    gap: gap ?? _constants.toastDefaultValues.gap,
    theme: theme ?? _constants.toastDefaultValues.theme,
    toastOptions,
    autoWiggleOnUpdate: autoWiggleOnUpdate ?? _constants.toastDefaultValues.autoWiggleOnUpdate,
    richColors: richColors ?? _constants.toastDefaultValues.richColors
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
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_context.ToastContext.Provider, {
    value: value,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_positioner.Positioner, {
      className: className,
      style: style,
      position: position,
      children: positionedNonDynamicToasts.map(positionedToast => {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_toast.Toast, {
          ...positionedToast,
          onDismiss: onDismiss,
          onAutoClose: onAutoClose,
          ref: toastRefs.current[positionedToast.id],
          ...props
        }, positionedToast.id);
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_positioner.Positioner, {
      className: className,
      style: style,
      position: positionedDynamicToasts?.[0]?.position ?? _constants.toastDefaultValues.position,
      children: positionedDynamicToasts.map(positionedToast => {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_toast.Toast, {
          ...positionedToast,
          onDismiss: onDismiss,
          onAutoClose: onAutoClose,
          ...props
        }, positionedToast.id);
      })
    })]
  });
};
exports.ToasterUI = ToasterUI;
const getToastContext = () => {
  if (!addToastHandler || !dismissToastHandler || !wiggleHandler) {
    throw new Error('ToastContext is not initialized');
  }
  return {
    addToast: addToastHandler,
    dismissToast: dismissToastHandler,
    wiggleToast: wiggleHandler
  };
};
exports.getToastContext = getToastContext;
//# sourceMappingURL=toaster.js.map