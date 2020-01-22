export const render = (container, element, before) => {
  if (typeof element.getElement === `function`) {
    container.insertBefore(element.getElement(), before);
  } else {
    container.insertBefore(element, before);
  }
};

export const remove = (element) => {
  if (typeof element.getElement === `function`) {
    element.getElement().remove();
    element.removeElement();
  } else {
    element.remove();
  }
};
