import { blockMap, listTypes } from '../map'
// import BlockContainer from './block-container'

function renderBlocks (h, blocks) {
  let children = []
  let list = []
  blocks.forEach((item, i) => {
    const type = item.type || 'paragraph'
    const component = blockMap[type] || blockMap.paragraph
    const dataindex = listTypes[type] ? list.length + 1 : null
    const child = h(component, {
      props: { value: item },
      attrs: {
        'data-index': dataindex,
        'data-index-num': dataindex ? dataindex + '.' : null,
        'data-id': item.id
      },
      class: ['editor-block', 'editor-block-' + type],
      key: item.id,
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
      const listNode = h(listTypes[type], { class: 'editor-list' }, list)
      children.push(
        h('div', { class: 'editor-block' }, [listNode])
      )
      list = []
    }
  })
  return children
}

export default renderBlocks
