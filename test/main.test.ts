import { expect } from "@std/expect";
import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { Browser, launch } from "astral";

describe("browser tests", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch();
  });
  afterAll(async () => {
    await browser?.close();
  });
  it("can find root element", async () => {
    const page = await browser.newPage("http://localhost:3000");
    const root = await page.evaluate(() => document.getElementById("root"));
    expect(root).not.toBeNull();
  });
});
