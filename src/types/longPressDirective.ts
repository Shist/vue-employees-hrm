export interface IVLongPressElement extends HTMLElement {
  __longPressStart?: (event: TouchEvent) => void;
  __longPressCancel?: () => void;
}
