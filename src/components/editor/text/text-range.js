
// 根据后代元素的 offset 取相对于 root 的 offset 值
export function getOffset (root, el, _offset) {
  let offset = _offset
  if (root === el) return _offset
  // 获取符合 node 的父辈，且符合 root 的直系子元素
  function getRootChildNode (_root, node) {
    if (!node) return null
    return node.parentNode === _root ? node : getRootChildNode(_root, node.parentNode)
  }
  const rootChildNode = getRootChildNode(root, el)
  if (!rootChildNode) return null
  if (rootChildNode.tagName === 'A') {
    offset = getOffset(rootChildNode, el, _offset)
  }
  const nodes = root.childNodes
  const len = nodes.length
  for (let i = 0; i < len; i++) {
    const item = nodes[i]
    if (item === rootChildNode) break
    else if (item.nodeType === 3) offset += item.length
    else offset += item.innerText.length
  }
  return offset
}
// 获取选区在指定元素中的开始位置和选区
export function getRange (root) {
  const selection = getSelection()
  // console.log(selection)
  if (!selection.anchorNode) return null
  const range = selection.getRangeAt(0)
  const { startContainer, startOffset, endContainer, endOffset } = range
  const offset = getOffset(root, startContainer, startOffset)
  if (offset === null) return null
  let length
  if (startContainer === endContainer && startOffset === endOffset) length = 0
  else length = getOffset(root, endContainer, endOffset) - offset
  return { offset, length }
}

// 获取当前选中文字的矩形在 el 内部的位置
export function getRangeRect (el) {
  if (!el) return null
  const selection = getSelection()
  if (!selection.anchorNode) return null
  const range = selection.getRangeAt(0)
  const rangeRect = range.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    left: rangeRect.left - elRect.left,
    top: rangeRect.top - elRect.top,
    width: rangeRect.width,
    height: rangeRect.height
  }
}

// 根据全局 offset 值查找光标所在的文本节点和相对节点的位置
let i = 0
export function getFocusNodeAndOffset (root, offset) {
  i += 1
  let len = 0
  let focusNode = root
  let focusOffset = 0
  const nodes = root.childNodes
  const length = nodes.length
  for (let i = 0; i < length; i++) {
    const item = nodes[i]
    if (!item.dataset || !item.dataset.skipCheck) { // 跳过一些无需检查的元素 data-skip-check
      // 这里 item 可能是 Element, TextNode
      let itemLength = item.length
      if (!(itemLength >= 0)) itemLength = item.innerText ? item.innerText.length : 0
      len += itemLength
      if (len >= offset) {
        focusNode = item
        focusOffset = itemLength - (len - offset)
        break
      } else if (i === length - 1) {
        focusNode = item
        focusOffset = len
      }
    }
  }
  if (focusNode.nodeType === 3) {
    return { focusNode, focusOffset }
  }
  if (i > 1000) {
    i = 0
    return { focusNode, focusOffset }
  }
  return getFocusNodeAndOffset(focusNode, focusOffset)
}

// 获取选中的文字所应用的样式
export function getRangeStyles (range, ranges) {
  const styles = {}
  if (!range || !ranges) return styles
  ranges.forEach(item => {
    const rangeEnd = range.offset + range.length
    const itemEnd = item.offset + item.length
    // 判断是否光标在 range offset 的位置而且没有选中文字
    const isAtStart = !range.length && range.offset === item.offset

    if (!isAtStart && range.offset >= item.offset && rangeEnd <= itemEnd) {
      const style = item.style
      styles[style] = style === 'link' ? item.href : 1
    }
  })
  return styles
}
// 分割 range
export function splitRange (baseRange, cutRange) {
  const { style } = baseRange
  let points = [
    baseRange.offset,
    baseRange.offset + baseRange.length,
    cutRange.offset,
    cutRange.offset + cutRange.length
  ].sort((a, b) => a - b)
  return [
    { offset: points[0], length: points[1] - points[0], style },
    { offset: points[2], length: points[3] - points[2], style }
  ]
}
// 整理 ranges 以将连续或重合的范围合并
export function mergeRanges (ranges) {
  if (ranges.length < 2) return ranges
  function each (arr) {
    let go = false // 是否继续下次循环
    arr.forEach((item1, i) => {
      arr.forEach((item2, j) => {
        if (item1 === item2) return
        if (item1.style !== item2.style) return
        if (item1.style === 'link' && item1.href !== item2.href) return
        let s1 = item1.offset
        let e1 = item1.offset + item1.length
        let s2 = item2.offset
        let e2 = item2.offset + item2.length
        if (s2 >= s1 && s2 <= e1) {
          go = true
          arr.splice(j, 1)
          item1.offset = Math.min(s1, s2)
          item1.length = Math.max(e1, e2) - item1.offset
        }
      })
    })
    if (go) each(ranges)
  }
  each(ranges)
  return ranges
}
// function mergeRange (range1, range2) {}
// 过滤无效 range
export function filterRanges (ranges, text) {
  ranges.forEach((item, i) => {
    if (
      item.offset < 0 ||
      item.length <= 0 ||
      !item.style ||
      item.offset >= text.length ||
      (item.style === 'link' && !item.href)
    ) {
      ranges.splice(i, 1)
    }
  })
  // return ranges.filter(item => {
  //   // console.log(item.)
  //   return !(
  //     item.offset < 0 ||
  //     item.length <= 0 ||
  //     !item.style ||
  //     item.offset >= text.length ||
  //     (item.style === 'link' && !item.href)
  //   )
  // })
}

// 在指 range 位置插入 length 长度的文字后重新计算 ranges
export function replaceRange (ranges, range, inputLength) {
  // console.log(JSON.parse(JSON.stringify(range)), inputLength)
  const rangeStart = range.offset
  const rangeEnd = range.offset + range.length
  const changeLength = inputLength - range.length
  // console.log('change lenght', changeLength, inputLength)
  ranges.forEach((item, i) => {
    let itemStart = item.offset
    let itemEnd = item.offset + item.length
    // 在选区之前，不受影响
    if (rangeStart > itemEnd) {
      // console.log(1)
      return
    }
    // 在选区之后，需要调整 offset 值
    if (rangeEnd <= itemStart) {
      // console.log(2)
      item.offset += changeLength
      return
    }
    // 被选取包裹，需要被置为无效
    if (rangeStart <= itemStart && rangeEnd >= itemEnd) {
      // console.log(3)
      item.offset = item.length = 0
      return
    }
    // 选区在其内部，需要调整 length 长度
    if (rangeStart > itemStart && rangeEnd <= itemEnd) {
      // console.log(4)
      item.length += changeLength
      return
    }
    // 开始位置与选区交叉
    if (rangeStart < itemStart && rangeEnd > itemStart) {
      // console.log(5)
      item.offset = rangeStart + inputLength
      item.length -= rangeEnd - itemStart
      return
    }
    // 结束位置与选区交叉
    if (rangeStart < itemEnd && rangeEnd > itemEnd) {
      // console.log(6)
      item.length -= itemEnd - rangeStart
    }
  })
}

export default { mergeRanges, filterRanges, replaceRange, getRangeStyles, splitRange, getRange, getRangeRect, getFocusNodeAndOffset }
