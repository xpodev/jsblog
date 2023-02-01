import { Command } from "../command";

interface RunCommandArgs {
  action: string;
  args: string[];
}

export class RunCommand extends Command<RunCommandArgs> {
  run(args: RunCommandArgs) {
    console.log(args);
    
  }

  protected signature = "run {action|string} {...args|string[]}";
}
