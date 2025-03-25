import { VDOMNode } from "./diff.ts";

export function createElement(
  tag: string,
  props: Record<string, string> | null,
  ...children: VDOMNode[]
): VDOMNode {
  return {
    tag,
    props,
    children,
  };
}
