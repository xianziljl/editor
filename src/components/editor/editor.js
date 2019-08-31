import ToolPopup from './tool/popup-tool'
import renderBlocks from './blocks/block-render'
import formatValue from './utils/formatValue'
// import debounce from 'debounce'

export default {
  name: 'editor',
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isComposing: false,
      isOperating: false,

      selection: {
        startOffset: null, // 开始点相对 block 区域的 offset
        endOffset: null, // 结束点相对 block 区域的 offset
        startBlock: null,
        endBlock: null,
        rangeRect: null, // 选中文字的坐标区域
        blocks: null, // 被选中的 block value
        blockStyle: null, // 被选中的 block 部分所应用的样式
        inlineStyles: null // 被选中的部分所应用的 inline 样式
      }
    }
  },
  provide () {
    return {
      $editor: this
    }
  },
  created () {
    formatValue(this.value)
  },
  render (h) {
    const { value, readonly } = this
    let article, toolPopup

    article = h('article', {
      attrs: { contenteditable: !readonly },
      on: readonly ? null : {
        input: this.onInput,
        keydown: this.onKeydown,
        mousedown: this.onMousedown,
        compositionstart: this.onCompositionstart,
        compositionend: this.onCompositionend
      },
      ref: 'article'
    }, renderBlocks(h, value.blocks))

    if (!readonly) toolPopup = h(ToolPopup, { ref: 'popupTool' })

    return h('div', {
      class: 'editor'
    }, [article, toolPopup])
  },
  mounted () {
    this.addListeners()
    this.$once('hook:beforeDestroy', this.removeListeners)
  },
  methods: {
    addListeners () {
      document.addEventListener('selectionchange', this.onSelectionchange)
    },
    removeListeners () {
      document.removeEventListener('selectionchange', this.onSelectionchange)
    },
    onCompositionstart (e) {
      this.isComposing = true
    },
    onCompositionend (e) {
      this.isComposing = false
      this.onInput(e)
    },
    onInput (e) {
      if (this.isComposing) return
      console.log('input')
    },
    onKeydown (e) {
      //
    },
    onMousedown (e) {
      this.selection.rangeRect = null
    },
    onSelectionchange (e) {
      this.getSelection()
      this.getSelectedBlockStyle()
      this.getSelectedInlineStyles()
      this.$emit('selectionchange', JSON.parse(JSON.stringify(this.selection)))
    },
    getSelection () {
      if (this.isOperating) return
      console.log('get selection')
      const clearSelection = () => {
        for (let key in this.selection) this.selection[key] = null
      }
      const selection = getSelection()
      if (selection.type === 'None') {
        clearSelection()
        return
      }
      const range = selection.getRangeAt(0)
      let rangeRect
      if (range.startContainer === range.endContainer &&
      range.startOffset === range.endOffset) {
        rangeRect = null
      } else {
        rangeRect = getRangeRect(range, this.$el)
      }

      const startNode = getBlockNodeByChildNode(range.startContainer)
      const endNode = getBlockNodeByChildNode(range.endContainer)
      if (!startNode || !endNode) {
        clearSelection()
        return
      }

      const startKey = startNode.dataset.key
      const endKey = endNode.dataset.key

      let selectedBlocks = getSelectedBlocks(this.value.blocks, startKey, endKey)
      let startBlock = selectedBlocks[0]
      let endBlock = selectedBlocks[selectedBlocks.length - 1]

      let startOffset = getOffset(startNode, range.startContainer, range.startOffset)
      let endOffset = getOffset(endNode, range.endContainer, range.endOffset)

      // 鼠标点击三下会选中某个段落，和下一个段落的第 0 offset 这里将最后一个段落去掉
      if (selectedBlocks.length > 1 && endOffset === 0) {
        endBlock = selectedBlocks[selectedBlocks.length - 2]
        endOffset = (endBlock.text || '').length
        selectedBlocks.pop()
      }

      this.selection = {
        startBlock,
        endBlock,
        startOffset,
        endOffset,
        rangeRect,
        blocks: selectedBlocks
      }
    },
    getSelectedBlockStyle () {
      const { blocks } = this.selection
      if (!blocks || !blocks.length) {
        this.selection.blockStyle = null
        return
      }
      let styles = blocks.map(item => item.type)
      styles = Array.from(new Set(styles))
      this.selection.blockStyle = styles.length === 1 ? styles[0] : null
    },
    getSelectedInlineStyles () {
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection
      if (!blocks || !blocks.length) {
        this.selection.inlineStyles = null
        return
      }
      if (blocks.length === 1) {
        this.selection.inlineStyles = getRangeStyles(startBlock.ranges, startOffset, endOffset)
        return
      }
      const stylesMap = {} // { bold: [1, 1, 1] } 判断每一项长度是否和选中的 blocks 长度相同
      const result = {}
      blocks.forEach(item => {
        let styles = {}
        if (item === startBlock) styles = getRangeStyles(item.ranges, startOffset, item.text.length)
        else if (item === endBlock) styles = getRangeStyles(item.ranges, 0, endOffset)
        else styles = getRangeStyles(item.ranges, 0, item.text.length)
        for (let key in styles) {
          if (stylesMap[key]) stylesMap[key].push(styles[key])
          else stylesMap[key] = [styles[key]]
        }
      })
      for (let key in stylesMap) {
        const item = stylesMap[key]
        // console.log(item)
        if (item.length === blocks.length) result[key] = 1
      }
      this.selection.inlineStyles = result
    },
    addInlineStyle (style, attrs) {
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection

      if (startBlock === endBlock) {
        const newRange = { style, offset: startOffset, length: endOffset - startOffset }
        if (attrs) {
          for (let key in attrs) this.$set(newRange, key, attrs[key])
        }
        startBlock.ranges.push(newRange)
        mergeRanges(startBlock.ranges)
        filterRanges(startBlock.ranges, startBlock.text.length)
        return
      }

      blocks.forEach(item => {
        const newRange = { style, offset: 0, length: 0 }
        if (attrs) {
          for (let key in attrs) this.$set(newRange, key, attrs[key])
        }
        if (item === startBlock) {
          newRange.offset = startOffset
          newRange.length = item.text.length - startOffset
          item.ranges.push(newRange)
        } else if (item === endBlock) {
          newRange.length = endOffset
          item.ranges.push(newRange)
        } else {
          newRange.length = item.text.length
          item.ranges.push(newRange)
        }
        mergeRanges(item.ranges)
        filterRanges(item.ranges, item.text.length)
      })
    },
    removeInlineStyle (style) {
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection

      function handleItem (item, start, end) {
        const ranges = item.ranges
        let focusRange = ranges.filter(item => {
          return item.style === style && item.offset <= start && item.offset + item.length >= end
        })[0]
        if (!focusRange) return
        const i = ranges.indexOf(focusRange)
        ranges.splice(i, 1)
        if (focusRange.style !== 'link') {
          const cutRange = { offset: start, length: end - start }
          const newRanges = splitRange(focusRange, cutRange)
          item.ranges = ranges.concat(newRanges)
        }
        mergeRanges(item.ranges)
        filterRanges(item.ranges, item.text.length)
      }

      if (startBlock === endBlock) {
        handleItem(startBlock, startOffset, endOffset)
        return
      }
      blocks.forEach(item => {
        if (item === startBlock) {
          handleItem(item, startOffset, item.text.length)
        } else if (item === endBlock) {
          handleItem(item, 0, endOffset)
        } else {
          handleItem(item, 0, item.text.length)
        }
      })
    },
    toggleInlineStyle (style, attrs) {
      const { inlineStyles } = this.selection
      if (!inlineStyles[style]) {
        this.addInlineStyle(style, attrs)
      } else {
        this.removeInlineStyle(style)
      }
      this.restoreSelection()
    },
    setBlockStyle (style, attrs) {
      const { blocks } = this.selection
      blocks.forEach(item => {
        item.type = style
        if (attrs) {
          for (let key in attrs) this.$set(item, key, attrs[key])
        }
      })
    },
    removeBlockStyle (style) {
      console.log('removeBlockStyle')
    },
    toggleBlockStyle (style, attrs) {
      const { blockStyle } = this.selection
      if (style === blockStyle) {
        this.removeBlockStyle()
      } else {
        this.setBlockStyle(style, attrs)
      }
    },
    restoreSelection () {
      this.$nextTick(() => {
        const { startBlock, endBlock, startOffset, endOffset } = this.selection
        this.setSelection(startBlock, endBlock, startOffset, endOffset)
      })
    },
    setSelection (startBlock, endBlock, startOffset, endOffset) {
      const startNode = getNodeByKey(startBlock.key)
      const endNode = getNodeByKey(endBlock.key)
      const start = getFocusNodeAndOffset(startNode, startOffset)
      const end = (startBlock === endBlock && startOffset === endOffset)
        ? start
        : getFocusNodeAndOffset(endNode, endOffset)
      // console.log(start, end)
      const selection = getSelection()
      const range = document.createRange()
      try {
        range.setStart(start.focusNode, start.focusOffset)
        range.setEnd(end.focusNode, end.focusOffset)
        selection.removeAllRanges()
        selection.addRange(range)
      } catch (err) {
        console.warn('setRange failed: ' + err.message)
      }
    }
  }
}

