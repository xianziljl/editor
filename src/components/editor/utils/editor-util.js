
import { textBlockMap } from '../map'
import createGUID from '../utils/createGUID'

export function isTextBlock (block) {
  return !!textBlockMap[block.type]
}

export function getBlockNodeByChildNode (node) {
  if (!node) return null
  if (node.dataset && node.dataset.id) return node
  return getBlockNodeByChildNode(node.parentNode)
}

export function getNodeById (id) {
  return document.querySelector(`[data-id="${id}"]`)
}

export function getBlockById (blocks, id) {
  if (!blocks || !blocks.length || !id) return null
  return blocks.filter(item => item.id === id)[0] || null
}

export function getSelectedBlocks (blocks, startId, endId) {
  const result = new Set()
  let go = false
  blocks.forEach(item => {
    if (item.id === startId) {
      result.add(item)
      go = true
    }
    if (item.id === endId) {
      result.add(item)
      go = false
    }
    if (go) result.add(item)
  })
  return Array.from(result)
}
// 获取 range 的相对于编辑器的坐标和宽高
export function getRangeRect (range, el) {
  if (!el || !range) return null
  const rangeRect = range.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  return {
    left: rangeRect.left - elRect.left,
    top: rangeRect.top - elRect.top,
    width: rangeRect.width,
    height: rangeRect.height
  }
}
// 获取 node 的 offset 相对于 root 的 offset 值
export function getOffset (root, node, _offset) {
  let offset = _offset
  if (root === node) return _offset
  // 获取符合 node 的父辈，且符合 root 的直系子元素
  function getRootChildNode (_root, _node) {
    if (!_node) return null
    return _node.parentNode === _root ? _node : getRootChildNode(_root, _node.parentNode)
  }
  const rootChildNode = getRootChildNode(root, node)
  if (!rootChildNode) return null
  if (rootChildNode.childNodes && rootChildNode.childNodes.length) {
    offset = getOffset(rootChildNode, node, _offset)
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
// 获取 在 start ~ end 内所应用的样式
export function getRangeStyles (ranges, start, end) {
  const styles = {}
  if (!ranges) return styles
  ranges.forEach(item => {
    const itemEnd = item.offset + item.length
    // 判断是否光标在 range offset 的位置而且没有选中文字
    const isAtStart = end - start <= 0 && start === item.offset

    if (!isAtStart && start >= item.offset && end <= itemEnd) {
      const style = item.style
      styles[style] = 1
    }
  })
  return styles
}
// 合并重合的 range
export function mergeRanges (ranges) {
  if (!ranges) return
  if (ranges.length < 2) return
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
}
// 过滤无效 range
// function filterRanges (ranges, maxOffset) {
//   ranges.forEach((item, i) => {
//     if (
//       item.offset < 0 ||
//       item.length <= 0 ||
//       !item.style ||
//       item.offset >= maxOffset
//     ) {
//       ranges.splice(i, 1)
//     }
//   })
// }
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
  ].filter(item => item.offset >= 0 && item.length > 0)
}
// 根据全局 offset 值查找光标所在的文本节点和相对节点的位置
export function getFocusNodeAndOffset (root, offset) {
  let i = 0
  function getResult (_root, _offset) {
    i += 1
    let len = 0
    let focusNode = _root
    let focusOffset = 0
    if (!_root) return { focusNode, focusOffset }
    const nodes = _root.childNodes
    const length = nodes.length
    for (let i = 0; i < length; i++) {
      const item = nodes[i]
      if (!item.dataset || !item.dataset.skipCheck) { // 跳过一些无需检查的元素 data-skip-check
        // 这里 item 可能是 Element, TextNode
        let itemLength = item.length
        if (!(itemLength >= 0)) itemLength = item.innerText ? item.innerText.length : 0
        len += itemLength
        if (len >= _offset) {
          focusNode = item
          focusOffset = itemLength - (len - _offset)
          break
        } else if (i === length - 1) {
          focusNode = item
          focusOffset = len
        }
      }
    }
    if (focusNode.nodeType === 3) {
      i = 0
      return { focusNode, focusOffset }
    }
    if (i > 1000) {
      i = 0
      return { focusNode, focusOffset }
    }
    return getResult(focusNode, focusOffset)
  }
  return getResult(root, offset)
}
// 在指定 range 位置插入 length 长度的文字后重新计算 ranges
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
    if (rangeStart >= itemEnd) {
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
    if (rangeStart >= itemStart && rangeEnd <= itemEnd) {
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
// 根据 range 将 block 一分为二 返回分割后的产生的新 block
export function splitBlock (block, range) {
  if (!isTextBlock(block)) return null
  const rangeStart = range.offset
  const rangeEnd = range.offset + range.length
  const text1 = block.text.slice(0, rangeStart)
  const text2 = block.text.slice(rangeEnd, block.text.length)
  const ranges1 = []
  const ranges2 = []
  block.ranges.forEach(item => {
    const itemStart = item.offset
    const itemEnd = item.offset + item.length
    if (itemEnd <= rangeStart) {
      ranges1.push(item)
      return
    }
    if (itemStart >= rangeEnd) {
      item.offset -= rangeEnd
      ranges2.push(item)
      return
    }
    if (itemStart > rangeStart && itemEnd < rangeEnd) {
      return
    }
    if (rangeStart > itemStart && rangeEnd < itemEnd) {
      item.length = rangeStart - itemStart
      ranges1.push(item)
      const newRange = {
        offset: 0,
        length: itemEnd - rangeEnd,
        style: item.style
      }
      for (let key in item) if (newRange[key] === undefined) newRange[key] = item[key]
      ranges2.push(newRange)
      return
    }
    if (itemStart > rangeStart && itemStart < rangeEnd) {
      item.offset = 0
      item.length = itemEnd - rangeEnd
      ranges2.push(item)
      return
    }
    if (itemEnd > rangeStart && itemEnd < rangeEnd) {
      item.length = rangeStart - itemStart
      ranges1.push(item)
    }
  })
  block.text = text1
  block.ranges = ranges1
  const result = {
    id: createGUID(),
    key: 0,
    text: text2,
    ranges: ranges2
  }
  return result
}
// 合并两个 block
export function mergeBlocks (block1, block2) {
  if (!isTextBlock(block1) || !isTextBlock(block2)) return
  block2.ranges.forEach(item => {
    item.offset += block1.text.length
  })
  block1.ranges = block1.ranges.concat(block2.ranges)
  block1.text += block2.text
}
