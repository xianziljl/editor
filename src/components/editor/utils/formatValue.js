import createGUID from './createGUID'

export default function formatValue (value) {
  if (!value) return
  if (!value.blocks || !(value.blocks instanceof Array)) value.blocks = []
  value.blocks.forEach(item => {
    item.key = item.key || createGUID()
    if (item.blocks && item.blocks.length) formatValue(item)
  })
}
