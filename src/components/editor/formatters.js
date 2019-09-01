export default [
  function (block, context) {
    if (!block.text || block.type === 'blockquote') return false
    const reg = /^>\s/
    const match = block.text.match(reg)
    if (match) {
      block.type = 'blockquote'
      block.text = block.text.replace(reg, '')
      block.ranges.forEach(item => { item.offset -= 2 })
      return true
    }
  },
  function (block, context) {
    if (!block.text) return false
    const reg = /^#+\s/
    const match = block.text.match(reg)
    if (match) {
      block.type = 'heading'
      const level = match[0].length - 1
      block.level = level > 4 ? 4 : level
      block.text = block.text.replace(reg, '')
      block.ranges.forEach(item => { item.offset -= match[0].length })
      return true
    }
  },
  function (block, context) {
    if (!block.text || block.type === 'unorderlist') return false
    const reg = /^(\*|-|\+)\s/
    const match = block.text.match(reg)
    if (match) {
      block.type = 'unorderlist'
      block.text = block.text.replace(reg, '')
      block.ranges.forEach(item => { item.offset -= 2 })
      return true
    }
  },
  function (block, context) {
    if (!block.text || block.type === 'orderlist') return false
    const reg = /^\d\.\s/
    const match = block.text.match(reg)
    if (match) {
      block.type = 'orderlist'
      block.text = block.text.replace(reg, '')
      block.ranges.forEach(item => { item.offset -= 3 })
      return true
    }
  },
  function (block, context) {
    if (!block.text || block.type === 'todolist') return false
    const reg = /^\[(\s|x)?\]\s/
    const match = block.text.match(reg)
    if (match) {
      block.type = 'todolist'
      context.$set(block, 'checked', !!match[0].match('x'))
      block.text = block.text.replace(reg, '')
      block.ranges.forEach(item => { item.offset -= 3 })
      return true
    }
  },
  function (block) {
    if (!block.text) return false
    const reg = /^-{3,10}$/
    if (block.text.match(reg)) {
      block.type = 'divider'
      block.text = ''
      return true
    }
  },
  function (block) {
    if (!block.text || block.type === 'blockcode') return false
    const reg = /^`{3}/
    if (block.text.match(reg)) {
      block.type = 'blockcode'
      block.text = block.text.replace(reg, '')
      block.ranges.forEach(item => { item.offset -= 3 })
      return true
    }
  }
]
