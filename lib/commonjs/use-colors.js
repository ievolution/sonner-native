"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useColors = void 0;
var _reactNative = require("react-native");
var _context = require("./context.js");
const light = {
  'background-primary': '#fff',
  'background-secondary': '#f5f5f5',
  'text-primary': '#1e1e1e',
  'text-secondary': '#3f3b3b',
  'text-tertiary': '#4f4a4a',
  'border-secondary': '#e6e3e3',
  'success': '#2e7d32',
  'error': '#f44336',
  'warning': '#ff9800',
  'info': '#2196f3',
  'rich': {
    success: {
      background: '#2e7d32',
      foreground: '#fff',
      border: 'transparent'
    },
    error: {
      background: '#f44336',
      foreground: '#fff',
      border: 'transparent'
    },
    warning: {
      background: '#ff9800',
      foreground: '#fff',
      border: 'transparent'
    },
    info: {
      background: '#2196f3',
      foreground: '#fff',
      border: 'transparent'
    }
  }
};
const dark = {
  'background-primary': '#1e1e1e',
  'background-secondary': 'rgb(40, 40, 40)',
  'text-primary': '#fff',
  'text-secondary': '#E6E3E3',
  'text-tertiary': '#C0BEBE',
  'border-secondary': '#302B2B',
  'success': '#2e7d32',
  'error': '#d32f2f',
  'warning': '#ff9800',
  'info': '#1976d2',
  'rich': {
    success: {
      background: '#2e7d32',
      foreground: '#fff',
      border: 'transparent'
    },
    error: {
      background: '#d32f2f',
      foreground: '#fff',
      border: 'transparent'
    },
    warning: {
      background: '#ff9800',
      foreground: '#fff',
      border: 'transparent'
    },
    info: {
      background: '#1976d2',
      foreground: '#fff',
      border: 'transparent'
    }
  }
};
const useColors = invertProps => {
  const {
    invert: invertCtx,
    theme
  } = (0, _context.useToastContext)();
  const systemScheme = (0, _reactNative.useColorScheme)();
  const scheme = theme === 'system' ? systemScheme : theme;
  const invert = invertProps ?? invertCtx;
  if (scheme === 'dark') {
    if (invert) return light;
    return dark;
  }
  if (invert) return dark;
  return light;
};
exports.useColors = useColors;
//# sourceMappingURL=use-colors.js.map