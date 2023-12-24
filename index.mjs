import fs from "fs";
import got from "got";
import beautify from "js-beautify";

async function getScript(url, name) {
  const page = await got(url);
  const scriptSrc = page.body.match(/src="([^"]+\/main\.([0-9a-f]+)\.js)"/);
  console.log(name, scriptSrc[2]);
  const mainJs = await got(scriptSrc[1]);
  const beautified = beautify(mainJs.body, { unescape_strings: true });
  await fs.promises.writeFile(name, beautified);
  return scriptSrc[2];
}

const scripts = await Promise.all([
  getScript("https://chzzk.naver.com/", "chzzk.js"),
  getScript("https://studio.chzzk.naver.com/", "studio.js"),
]);
await fs.promises.writeFile("message.txt", scripts.join(" "));