function getBlockNodeByChildNode (node) {
  if (!node) return null
  if (node.dataset && node.dataset.key) return node
  return getBlockNodeByChildNode(node.parentNode)
}

function getNodeByKey (key) {
  return document.querySelector(`[data-key="${key}"]`)
}

function getSelectedBlocks (blocks, startKey, endKey) {
  const result = new Set()
  let go = false
  blocks.forEach(item => {
    if (item.key === startKey) {
      result.add(item)
      go = true
    }
    if (item.key === endKey) {
      result.add(item)
      go = false
    }
    if (go) result.add(item)
  })
  return Array.from(result)
}
// 获取 range 的相对于编辑器的坐标和宽高
function getRangeRect (range, el) {
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
// 获取 node 的 offse 相对于 root 的 offset 值
function getOffset (root, node, _offset) {
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
function getRangeStyles (ranges, start, end) {
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
function mergeRanges (ranges) {
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
// 过滤无效 range
function filterRanges (ranges, maxOffset) {
  ranges.forEach((item, i) => {
    if (
      item.offset < 0 ||
      item.length <= 0 ||
      !item.style ||
      item.offset >= maxOffset
    ) {
      ranges.splice(i, 1)
    }
  })
}
// 分割 range
function splitRange (baseRange, cutRange) {
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
// 根据全局 offset 值查找光标所在的文本节点和相对节点的位置
function getFocusNodeAndOffset (root, offset) {
  let i = 0
  function getResult (_root, _offset) {
    i += 1
    let len = 0
    let focusNode = _root
    let focusOffset = 0
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
