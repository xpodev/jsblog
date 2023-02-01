import { RunCommand } from "./run-command";
import { registerCommand } from "../command";
import { ExampleCommand } from "./example-command";

registerCommand(RunCommand);
registerCommand(ExampleCommand);