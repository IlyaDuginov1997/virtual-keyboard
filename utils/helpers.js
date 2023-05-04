export const showOneElement = (parent, selector = 'span') => {
  const activeKey = parent.querySelector(selector);
  activeKey.classList.remove('hidden');
};

export const hideAllElements = (parent, selector = 'span') => {
  const childs = parent.querySelectorAll(selector);
  Array.from(childs, (child) => {
    child.classList.add('hidden');
    return null;
  });
};
