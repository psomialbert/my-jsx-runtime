var uuidv4 = require('uuid').v4;

function jsx(type, config) {
  if (typeof type === 'function') {
    return type(config);
  }
  const { children = [], ...props } = config;
  const childrenProps = [].concat(children);
  return {
    type,
    props: {
      ...props,
      children: childrenProps.map((child) =>
        typeof child === 'object' ? child : createTextElement(child)
      ),
    },
  };
}
function createTextElement(text) {
  return {
    type: 'TEXT_ELEMENT',
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function render(element, container, placeholder) {
  const dom =
    element.type === 'TEXT_ELEMENT'
      ? container.ownerDocument.createTextNode('')
      : container.ownerDocument.createElement(element.type);
  const isProperty = (key) => key !== 'children';
  console.log("element.props = ", element.props);
  Object.keys(element.props)
    .filter(isProperty)
    .forEach((name) => {
      dom[name] = element.props[name];
    });

  element.props.children.forEach((child) => render(child, dom));
  if (placeholder) {
    const id = uuidv4();

    dom.setAttribute('id', id);
    container.insertBefore(dom, placeholder);
    placeholder.remove();
    return id;
  } else {
    container.appendChild(dom);
  }
}

module.exports = { jsxs: jsx, jsx: jsx, render };
