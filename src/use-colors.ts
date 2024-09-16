import { useColorScheme } from 'react-native';
import { useToastContext } from './context';

const light = {
  'background-primary': '#fff',
  'background-secondary': '#f7f7f7',
  'text-primary': '#232020',
  'text-secondary': '#3f3b3b',
  'text-tertiary': '#4f4a4a',
  'border-secondary': '#e6e3e3',
  'success': 'rgb(5,215,45)',
  'error': '#f44336',
  'warning': '#ff9800',
  'info': '#2196f3',

  'rich': {
    success: {
      foreground: '#ecfdf3',
      background: 'rgb(5,215,45)',
      border: '#d3fde5',
    },
    error: {
      foreground: '#fff0f0',
      background: '#f44336',
      border: '#ffe0e1',
    },
    warning: {
      foreground: '#fffcf0',
      background: '#ff9800',
      border: '#fdf5d3',
    },
    info: {
      foreground: '#f0f8ff',
      background: '#2196f3',
      border: '#d3e0fd',
    },
  },
};

const dark: typeof light = {
  'background-primary': '#181313',
  'background-secondary': '#232020',
  'text-primary': '#fff',
  'text-secondary': '#E6E3E3',
  'text-tertiary': '#C0BEBE',
  'border-secondary': '#302B2B',
  'success': 'rgb(5,215,45)',
  'error': '#d32f2f',
  'warning': '#ff9800',
  'info': '#1976d2',

  'rich': {
    success: {
      background: 'rgb(5,215,45)',
      foreground: '#001f0f',
      border: '#003d1c',
    },
    error: {
      background: '#d32f2f',
      foreground: '#2d0607',
      border: '#4d0408',
    },
    warning: {
      background: '#ff9800',
      foreground: '#1d1f00',
      border: '#3d3d00',
    },
    info: {
      background: '#1976d2',
      foreground: '#000d1f',
      border: '#00113d',
    },
  },
};

export const useColors = (invertProps?: boolean) => {
  const { invert: invertCtx, theme } = useToastContext();
  const systemScheme = useColorScheme();
  const scheme = theme === 'system' ? systemScheme : theme;
  const invert = invertProps ?? invertCtx;

  if (scheme === 'dark') {
    if (invert) return light;
    return dark;
  }

  if (invert) return dark;
  return light;
};
