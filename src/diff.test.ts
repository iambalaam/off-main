import { expect } from "@std/expect/expect";
import { diff, id } from "./diff.ts";

Deno.test("creates a div", () => {
  id.next = 0;
  expect(diff({ tag: "div" })).toEqual([[0, "createElement", "div"]]);
});

Deno.test("adds a class", () => {
  id.next = 0;
  expect(diff({ tag: "div", props: { class: "test-class" } }))
    .toEqual([
      [0, "createElement", "div"],
      [0, "setAttribute", "class", "test-class"],
    ]);
});

Deno.test("adds text content", () => {
  id.next = 0;
  expect(diff({
    tag: "div",
    children: ["Hello, world!"],
  }))
    .toEqual([
      [0, "createElement", "div"],
      [1, "value", "Hello, world!"],
      [0, "replaceChildren", [1]],
    ]);
});

Deno.test("adds children", () => {
  id.next = 0;
  expect(diff({
    tag: "ul",
    children: [
      { tag: "li", children: ["1"] },
      { tag: "li", children: ["2"] },
    ],
  }))
    .toEqual([
      [0, "createElement", "ul"],
      [1, "createElement", "li"],
      [2, "value", "1"],
      [1, "replaceChildren", [2]],
      [3, "createElement", "li"],
      [4, "value", "2"],
      [3, "replaceChildren", [4]],
      [0, "replaceChildren", [1, 3]],
    ]);
});
