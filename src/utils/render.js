import Component from '../view/component';

export const RenderPosition = {
  AFTERBEGIN: `afterbegin`,
  BEFOREEND: `beforeend`,
  AFTEREND: `afterend`
};

export const render = (container, child, place = RenderPosition.BEFOREEND) => {
  if (container instanceof Component) {
    container = container.getElement();
  }

  if (child instanceof Component) {
    child = child.getElement();
  }

  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(child);
      break;
    case RenderPosition.BEFOREEND:
      container.append(child);
      break;
    case RenderPosition.AFTEREND:
      container.insertAdjacentElement(place, child);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement(`div`);
  newElement.innerHTML = template;

  return newElement.firstChild;
};


export const replace = (newChild, oldChild) => {
  if (oldChild instanceof Component) {
    oldChild = oldChild.getElement();
  }

  if (newChild instanceof Component) {
    newChild = newChild.getElement();
  }

  const parent = oldChild.parentElement;

  if (parent === null || oldChild === null || newChild === null) {
    throw new Error(`Невозможно поменять несуществующие компоненты`);
  }

  parent.replaceChild(newChild, oldChild);
};

export const remove = (component) => {
  if (component === null) {
    return;
  }

  if (!(component instanceof Component)) {
    throw new Error(`Можно удалить только Component`);
  }

  component.getElement().remove();
  component.removeElement();
};
