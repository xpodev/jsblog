import type { Provider, Type } from "@jsblog/core";

const commands = new Map<string, Command<any>>();

interface ICommand<T> {
  run(args: T): Provider<void>;
}

const argumentParser = {
  string: String,
  number: (value: string) => {
    const number = Number(value);
    if (Number.isNaN(number)) {
      throw new Error(`"${value}" is not a number`);
    }
    return number;
  },
  boolean: (value: string) => {
    if (value === "true") {
      return true;
    }
    if (value === "false") {
      return false;
    }
    throw new Error(`"${value}" is not a boolean`);
  },
};

type Value<T> = T[keyof T];

type CommandArgumentType = Value<typeof argumentParser>;

type CommandArgument = {
  index: number;
  name: string;
  parser: CommandArgumentType;
  required: boolean;
  isArray: boolean;
  isNamed: boolean;
  default?: unknown;
};

export abstract class Command<Args extends object = {}>
  implements ICommand<Args>
{
  constructor() {}

  public name = "";
  protected abstract signature: string;
  protected description = "";

  abstract run(args: Args): Provider<void>;

  parse(args: string[]): Args {
    const parsedArgs = {} as Args;

    const restArgs = this.commandArgs.find((arg) => arg.name.startsWith("..."));
    if (restArgs) {
      parsedArgs[restArgs.name.slice(3)] = [];
    }
    let indexedArgs = 0;

    const setValue = (commandArg: CommandArgument, value: unknown) => {
      let key = commandArg.name;
      if (commandArg.name.startsWith("...")) {
        key = commandArg.name.slice(3);
      }

      if (commandArg.isArray) {
        if (!Array.isArray(parsedArgs[key])) {
          parsedArgs[key] = [];
        }
        (parsedArgs[key] as unknown[]).push(value);
      } else {
        parsedArgs[key] = value;
      }
    };

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (arg.startsWith("--")) {
        const [name, value] = arg.slice(2).split("=");
        const commandArg = this.commandArgs.find(
          (arg) => arg.name === name && arg.isNamed
        );
        if (!commandArg) {
          throw new Error(`Invalid argument: ${name}`);
        }
        if (value) {
          setValue(commandArg, commandArg.parser(value));
        } else {
          const nextArg = args[i + 1];
          if (nextArg && !nextArg.startsWith("-")) {
            setValue(commandArg, commandArg.parser(nextArg));
            i++;
          } else if (commandArg.parser === argumentParser.boolean) {
            setValue(commandArg, true);
          } else {
            throw new Error(`Missing argument value: ${name}`);
          }
        }
      } else if (arg.startsWith("-")) {
        // ...
      } else {
        const commandArg = this.commandArgs.find(
          (arg) => arg.index === indexedArgs
        );
        if (!commandArg) {
          if (restArgs) {
            setValue(restArgs, restArgs.parser(arg));
            continue;
          }
          throw new Error(`Invalid argument: ${arg}`);
        }
        setValue(commandArg, commandArg.parser(arg));
        indexedArgs++;
      }
    }

    for (let commandArg of this.commandArgs) {
      if (commandArg.name in parsedArgs) {
        continue;
      }
      if (commandArg.default) {
        parsedArgs[commandArg.name] = commandArg.default;
      } else if (commandArg.required) {
        throw new Error(`Missing required argument: ${commandArg.name}`);
      }
    }

    return parsedArgs;
  }

  private commandArgs: CommandArgument[] = [];

  parseSignature() {
    const signature = this.signature.split(" ");
    this.name = signature.shift();
    if (!this.name) {
      throw new Error(`Invalid command signature: missing command name`);
    }

    let indexedArgs = 0;
    for (let arg of signature) {
      const currentArg = {
        index: -1,
        name: null,
        required: true,
        default: null,
        isArray: false,
        isNamed: false,
        parser: argumentParser.string,
      } as CommandArgument;
      if (arg.match(/^\{.*\}$/)) {
        currentArg.isNamed = true;
        arg = arg.slice(1, -1);
      } else {
        currentArg.index = indexedArgs++;
      }
      const [nameType, defaultValue] = arg.split("=");
      if (defaultValue) {
        currentArg.default = defaultValue;
        currentArg.required = false;
      }
      let [name, type] = nameType.split("|");
      if (!name) {
        throw new Error(`Invalid command signature: missing argument name`);
      }
      currentArg.name = name;
      this.commandArgs.push(currentArg);
      if (name.endsWith("?")) {
        currentArg.required = false;
        currentArg.name = name.slice(0, -1);
      }
      if (type) {
        if (type.endsWith("[]")) {
          if (!currentArg.isNamed) {
            throw new Error(
              `Invalid command signature: array argument must be named`
            );
          }
          type = type.slice(0, -2);
          currentArg.isArray = true;
        }
        if (!(type in argumentParser)) {
          throw new Error(
            `Invalid command signature: invalid argument type ${type}`
          );
        }
        currentArg.parser = argumentParser[type];
        if (currentArg.default) {
          currentArg.default = currentArg.parser(currentArg.default as string);
        }
      }
      // We put this at the end so we make sure the type is array even if the signature is wrong
      if (name.startsWith("...")) {
        currentArg.isArray = true;
        // Note that rest is always optional
        currentArg.required = false;
        // Since this is rest, we don't need to parse the rest of the signature
        // Need to note that in the docs
        return;
      }
    }
  }
}

export function registerCommand(command: Type<Command>) {
  const instance = new command();
  instance.parseSignature();
  commands.set(instance.name, instance);
}

export function runCommand(name: string, args: string[]) {
  const command = commands.get(name);
  if (!command) {
    throw new Error(`Command "${name}" not found`);
  }

  command.run(command.parse(args));
}
