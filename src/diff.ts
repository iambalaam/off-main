export type VDOMNode =
  | {
    tag: string;
    id?: number;
    props?: Record<string, string | number | Function> | null;
    children?: VDOMNode[];
  }
  | string;

export type Instruction =
  | [number, "text", string]
  | [number, "function", string]
  | [number, "createElement", string]
  | [number, "setAttribute", string, (string | number)]
  | [number, "removeAttribute", string]
  | [number, "replaceChildren", (string | number)[]];

export const id = { next: 0 };
export const fns = [];

export function diff(
  to: VDOMNode,
  from?: VDOMNode,
): [number, Instruction[]] | undefined {
  if (typeof to === "string" || typeof to === "number") {
    const i = id.next++;
    return [i, [[i, "text", `${to}`]]];
  }

  const instructions: Instruction[] = [];

  if (from === undefined || typeof from === "string") {
    // Create new tag
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
        const [childId, childInstructions] = diff(child) || [];
        if (!childId) {
          throw new Error(
            `Could not find child id in instructions: ${
              JSON.stringify(childInstructions)
            }`,
          );
        }
        childIds.push(childId);
        instructions.push(...childInstructions || []);
      }
      instructions.push([to.id, "replaceChildren", childIds]);
    }
    return [to.id, instructions];
  }

  if (to.tag === from.tag) {
    // Reuse component
    if (from.id === undefined) {
      throw new Error(`No id on node: ${JSON.stringify(from)}`);
    }

    to.id = from.id;
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
    if (from.props) {
      for (const prop of Object.keys(from.props)) {
        if (!to.props || !(prop in to.props)) {
          instructions.push([to.id, "removeAttribute", prop]);
        }
      }
    }

    if (to.children || from.children) {
      const toChildren = to.children || [];
      const fromChildren = from.children || [];

      const childIds: number[] = [];
      const childInstructions: Instruction[] = [];

      for (let i = 0; i < toChildren.length; i++) {
        const toChild = toChildren[i];
        const fromChild = fromChildren[i];
        const [cId, cInst] = diff(toChild!, fromChild) || [];
        if (cInst?.length) {
          if (!cId) {
            throw new Error(
              `Could not find child id in instructions: ${
                JSON.stringify(cInst)
              }`,
            );
          }
          childInstructions.push(...cInst);
          childIds.push(cId);
        }
      }

      instructions.push(...childInstructions);
      instructions.push([to.id, "replaceChildren", childIds]);
      return [to.id!, instructions];
    }
  }
}
