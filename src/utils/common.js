import fs from 'fs-promise'

/**
 * An alias for fs-extra ensureFile, but allows file
 * to be created with optional JSON data.
 */
export async function ensureJson (file, data) {
  if (!await fs.exists(file)) {
    await fs.outputFile(file, JSON.stringify(data, null, 2))
  }
}
