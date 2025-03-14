import { expect } from "@std/expect";
import { afterAll, beforeAll, describe, it } from "@std/testing/bdd";
import { Browser, launch } from "astral";
import { StaticServer } from "./StaticServer.ts";

let server: StaticServer;

describe("browser tests", () => {
  let browser: Browser;
  beforeAll(async () => {
    browser = await launch({
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
    server = new StaticServer();
    server.listen(3000);
  });
  afterAll(async () => {
    await browser?.close();
    server.close();
  });
  it("can find root element", async () => {
    const page = await browser.newPage("http://localhost:3000");
    const root = await page.evaluate(() => document.getElementById("root"));
    expect(root).not.toBeNull();
  });
});
