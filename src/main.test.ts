import { expect } from "@std/expect";
import { TestServer } from "../test/TestServer.ts";

Deno.test("It can find root element", async () => {
  await new TestServer({ port: 3000 }).run(async (browser) => {
    const page = await browser.newPage("http://localhost:3000");
    const root = await page.evaluate(() => document.getElementById("root"));
    expect(root).not.toBeNull();
  });
});
