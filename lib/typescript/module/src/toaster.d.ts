import * as React from 'react';
import { type AddToastContextHandler, type ToasterProps } from './types';
export declare const Toaster: React.FC<ToasterProps>;
export declare const ToasterUI: React.FC<ToasterProps>;
export declare const getToastContext: () => {
    addToast: AddToastContextHandler;
    dismissToast: (id?: string | number) => string | number | undefined;
    wiggleToast: (id: string | number) => void;
};
//# sourceMappingURL=toaster.d.ts.map