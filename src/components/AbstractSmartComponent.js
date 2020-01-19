import AbstractComponent from './abstract-component';
import Utils from '../utils';

export default class AbstractSmartComponent extends AbstractComponent {
  constructor() {
    super();
  }

  recoveryListeners() {
    throw new Error(`Abstract method not implemented: recoveryListeners`);
  }

  rerender() {
    const oldElement = this.getElement();

    this.removeElement();

    const newElement = this.getElement();

    Utils.replaceElement(oldElement, newElement);

    this.recoveryListeners();
  }
}
