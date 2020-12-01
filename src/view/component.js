import {createElement} from './../utils/render';

export default class Component {
  constructor() {
    if (new.target === Component) {
      throw new Error(`Невозможно создать экземпляр Component, только наследование`);
    }

    this._element = null;
    this._callback = {};
  }

  getTemplate() {
    throw new Error(`Задайте компоненту метод getTemplate()`);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
