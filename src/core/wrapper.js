import handler from './_index'

export default function (evt, ctx, cb) {
  try {
    const result = handler.default
      ? handler.default(evt, ctx)
      : handler(evt, ctx)

    if (result.then) {
      result.then((res) => cb(null, res)).catch(cb)
    } else {
      cb(null, result)
    }
  } catch (err) {
    cb(err.message || err)
  }
}
