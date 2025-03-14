import { serveDir } from "@std/http/file-server";
import { Browser, launch } from "astral";

export interface Opts {
  port: number;
}
export class TestServer {
  private browser: Browser | undefined;
  private server: Deno.HttpServer | undefined;
  private port: number;

  constructor(opts?: Opts) {
    this.port = opts?.port ?? 3000;
  }

  async run(test: (browser: Browser) => Promise<unknown>) {
    try {
      this.server = this.listen(this.port);
      this.browser = await launch({
        args: ["--no-sandbox", "--disable-setuid-sandbox"],
      });

      // Run tests
      await test(this.browser);
    } catch (e: unknown) {
      throw e;
    } finally {
      await this.browser?.close();
      await this.server?.shutdown();
    }
  }

  private listen(port: number) {
    return Deno.serve(
      {
        port: port,
        onListen: () => {
          // silent
        },
      },
      (req) =>
        serveDir(req, {
          fsRoot: "./test/static",
          quiet: true,
        })
    );
  }
}
