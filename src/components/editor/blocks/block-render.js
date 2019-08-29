import { blockMap, listTypes } from '../map'
// import BlockContainer from './block-container'

function renderBlocks (h, blocks, readonly) {
  let children = []
  let list = []
  blocks.forEach((item, i) => {
    const type = item.type || 'paragraph'
    const component = blockMap[type] || blockMap.paragraph
    const child = h(component, {
      props: { value: item, readonly },
      attrs: { 'data-index': listTypes[type] ? `${list.length + 1}.` : null },
      class: 'editor-block-' + type,
      key: item.key,
      on: {}
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
