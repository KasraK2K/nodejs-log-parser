import Parser from './helpers/Parser';
import LogReader from './helpers/LogReader';

const parser = new Parser();
const inputFilePath = parser.getArgument('--input');
const outputFilePath = parser.getArgument('--output');
const logLevel = parser.getArgument('--level');

let pretty: boolean = ['1', 'true', 'yes'].includes(
  parser.getArgument('--pretty')
)
  ? true
  : false;

const fileReader = new LogReader(inputFilePath);

fileReader.save(outputFilePath, logLevel, pretty);
