const createMenuElementMarkup = (element) => {
  const {value, isActive} = element;

  return `<a class="trip-tabs__btn  ${isActive ? `trip-tabs__btn--active` : ``}" href="#">${value}</a>`;
};

export const createMenuMarkup = (menu) => {
  let elements = ``;

  menu.forEach((element) => {
    elements += createMenuElementMarkup(element);
  });

  return (
    `<nav class="trip-controls__trip-tabs  trip-tabs">
      ${elements}
    </nav>`
  );
};
