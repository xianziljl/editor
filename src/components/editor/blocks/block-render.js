import { blockMap } from '../map'

const listTypes = {
  orderlist: 'ol',
  unorderlist: 'ul',
  todolist: 'ul'
}

function renderBlocks (h, blocks, readonly) {
  let children = []
  let list = []
  blocks.forEach((item, i) => {
    const type = item.type || 'paragraph'
    const component = blockMap[type] || blockMap.paragraph
    const child = h(component, {
      props: { value: item, readonly },
      class: 'editor-block-' + type,
      key: item.key,
      on: {
        'link-hover': e => { console.log('link-hover', e.target.getAttribute('href')) },
        'link-leave': e => { console.log('link-leave') }
      }
    })
    if (!listTypes[type]) {
      children.push(child)
      return
    }
    // 是 list
    list.push(child)
    const next = blocks[i + 1]
    if (!next || next.type !== item.type) {
      children.push(h(listTypes[type], list))
      list = []
    }
  })
  return children
}

export default renderBlocks
