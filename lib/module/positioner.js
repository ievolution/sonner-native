"use strict";

import React from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useToastContext } from "./context.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const Positioner = ({
  children,
  position,
  className,
  style,
  ...props
}) => {
  const {
    offset
  } = useToastContext();
  const {
    top,
    bottom
  } = useSafeAreaInsets();
  const insetValues = React.useMemo(() => {
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
  return /*#__PURE__*/_jsx(View, {
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
//# sourceMappingURL=positioner.js.map