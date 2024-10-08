"use strict";

export const toastDefaultValues = {
  duration: 4000,
  position: 'top-center',
  offset: 0,
  swipeToDismissDirection: 'up',
  variant: 'info',
  visibleToasts: 3,
  closeButton: false,
  dismissible: true,
  unstyled: false,
  invert: false,
  pauseWhenPageIsHidden: false,
  cn: (...classes) => classes.filter(Boolean).join(' '),
  gap: 14,
  theme: 'system',
  autoWiggleOnUpdate: 'never',
  richColors: false
};
//# sourceMappingURL=constants.js.map