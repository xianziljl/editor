import createGUID from './createGUID'

export default function formatValue (value) {
  if (!value) value = {}
  if (!value.blocks || !(value.blocks instanceof Array)) value.blocks = []
  if (!value.blocks.length) {
    value.blocks.push({
      type: 'paragraph',
      id: createGUID(),
      text: '',
      ranges: []
    })
  }
  value.blocks.forEach(item => {
    item.id = item.id || createGUID() // 唯一id
    item.key = 0
    if (item.blocks && item.blocks.length) formatValue(item)
  })
}
