import nodemon from "nodemon";

const watcher = nodemon({
  script: "src/run.ts",
  cwd: process.cwd(),
  watch: ["src/run.ts"],
  ignore: ["src/client", "src/server"],
});

watcher.on("restart", () => {
  process.env.BROWSER = "none";
});
