export default [
  function (value, context) {
    const reg = /^>\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'blockquote'
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= 2 })
      return true
    }
  },
  function (value, context) {
    const reg = /^#+\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'heading'
      const level = match[0].length - 1
      value.level = level > 4 ? 4 : level
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= match[0].length })
      return true
    }
  },
  function (value, context) {
    const reg = /^(\*|-|\+)\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'unorderlist'
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= 2 })
      return true
    }
  },
  function (value, context) {
    const reg = /^\d\.\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'orderlist'
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= 3 })
      return true
    }
  },
  function (value, context) {
    const reg = /^\[(\s|x)?\]\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'todolist'
      context.$set(value, 'checked', !!match[0].match('x'))
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= 3 })
      return true
    }
  },
  function (value) {
    const reg = /^-{3,10}$/
    if (value.text.match(reg)) {
      value.type = 'divider'
      value.text = '---'
      return true
    }
  }
]
