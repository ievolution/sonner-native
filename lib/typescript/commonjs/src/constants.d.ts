import type { AutoWiggle, ToastPosition, ToastSwipeDirection, ToastTheme, ToastVariant } from './types';
export declare const toastDefaultValues: {
    duration: number;
    position: ToastPosition;
    offset: number;
    swipeToDismissDirection: ToastSwipeDirection;
    variant: ToastVariant;
    visibleToasts: number;
    closeButton: boolean;
    dismissible: boolean;
    unstyled: boolean;
    invert: boolean;
    pauseWhenPageIsHidden: boolean;
    cn: (...classes: Array<string | undefined>) => string;
    gap: number;
    theme: ToastTheme;
    autoWiggleOnUpdate: AutoWiggle;
    richColors: boolean;
};
//# sourceMappingURL=constants.d.ts.map