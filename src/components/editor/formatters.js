export default [
  function (value) {
    const reg = /^>\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'blockquote'
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= 2 })
    }
  },
  function (value) {
    const reg = /^#+\s/
    const match = value.text.match(reg)
    if (match) {
      value.type = 'heading'
      const level = match[0].length - 1
      value.level = level > 4 ? 4 : level
      value.text = value.text.replace(reg, '')
      value.ranges.forEach(item => { item.offset -= match[0].length })
    }
  },
  // function (value) {
  //   const reg = /^\d+\.\s/
  //   const match = value.text.match(reg)
  //   if (match) {
  //     value.type = 'heading'
  //     const level = match[0].length - 1
  //     value.level = level > 4 ? 4 : level
  //     value.text = value.text.replace(reg, '')
  //     value.ranges.forEach(item => { item.offset -= match[0].length })
  //   }
  // },
  function (value) {
    const reg = /^-{3,10}$/
    if (value.text.match(reg)) {
      value.type = 'divider'
      value.text = '---'
    }
  }
]
