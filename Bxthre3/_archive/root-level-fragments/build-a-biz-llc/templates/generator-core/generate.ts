#!/usr/bin/env bun
// Build-A-Biz App Generator
// Usage: bun generate.ts <config.json>

import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { configSchema } from "../_shared/schema";
import { generateApp } from "./builder";

async function main() {
  const configPath = process.argv[2];
  
  if (!configPath) {
    console.error("Usage: bun generate.ts path/to/config.json");
    process.exit(1);
  }
  
  const configJson = JSON.parse(await readFile(resolve(configPath), "utf8"));
  
  const parseResult = configSchema.safeParse(configJson);
  
  if (!parseResult.success) {
    console.error("Config validation failed:");
    parseResult.error.errors.forEach((e) => {
      console.error(`  ${e.path.join('.')}: ${e.message}`);
    });
    process.exit(1);
  }
  
  const config = parseResult.data;
  const outputDir = process.argv[3] || "./dist";
  
  await generateApp(config, {
    configPath,
    outputDir,
    template: config.meta.template,
  });
  
  console.log("\nNext steps:");
  console.log(`  cd ${outputDir}/${config.meta.slug}`);
  console.log("  bun install");
  console.log("  bun dev");
  console.log("\nFor mobile:");
  console.log("  bun run sync");
  console.log("  bun run ios");
  console.log("  bun run android");
}

main();
