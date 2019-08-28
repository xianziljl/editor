const listTypes = new Set(['orderlist', 'unorderlist', 'todolist'])

export function mergeLists (blocks) {
  function each (arr) {
    let go = false
    arr.forEach((item, i) => {
      const next = arr[i + 1]
      if (listTypes.has(item.type) && next && next.type === item.type) {
        item.blocks = item.blocks.concat(next.blocks || [])
        arr.splice(i + 1, 1)
        go = true
      }
    })
    if (go) each(arr)
  }
  each(blocks)
}
export function splitList (list) {
  //
}
export function filterLists (blocks) {
  if (!blocks || !blocks.length) return
  blocks.forEach((item, i) => {
    if (!listTypes.has(item.type)) return
    if (!item.blocks || !item.blocks.length) {
      blocks.splice(i, 1)
    }
  })
}

export default { mergeLists, splitList }
