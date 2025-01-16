import fs from "fs";
import path from "path";

const pkgPath = path.join(process.cwd(), "package.json");
const manifestPath = path.join(process.cwd(), "public", "manifest.json");

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

manifest.version = pkg.version;
manifest.version_code = pkg.version;

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
console.log(`Updated manifest.json to version ${pkg.version}`);
