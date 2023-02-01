#!/usr/bin/env node

import "./commands";
import { runCommand } from "./command";

const action = process.argv[2] ?? "example";
const args = process.argv.slice(3);

// runCommand(action, args.length ? args : ["help", "3", "named", "typedNamed", "true", "false", "false", "true"]);
runCommand(action, args.length ? args : ["help", "--namedArg1=hello", "--namedArg2", "10.5", "10", "false", "true"]);
console.log("Done");