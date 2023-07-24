import fs from 'node:fs';
import LogReader from './LogReader';
import { ILogRow } from './LogReader';

let logReader: LogReader;

describe('LogReader', () => {
  beforeAll(() => {
    logReader = new LogReader('./app.log');
  });

  describe('constructor', () => {
    it('should find file and if not exist throw exception', () => {
      expect(() => new LogReader('./app.log')).not.toThrow(Error);
      expect(() => new LogReader('./not-found.log')).toThrow(Error);
    });
  });

  describe('getJson', () => {
    it('should return sanitized log json when logReader.getJson called and just get level we passed', () => {
      const mockLogObject: ILogRow = {
        timestamp: 0,
        loglevel: 'error',
        transactionId: 'some id',
        err: 'some error',
      };
      let spy = jest
        .spyOn(logReader, 'convertStringRowToLogObject')
        .mockImplementation(() => mockLogObject);

      const formattedJson = logReader.getJson('error', true);
      expect(typeof formattedJson).toEqual('string');

      const rowOneObject = JSON.parse(formattedJson)[0] as ILogRow;
      expect(rowOneObject).toHaveProperty('timestamp');
      expect(rowOneObject).toHaveProperty('loglevel');
      expect(rowOneObject).toHaveProperty('transactionId');
      expect(rowOneObject).toHaveProperty('err');

      const convertResult = logReader.convertStringRowToLogObject;
      expect(convertResult).toHaveBeenCalledTimes(
        JSON.parse(formattedJson).length
      );

      spy.mockRestore();
    });
  });

  describe('convertStringRowToLogObject', () => {
    const existSpy = jest
      .spyOn(fs, 'existsSync')
      .mockImplementation(() => true);
    const readSpy = jest
      .spyOn(fs, 'readFileSync')
      .mockImplementation(
        () =>
          '2044-08-09T02:12:51.253Z - info - {{"transactionId":"some","details":"text"}'
      );

    const logReaderInstance = new LogReader('');
    expect(() => logReaderInstance.save('./errors.json')).toThrow(Error);

    existSpy.mockRestore();
    readSpy.mockRestore();
  });

  describe('save', () => {
    it('should save new file when save method called and return true', () => {
      const spy = jest.spyOn(fs, 'writeFileSync').mockImplementation(() => {});
      const result = logReader.save('./errors.json', 'error', true);
      expect(result).toBeTruthy();
      spy.mockRestore();
    });

    it('should not save new file when save method called and return false', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => {});
      const result = logReader.save('.', 'error', true);
      expect(result).not.toBeTruthy();
      spy.mockRestore();
    });
  });
});
