import { expect } from "@std/expect/expect";
import { diff, id } from "./diff.ts";

Deno.test("creates a div", () => {
  id.next = 0;
  expect(diff({ tag: "div" })).toEqual([0, [[0, "createElement", "div"]]]);
});

Deno.test("adds a class", () => {
  id.next = 0;
  expect(diff({ tag: "div", props: { class: "test-class" } }))
    .toEqual([0, [
      [0, "createElement", "div"],
      [0, "setAttribute", "class", "test-class"],
    ]]);
});

Deno.test("adds text content", () => {
  id.next = 0;
  expect(diff({
    tag: "div",
    children: ["Hello, world!"],
  }))
    .toEqual([0, [
      [0, "createElement", "div"],
      [1, "text", "Hello, world!"],
      [0, "replaceChildren", [1]],
    ]]);
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
    .toEqual([0, [
      [0, "createElement", "ul"],
      [1, "createElement", "li"],
      [2, "text", "1"],
      [1, "replaceChildren", [2]],
      [3, "createElement", "li"],
      [4, "text", "2"],
      [3, "replaceChildren", [4]],
      [0, "replaceChildren", [1, 3]],
    ]]);
});

Deno.test("changes text content", () => {
  id.next = 1;
  expect(
    diff(
      { tag: "span", children: ["After"] },
      { tag: "span", id: 0, children: ["Before"] },
    ),
  ).toEqual([0, [
    [1, "text", "After"],
    [0, "replaceChildren", [1]],
  ]]);
});

Deno.test("changes props", () => {
  id.next = 1;
  expect(
    diff(
      {
        tag: "span",
        props: { class: "after-class" },
        children: ["Lorem ipsum"],
      },
      {
        id: 0,
        tag: "span",
        props: { class: "before-class" },
        children: ["Lorem ipsum"],
      },
    ),
  ).toEqual([0, [
    [0, "setAttribute", "class", "after-class"],
    [1, "text", "Lorem ipsum"],
    [0, "replaceChildren", [1]],
  ]]);
});

Deno.test("Removes child", () => {
  id.next = 2;
  expect(
    diff(
      {
        tag: "div",
        children: [{ tag: "button" }],
      },
      {
        id: 0,
        tag: "div",
        children: [{
          id: 1,
          tag: "button",
        }, "Click Me!"],
      },
    ),
  ).toEqual([0, [
    [0, "replaceChildren", []],
  ]]);
});
