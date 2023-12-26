import childProcess from "child_process";
import fs from "fs";
import readline from "readline";

const { stdout } = childProcess.spawn("git", ["diff"]);
const rl = readline.createInterface({ input: stdout });

let removed = [];
let added = [];
let diff = "";
for await (const line of rl) {
  if (line.startsWith("-")) {
    removed.push(line);
  } else if (line.startsWith("+")) {
    added.push(line);
  } else if (removed.length > 0 || added.length > 0) {
    if (
      removed.length !== added.length ||
      removed.some((line, i) => line.length !== added[i].length)
    ) {
      diff += `${removed.join("\n")}\n${added.join("\n")}\n\n`;
    }
    removed = [];
    added = [];
  }
}
fs.writeFileSync("diff.diff", diff);
