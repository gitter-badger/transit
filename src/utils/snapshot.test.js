import { expect } from 'chai'
import path from 'path'
import * as snapshot from './snapshot'

describe('unit: snapshot', () => {
  it('snapshotDir', async () => {
    const dir = path.resolve(__dirname, '../../bin')
    expect(await snapshot.snapshotDir(dir)).to.equal('73400b55f6ee10370ad47c69718c43d78f044819')
  })
})
