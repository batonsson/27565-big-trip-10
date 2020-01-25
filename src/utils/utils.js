export default class Utils {
  static capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  static createElement(markup) {
    const element = document.createElement(`div`);
    element.innerHTML = markup;
    return element.firstChild;
  }

  static replaceElement(oldElement, newElement) {
    oldElement.parentNode.replaceChild(newElement, oldElement);
  }
}
