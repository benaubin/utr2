import { readFileSync, writeFileSync } from "fs";

import { Parcel } from "@parcel/core";

const PUBLIC_URL = "http://localhost:3000";

let bundler = new Parcel({
  entries: "src/frame.html",
  defaultConfig: "@parcel/config-default",
  mode: "production",
  defaultTargetOptions: {
    publicUrl: PUBLIC_URL,
    engines: {
      browsers: ["last 1 Chrome version"],
    },
  },
});
let { bundleGraph, buildTime } = await bundler.run();
let bundles = bundleGraph.getBundles();
console.log(`✨ Built source in ${buildTime}ms!`);

const loaderTemplateSrc = readFileSync("loader.template.js", {
  encoding: "utf-8",
});
const loaderSrc = loaderTemplateSrc.replace(
  "$FRAME_SOURCE_URL",
  JSON.stringify(PUBLIC_URL + "/frame.html")
);
writeFileSync("dist/loader.js", loaderSrc);
