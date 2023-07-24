import Parser from './Parser';

let parser: Parser;

describe('Parser', () => {
  beforeAll(() => {
    process.argv.push('--input', './app.log');
    process.argv.push('--output', './errors.json');

    parser = new Parser();
  });

  it('parser should have getArgument method to get value of argument. if argument was not provided it should be return empty string', () => {
    const input = parser.getArgument('--input');
    const notFoundInput = parser.getArgument('--not-found');
    expect(input.length).toBeGreaterThan(0);
    expect(notFoundInput).toEqual('');
  });
});
