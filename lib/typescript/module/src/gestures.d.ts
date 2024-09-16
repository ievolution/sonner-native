import * as React from 'react';
import { type ViewStyle } from 'react-native';
import type { ToastPosition, ToastProps } from './types';
type ToastSwipeHandlerProps = Pick<ToastProps, 'important'> & {
    onRemove: () => void;
    style?: ViewStyle | (ViewStyle | undefined)[];
    className?: string;
    onBegin: () => void;
    onFinalize: () => void;
    enabled?: boolean;
    unstyled?: boolean;
    position?: ToastPosition;
};
export declare const ToastSwipeHandler: React.FC<React.PropsWithChildren<ToastSwipeHandlerProps>>;
export {};
//# sourceMappingURL=gestures.d.ts.map