export function render(domElement: HTMLElement, element: Element) {
  // domElement.innerHTML = toString(element);
}

type Element = {};
export function createElement(
  tag: string,
  props: Record<string, string>,
  ...children: Element[]
): Element {
  if (tag[0] === tag[0]?.toLowerCase()) {
    // html
  } else {
    // element
  }
  return {};
}
