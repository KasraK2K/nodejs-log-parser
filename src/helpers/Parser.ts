class Parser {
  private arguments: string[] = [];
  private argumentsMap: Map<string, string> = new Map([]);

  constructor() {
    this.arguments = process.argv.slice(2);
    this.mapArguments();
  }

  private mapArguments(): void {
    for (let index = 0; index < this.arguments.length; index += 2)
      this.argumentsMap.set(this.arguments[index], this.arguments[index + 1]);
  }

  getArgument(argument: string): string {
    return this.argumentsMap.get(argument) ?? '';
  }
}

export default Parser;
