import fs from "fs";
import got from "got";
import beautify from "js-beautify";
import * as prettier from "prettier";

async function getScript(url, name) {
  const page = await got(url);
  const scriptSrc = page.body.match(/src="([^"]+\/main\.([0-9a-f]+)\.js)"/);
  console.log(name, scriptSrc[2]);
  const mainJs = await got(scriptSrc[1]);
  const beautified = beautify(mainJs.body, { unescape_strings: true });
  await fs.promises.writeFile(name, beautified);
  return scriptSrc[2];
}

async function getCSS(url, name) {
  const page = await got(url);
  const cssSrc = page.body.match(/href="([^"]+\/main\.([0-9a-f]+)\.css)"/);
  console.log(name, cssSrc[2]);
  const mainCss = await got(cssSrc[1]);
  const beautified = await prettier.format(mainCss.body, { parser: "css" });
  await fs.promises.writeFile(name, beautified);
  return cssSrc[2];
}

const scripts = await Promise.all([
  getScript("https://chzzk.naver.com/", "chzzk.js"),
  getScript("https://studio.chzzk.naver.com/", "studio.js"),
  getCSS("https://chzzk.naver.com/", "chzzk.css"),
]);
await fs.promises.writeFile("message.txt", scripts.join(" "));
