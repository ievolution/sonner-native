import * as React from 'react';
import { type ToastProps, type ToastRef } from './types';
export declare const Toast: React.ForwardRefExoticComponent<{
    unstyled?: boolean;
    style?: import("react-native").ViewStyle;
    className?: string;
    classNames?: {
        toastContainer?: string;
        toast?: string;
        toastContent?: string;
        title?: string;
        description?: string;
        buttons?: string;
        closeButton?: string;
        closeButtonIcon?: string;
    };
    styles?: {
        toastContainer?: import("react-native").ViewStyle;
        toast?: import("react-native").ViewStyle;
        toastContent?: import("react-native").ViewStyle;
        title?: import("react-native").TextStyle;
        description?: import("react-native").TextStyle;
        buttons?: import("react-native").ViewStyle;
        closeButton?: import("react-native").ViewStyle;
        closeButtonIcon?: import("react-native").ViewStyle;
    };
} & {
    id: string | number;
    title: string;
    variant: import("./types").ToastVariant;
    jsx?: React.ReactNode;
    description?: string;
    closeButton?: boolean;
    invert?: boolean;
    important?: boolean;
    duration?: number;
    position?: import("./types").ToastPosition;
    dismissible?: boolean;
    icon?: React.ReactNode;
    action?: import("./types").ToastAction | React.ReactNode;
    cancel?: import("./types").ToastAction | React.ReactNode;
    richColors?: boolean;
    onDismiss?: (id: string | number) => void;
    onAutoClose?: (id: string | number) => void;
    promiseOptions?: {
        promise: Promise<unknown>;
        success: (result: any) => string;
        error: string;
        loading: string;
    };
    actionButtonStyle?: import("react-native").ViewStyle;
    actionButtonTextStyle?: import("react-native").TextStyle;
    actionButtonClassName?: string;
    actionButtonTextClassName?: string;
    cancelButtonStyle?: import("react-native").ViewStyle;
    cancelButtonTextStyle?: import("react-native").TextStyle;
    cancelButtonClassName?: string;
    cancelButtonTextClassName?: string;
} & React.RefAttributes<ToastRef>>;
export declare const ToastIcon: React.FC<Pick<ToastProps, 'variant'> & {
    invert: boolean;
    richColors: boolean;
}>;
//# sourceMappingURL=toast.d.ts.map