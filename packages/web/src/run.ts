import { spawn } from "child_process";
import chalk from "chalk";
import path from "path";

const info = (service: string) => {
  return (data: Buffer) => {
    process.stdout.write(`${chalk.bgBlue(`${service}`)} ${data.toString()}`);
  };
};

const error = (service: string) => {
  return (data: Buffer) => {
    process.stdout.write(`${chalk.bgRed(`${service}`)} ${data.toString()}`);
  };
};

const server = spawn("npm", ["run", "start:dev"], {
  cwd: path.join(__dirname, "server"),
  shell: true,
  env: {
    ...process.env,
  },
});

const client = spawn("npm", ["run", "start"], {
  cwd: path.join(__dirname, "client"),
  shell: true,
  env: {
    ...process.env,
  },
});

server.stdout.on("data", info("SERVER"));
server.stderr.on("data", error("SERVER"));

client.stdout.on("data", info("CLIENT"));
client.stderr.on("data", error("CLIENT"));

