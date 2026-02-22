// Copyright 2026 Han Wang. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Postinstall entry point — downloads the ABP browser binary.
// The actual logic lives in ensure-binary.ts to avoid side effects when imported.

import { ensureBinary } from "./ensure-binary.js";

ensureBinary().catch((err) => {
  console.error("Failed to install ABP binary:", err.message);
  console.error(
    "You can set ABP_BROWSER_PATH to point to an existing ABP binary",
  );
  process.exit(1);
});
