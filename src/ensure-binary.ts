// Copyright 2026 Han Wang. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
import {
  getPlatformInfo,
  getDownloadUrl,
  getArchiveName,
  getBrowsersDir,
  getExecutablePath,
} from "./paths.js";
import { downloadToFile } from "./http.js";

/**
 * Ensures the ABP browser binary is available, downloading it if necessary.
 * Returns the path to the executable.
 *
 * Safe to call multiple times — skips download if the binary already exists.
 * Logs progress to stderr to avoid corrupting stdout (important for MCP proxy).
 */
export async function ensureBinary(): Promise<string> {
  if (process.env.ABP_SKIP_DOWNLOAD === "1") {
    process.stderr.write("ABP_SKIP_DOWNLOAD=1, skipping binary download\n");
    return getExecutablePath();
  }

  if (process.env.ABP_BROWSER_PATH) {
    if (fs.existsSync(process.env.ABP_BROWSER_PATH)) {
      return process.env.ABP_BROWSER_PATH;
    }
    process.stderr.write(
      `WARNING: ABP_BROWSER_PATH set but file not found: ${process.env.ABP_BROWSER_PATH}\n`,
    );
  }

  const execPath = getExecutablePath();
  if (fs.existsSync(execPath)) {
    return execPath;
  }

  const info = getPlatformInfo();
  const url = getDownloadUrl(info);
  const browsersDir = getBrowsersDir();
  const archiveName = getArchiveName(info);
  const archivePath = path.join(browsersDir, archiveName);

  process.stderr.write(
    `Downloading ABP for ${info.platform}-${info.arch}...\n`,
  );
  process.stderr.write(`URL: ${url}\n`);

  fs.mkdirSync(browsersDir, { recursive: true });

  await downloadToFile(url, archivePath);
  process.stderr.write(`Downloaded: ${archivePath}\n`);

  process.stderr.write("Extracting...\n");
  if (info.archiveExt === ".tar.gz") {
    execSync(`tar -xzf "${archivePath}" -C "${browsersDir}"`, {
      stdio: "inherit",
    });
  } else {
    if (process.platform === "win32") {
      execSync(
        `powershell -Command "Expand-Archive -Path '${archivePath}' -DestinationPath '${browsersDir}' -Force"`,
        { stdio: "inherit" },
      );
    } else {
      execSync(`unzip -qo "${archivePath}" -d "${browsersDir}"`, {
        stdio: "inherit",
      });
    }
  }

  fs.unlinkSync(archivePath);

  if (!fs.existsSync(execPath)) {
    throw new Error(`Extraction failed: executable not found at ${execPath}`);
  }

  if (process.platform !== "win32") {
    fs.chmodSync(execPath, 0o755);
  }

  process.stderr.write(`ABP installed: ${execPath}\n`);
  return execPath;
}
