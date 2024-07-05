#!/usr/bin/env node

/**
 * @file Run app/index.ts
 * @author Mhd Zulfikar Pinem
 */

import app from "../app"
const port = process.env.PORT || 8000

app.listen(port, () => {
  console.log(`Listening on http://localhost:${port}`)
})
