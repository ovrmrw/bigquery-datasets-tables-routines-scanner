import * as fs from "fs";
import * as path from "path";
import moment from "moment";

const resultDir = path.join(process.cwd(), "results");

export function formatDatetime(timestamp: number) {
  return moment(timestamp).utcOffset("+09:00").format("YYYY-MM-DD HH:mm:ss.SSS");
}

export function prepare() {
  if (!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir);
  }
}

export function writeFile(filename: string, lines: string[]) {
  const p = path.join(resultDir, filename);
  fs.writeFile(p, lines.join("\n"), (err) => {
    if (err) {
      console.error(err);
    } else {
      console.log("Created: ", p);
    }
  });
}
