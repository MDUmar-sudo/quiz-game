// build-scripts/bundle-functions.js
import { build } from "esbuild";

build({
    entryPoints: ["functions/quiz.js"],
    bundle: true,
    platform: "node",
    target: "node18",
    outdir: "functions-dist",
    external: [], // you can leave this empty if bundling all
    loader: {
        ".ejs": "text", // if needed, handles EJS templates
    }
}).catch(() => process.exit(1));
