import type { ToastPosition } from './types';
export declare const ANIMATION_DURATION = 300;
export declare const useToastLayoutAnimations: (positionProp: ToastPosition | undefined) => {
    entering: () => {
        initialValues: {
            opacity: number;
            transform: ({
                scale: number;
                translateY?: undefined;
            } | {
                translateY: number;
                scale?: undefined;
            })[];
        };
        animations: {
            opacity: 1;
            transform: ({
                scale: 1;
                translateY?: undefined;
            } | {
                translateY: 0;
                scale?: undefined;
            })[];
        };
    };
    exiting: () => {
        initialValues: {
            opacity: number;
            transform: {
                translateY: number;
            }[];
        };
        animations: {
            opacity: 0;
            transform: {
                translateY: 150 | -150;
            }[];
        };
    };
};
type GetToastAnimationParams = {
    position: ToastPosition;
};
export declare const getToastEntering: ({ position }: GetToastAnimationParams) => {
    initialValues: {
        opacity: number;
        transform: ({
            scale: number;
            translateY?: undefined;
        } | {
            translateY: number;
            scale?: undefined;
        })[];
    };
    animations: {
        opacity: 1;
        transform: ({
            scale: 1;
            translateY?: undefined;
        } | {
            translateY: 0;
            scale?: undefined;
        })[];
    };
};
export declare const getToastExiting: ({ position }: GetToastAnimationParams) => {
    initialValues: {
        opacity: number;
        transform: {
            translateY: number;
        }[];
    };
    animations: {
        opacity: 0;
        transform: {
            translateY: 150 | -150;
        }[];
    };
};
export {};
//# sourceMappingURL=animations.d.ts.map