import stripAnsi from 'strip-ansi';

interface Item {
  body: string;
  extra: boolean;
}

export class Stash {
  private stash: Item[] = [];

  constructor() {}

  push(log: string, { extra = false } = {}) {
    this.stash.push({ body: log, extra });
  }

  toString({ extra = true } = {}) {
    return stripAnsi(
      this.stash
        .filter((item) => (extra ? true : !item.extra))
        .map((item) => item.body)
        .join('\n')
    );
  }

  toCLIString() {
    return this.stash.map((item) => item.body).join('\n');
  }

  render() {
    console.log(this.toCLIString());
  }
}

export function makeTitle(
  color: any,
  title: string,
  ...rest: string[]
): string {
  return (
    color(`# ${title}`) + (rest.length > 0 ? ' ' + color(rest.join(' ')) : '')
  );
}
