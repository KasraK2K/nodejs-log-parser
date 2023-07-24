import fs from 'node:fs';

export interface ILogRow {
  timestamp: number;
  loglevel: string;
  transactionId: string;
  err: string;
}

class LogReader {
  private fileContent: string = '';
  private fileRows: string[] = [];
  private logs: ILogRow[] = [];

  constructor(private path: string) {
    if (fs.existsSync(this.path)) {
      this.fileContent = fs.readFileSync(this.path, { encoding: 'utf8' });
      this.fileRows = this.fileContent.split('\n');
    } else throw new Error(`input file not found`);
  }

  getJson(level?: string, pretty = false): string {
    this.logs = [];
    for (const row of this.fileRows) {
      const record = this.convertStringRowToLogObject(row, level);
      if (record !== null) this.logs.push(record);
    }
    return pretty
      ? JSON.stringify(this.logs, null, 4)
      : JSON.stringify(this.logs);
  }

  convertStringRowToLogObject(row: string, level?: string): ILogRow | null {
    let record: ILogRow;

    const timestamp = row.slice(0, row.indexOf(' -'));
    const loglevel = row.slice(row.indexOf('- ') + 2, row.indexOf(' - {'));

    if (level && loglevel !== level) return null;

    const rowLogContent = row.slice(row.indexOf(' - {') + 3).trim();

    try {
      // Convert rowLogContent to an object because it possible to extend in the future
      const rowLogContentObject = JSON.parse(rowLogContent);
      const transactionId = rowLogContentObject.transactionId;
      const err = rowLogContentObject.err;

      record = {
        timestamp: new Date(timestamp).getTime(),
        loglevel,
        transactionId,
        err,
      };
    } catch (error) {
      throw new Error(`error on parse row: ${row}`);
    }

    return record;
  }

  save(saveFullPath: string, level?: string, pretty = false): boolean {
    const jsonContent = this.getJson(level, pretty);

    try {
      fs.writeFileSync(saveFullPath, jsonContent);
      return true;
    } catch (error) {
      console.error(error);
      return false;
    }
  }
}

export default LogReader;
