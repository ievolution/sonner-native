"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Positioner = void 0;
var _react = _interopRequireDefault(require("react"));
var _reactNative = require("react-native");
var _reactNativeSafeAreaContext = require("react-native-safe-area-context");
var _context = require("./context.js");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { default: e }; }
const Positioner = ({
  children,
  position,
  className,
  style,
  ...props
}) => {
  const {
    offset
  } = (0, _context.useToastContext)();
  const {
    top,
    bottom
  } = (0, _reactNativeSafeAreaContext.useSafeAreaInsets)();
  const insetValues = _react.default.useMemo(() => {
    if (position === 'bottom-center') {
      return {
        bottom: offset || bottom || 40
      };
    }
    if (position === 'top-center') {
      return {
        top: offset || top || 40
      };
    }
    return {};
  }, [position, bottom, top, offset]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_reactNative.View, {
    style: [{
      position: 'absolute',
      width: '100%',
      alignItems: 'center'
    }, insetValues, style],
    className: className,
    ...props,
    children: children
  });
};
exports.Positioner = Positioner;
//# sourceMappingURL=positioner.js.map