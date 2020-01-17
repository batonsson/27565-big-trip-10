export const render = (container, element, before) => {
  if (typeof element.getElement === `function`) {
    container.insertBefore(element.getElement(), before);
  } else {
    container.insertBefore(element, before);
  }
};
