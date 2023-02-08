import next from "next";
import blog from "./blog";
import { createServer } from "http";

const port = parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "localhost";

async function bootstrap() {
  await blog.init();
  // Stupid hack to make sure the blog is initialized before the api routes are loaded
  globalThis.blog = blog;
  
  console.log("Blog initialized");

  const app = next({
    dev: process.env.NODE_ENV !== "production",
    port,
    dir: ".",
    hostname,
  });

  const handle = app.getRequestHandler();
  await app.prepare();

  createServer((req, res) => {
    handle(req, res);
  }).listen(port, hostname, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}

bootstrap();
