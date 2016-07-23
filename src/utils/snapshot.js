import path from 'path'
import glob from 'glob'
import checksum from 'checksum'

export async function snapshotDir (dir) {
  const files = await new Promise((resolve, reject) => {
    glob(`${path.resolve(dir)}/**/*`, (err, files) => {
      if (err) reject(err)
      else resolve(files)
    })
  })

  const sums = await Promise.all(files.map((file) => {
    return new Promise((resolve, reject) => {
      checksum.file(file, (err, sum) => {
        if (err) reject(err)
        else resolve(sum)
      })
    })
  }))

  return checksum(sums.sort().join())
}

// export function getChecksumFile (file) {
//   return new Promise((resolve, reject) => {
//
//   })
// }
//
// export function compareChecksum () {
//
// }
//
// export function saveChecksum () {
//
// }
