export type VDOMNode =
  | {
    tag: string;
    id?: number;
    props?: Record<string, string | number | Function> | null;
    children?: VDOMNode[];
  }
  | string;

export type Instruction =
  | [number, "value", string]
  | [number, "createElement", string]
  | [number, "setAttribute", string, (string | number)]
  | [number, "replaceChildren", (string | number)[]];

export const id = { next: 0 };
export const fns = [];

export function diff(to?: VDOMNode, from?: VDOMNode): Instruction[] {
  if (to === undefined) return [];
  const instructions: Instruction[] = [];

  if (from === undefined) {
    if (typeof to === "string") return [[id.next++, "value", to]];
    if (typeof to === "number") return [[id.next++, "value", `${to}`]];

    to.id = id.next++;
    instructions.push([to.id, "createElement", to.tag]);

    if (to.props) {
      for (const [prop, value] of Object.entries(to.props)) {
        if (typeof prop === "function") {
          const fnId = id.next++;
          fns[fnId] = prop;
          instructions.push([to.id, "setAttribute", prop, fnId]);
        } else {
          instructions.push([to.id, "setAttribute", prop, `${value}`]);
        }
      }
    }

    if (to.children) {
      const childIds: number[] = [];

      for (const child of to.children) {
        const childInstructions = diff(child);
        const childId = childInstructions?.[0]?.[0];
        if (!childId) {
          throw new Error(
            `Could not find child id in instructions: ${
              JSON.stringify(childInstructions)
            }`,
          );
        }
        childIds.push(childId);
        instructions.push(...childInstructions);
      }
      instructions.push([to.id, "replaceChildren", childIds]);
    }
  }
  return instructions;
}
