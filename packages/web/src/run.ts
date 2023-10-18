import { spawn } from "child_process";
import chalk from "chalk";
import path from "path";

const serviceColors = [
  chalk.bgBlue,
  chalk.black.bgGreen,
  chalk.black.bgCyan,
  chalk.bgMagenta,
  chalk.black.bgYellow,
];

const info = (service: string) => {
  const color = serviceColors.shift()!;
  serviceColors.push(color);
  const lineStart = `${color(`${service}`)} `;
  return (data: Buffer) => {
    process.stdout.write(
      `${lineStart}${data.toString()}`
    );
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
    DANGEROUSLY_DISABLE_HOST_CHECK: 'true'
  },
});

server.stdout.on("data", info("SERVER"));
server.stderr.on("data", error("SERVER"));

client.stdout.on("data", info("CLIENT"));
client.stderr.on("data", error("CLIENT"));
