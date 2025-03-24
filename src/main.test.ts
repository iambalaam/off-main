import { createElement, render } from "./main.ts";
import { expect } from "@std/expect";
import { bundle } from "@deno/emit";
import { TestServer } from "../test/TestServer.ts";

Deno.test("It can find root element", async () => {
  await new TestServer({ port: 3000 }).run(async (browser) => {
    const page = await browser.newPage("http://localhost:3000");
    const root = await page.evaluate(() => document.getElementById("root"));
    expect(root).not.toBeNull();
  });
});

Deno.test("It can bundle", async () => {
  const { code } = await bundle("./src/create-div.ts");
  await new TestServer({ port: 3000 }).run(async (browser) => {
    const page = await browser.newPage("http://localhost:3000");
    await page.evaluate(code);

    const html = await page.evaluate(() => document.documentElement.outerHTML);
    expect(html).toMatch(/<div>Test<\/div>/);
  });
});
