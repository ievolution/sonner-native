"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ToastSwipeHandler = void 0;
var React = _interopRequireWildcard(require("react"));
var _reactNative = require("react-native");
var _reactNativeGestureHandler = require("react-native-gesture-handler");
var _reactNativeReanimated = _interopRequireWildcard(require("react-native-reanimated"));
var _easings = require("./easings.js");
var _context = require("./context.js");
var _jsxRuntime = require("react/jsx-runtime");
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const {
  width: WINDOW_WIDTH
} = _reactNative.Dimensions.get('window');
const ToastSwipeHandler = ({
  children,
  onRemove,
  className,
  style,
  onBegin,
  onFinalize,
  enabled,
  unstyled,
  important,
  position: positionProps
}) => {
  const translate = (0, _reactNativeReanimated.useSharedValue)(0);
  const {
    swipeToDismissDirection: direction,
    gap,
    position: positionCtx
  } = (0, _context.useToastContext)();
  const position = positionProps || positionCtx;
  const pan = _reactNativeGestureHandler.Gesture.Pan().onBegin(() => {
    'worklet';

    if (!enabled) {
      return;
    }
    (0, _reactNativeReanimated.runOnJS)(onBegin)();
  }).onChange(event => {
    'worklet';

    if (!enabled) {
      return;
    }
    if (direction === 'left' && event.translationX < 0) {
      translate.value = event.translationX;
    } else if (direction === 'up') {
      translate.value = event.translationY * (position === 'bottom-center' ? -1 : 1);
    }
  }).onFinalize(() => {
    'worklet';

    if (!enabled) {
      return;
    }
    const threshold = direction === 'left' ? -WINDOW_WIDTH * 0.25 : -16;
    const shouldDismiss = translate.value < threshold;
    if (shouldDismiss) {
      translate.value = (0, _reactNativeReanimated.withTiming)(-WINDOW_WIDTH, {
        easing: _reactNativeReanimated.Easing.inOut(_reactNativeReanimated.Easing.ease)
      }, isDone => {
        if (isDone) {
          (0, _reactNativeReanimated.runOnJS)(onRemove)();
        }
      });
    } else {
      translate.value = (0, _reactNativeReanimated.withTiming)(0, {
        easing: _reactNativeReanimated.Easing.elastic(0.8)
      });
    }
    (0, _reactNativeReanimated.runOnJS)(onFinalize)();
  });
  const animatedStyle = (0, _reactNativeReanimated.useAnimatedStyle)(() => {
    return {
      transform: [direction === 'left' ? {
        translateX: translate.value
      } : {
        translateY: translate.value * (position === 'bottom-center' ? -1 : 1)
      }],
      opacity: (0, _reactNativeReanimated.interpolate)(translate.value, [0, direction === 'left' ? -WINDOW_WIDTH : -60], [1, 0])
    };
  }, [direction, translate]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeGestureHandler.GestureDetector, {
    gesture: pan,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNativeReanimated.default.View, {
      style: [animatedStyle, unstyled ? undefined : {
        justifyContent: 'center',
        marginBottom: gap
      }, {
        width: '100%'
      }, style],
      className: className,
      layout: _reactNativeReanimated.LinearTransition.easing(_easings.easeInOutCircFn),
      "aria-live": important ? 'assertive' : 'polite' // https://reactnative.dev/docs/accessibility#aria-live-android
      ,
      children: children
    })
  });
};
exports.ToastSwipeHandler = ToastSwipeHandler;
//# sourceMappingURL=gestures.js.map