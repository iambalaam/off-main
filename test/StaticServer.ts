import { serveDir } from "@std/http/file-server";

export class StaticServer {
  abort: AbortController;

  constructor() {
    this.abort = new AbortController();
  }

  async listen(port: number) {
    await Deno.serve(
      {
        signal: this.abort.signal,
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

  close() {
    this.abort.abort();
  }
}
