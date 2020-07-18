export class Stash {
  private stash: string[] = [];

  constructor() {}

  push(...log: string[]) {
    this.stash.push(log.join(' '));
  }

  toString() {
    return this.stash.join('\n');
  }
}

export function title(color: any, title: string, ...rest: string[]): string {
  return (
    color.inverse(` ${title} `) +
    (rest.length > 0 ? ' ' + color(rest.join(' ')) : '')
  );
}
