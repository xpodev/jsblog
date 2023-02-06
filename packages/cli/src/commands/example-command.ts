import { Command } from "../command";

interface ExampleCommandArgs {
  action: string;
  args: string[];
}

export class ExampleCommand extends Command<ExampleCommandArgs> {
  run(args: ExampleCommandArgs) {
    console.log(args);  
  }

  protected signature = "example arg1 arg2|number=2 {namedArg1} {namedArg2|number} {...rest|boolean}";
}
