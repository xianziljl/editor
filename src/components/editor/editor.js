import ToolPopup from './tool/popup-tool'
import ToolAdd from './tool/add-tool'
import renderBlocks from './blocks/block-render'
import formatValue from './utils/formatValue'
import createGUID from './utils/createGUID'
import debounce from 'debounce'
import { listTypes } from './map'
import formatters from './formatters'
import {
  isTextBlock,
  getBlockNodeByChildNode,
  getNodeById,
  getBlockById,
  getSelectedBlocks,
  getRangeRect,
  getOffset,
  getRangeStyles,
  mergeRanges,
  splitRange,
  getFocusNodeAndOffset,
  replaceRange,
  splitBlock,
  mergeBlocks
} from './utils/editor-util'

export default {
  name: 'editor',
  props: {
    readonly: Boolean,
    // image
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    formatValue(this, this.value)
    return {
      isComposing: false,
      isOperating: false,
      isSelecting: false,
      isHistoryBacking: false,
      isFocus: false,
      key: 0, // 用于一些极端情况下更新整个 article 如跨行输入

      selection: {
        startOffset: null, // 开始点相对 block 区域的 offset
        endOffset: null, // 结束点相对 block 区域的 offset
        startBlock: null,
        endBlock: null,
        rangeRect: null, // 选中文字相对编辑器的坐标区域
        blocks: null, // 被选中的 block value
        blockStyle: null, // 被选中的 block 部分所应用的样式
        inlineStyles: null // 被选中的部分所应用的 inline 样式
      },
      history: {
        index: 0,
        list: [] // [{ selection, value }, ...]
      }
    }
  },
  provide () {
    return {
      $editor: this
    }
  },
  render (h) {
    const { value, readonly } = this
    let article, toolPopup, addTool

    article = h('article', {
      attrs: { contenteditable: !readonly },
      on: readonly ? null : {
        input: this.onInput,
        paste: this.onPaste,
        keydown: this.onKeydown,
        mousedown: this.onMousedown,
        compositionstart: this.onCompositionstart,
        compositionend: this.onCompositionend,
        drop: this.onDrop,
        '!focus': this.onFocus
      },
      ref: 'article',
      key: this.key
    }, renderBlocks(h, value.blocks, readonly))

    if (!readonly) {
      toolPopup = h(ToolPopup, { ref: 'popupTool' })
      addTool = h(ToolAdd, { ref: 'addTool' })
    }

    return h('div', {
      class: 'editor'
    }, [article, toolPopup, addTool])
  },
  errorCaptured (err, vm, info) {
    console.log(err, vm, info)
  },
  mounted () {
    this.addListeners()
    this.$once('hook:beforeDestroy', this.removeListeners)
  },
  watch: {
    value: {
      handler: debounce(function (val) {
        if (this.isHistoryBacking) {
          this.isHistoryBacking = false
          return
        }
        this.historyForward()
      }, 300),
      deep: true
    },
    selection (val) {
      if (!this.history.list.length) {
        this.historyForward()
        console.log('history add')
      }
    }
  },
  methods: {
    addListeners () {
      document.addEventListener('selectionchange', this.onSelectionchange)
      document.addEventListener('mousedown', this.onPageMousedown)
      document.addEventListener('mouseup', this.onPageMouseup)
    },
    removeListeners () {
      document.removeEventListener('selectionchange', this.onSelectionchange)
      document.removeEventListener('mousedown', this.onPageMousedown)
    },
    onPageMousedown (e) {
      const path = e.path || (e.composedPath && e.composedPath())
      if (!path.includes(this.$el)) {
        for (let key in this.selection) this.selection[key] = null
        this.isFocus = false
      } else {
        this.isFocus = true
      }
    },
    onPageMouseup (e) {
      this.isSelecting = false
    },
    onCompositionstart (e) {
      this.isComposing = true
    },
    onCompositionend (e) {
      this.isComposing = false
      this.onInput(e)
    },
    onInput (e) {
      if (this.isComposing || e.srcElement !== this.$refs.article) return
      if (this.isHistoryBacking) return
      // console.log('input') // input 比 selectionchange 先触发
      const { startBlock, endBlock, startOffset, endOffset } = this.selection
      if (startBlock === endBlock) {
        const oldLength = startBlock.text.length
        const node = getNodeById(startBlock.id)
        const newLength = node.innerText.length
        const range = { offset: startOffset, length: endOffset - startOffset }
        let inputLength = e.data ? e.data.length : newLength + range.length - oldLength
        if (inputLength < 0) {
          range.offset += inputLength
          range.length -= inputLength
          inputLength = 0
        }
        replaceRange(startBlock.ranges, range, inputLength)
        startBlock.text = node.innerText.replace(/\n/g, '')
        // 执行快速格式化
        let formated = false
        formatters.forEach(format => {
          const res = format(startBlock, this)
          if (res) formated = true
        })
        startBlock.key++
        if (isTextBlock(startBlock)) {
          const newOffset = formated ? 0 : range.offset + inputLength
          this.setSelection(startBlock, startBlock, newOffset, newOffset)
        } else {
          this.$nextTick(() => {
            const node = getNodeById(startBlock.id)
            node && node.focus()
          })
        }
        return
      }
      this.onInputCrossBlocks()
      startBlock.text += e.data || ''
      mergeBlocks(startBlock, endBlock)
      mergeRanges(startBlock.ranges)
      this.removeBlock(endBlock)
      this.key++
      const newOffset = startOffset + (e.data ? e.data.length : 0)
      this.setSelection(startBlock, startBlock, newOffset, newOffset)
    },
    onInputCrossBlocks () { // 跨行发生输入行为后对两端 block 处理，并删除中间 block
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection
      blocks.forEach(item => {
        if (!isTextBlock(item) || (item !== startBlock && item !== endBlock)) this.removeBlock(item)
      })
      if (isTextBlock(startBlock)) {
        const range1 = { offset: startOffset, length: startBlock.text.length - startOffset }
        replaceRange(startBlock.ranges, range1, 0)
        startBlock.text = startBlock.text.substring(0, startOffset)
      }
      if (isTextBlock(endBlock)) {
        const range2 = { offset: 0, length: endOffset }
        replaceRange(endBlock.ranges, range2, 0)
        endBlock.text = endBlock.text.substring(endOffset)
      }
    },
    onPaste (e) {
      e.preventDefault()
      const { clipboardData } = e
      const text = clipboardData.getData('text/plain')
      if (!text) return
      const arr = text.split(/\n/).filter(item => item)
      console.log(arr)
      const { startBlock, endBlock, startOffset, endOffset } = this.selection
      // const startText = arr[0]
      // const endText = arr[1]
      if (arr.length === 1 && startBlock === endBlock) {
        if (!isTextBlock(startBlock)) return
        const data = arr[0]
        const range = { offset: startOffset, length: endOffset - startOffset }
        replaceRange(startBlock.ranges, range, data.length)
        const t = startBlock.text
        startBlock.text = t.substring(0, startOffset) + data + t.substring(endOffset)
        startBlock.key++
        const newOffset = startOffset + data.length
        this.setSelection(startBlock, startBlock, newOffset, newOffset)
        return
      }
      if (arr.length === 1) {

      }
    },
    onDrop (e) {
      e.preventDefault()
    },
    onKeydown (e) {
      if (!this.isFocus) {
        e.preventDefault()
        return
      }
      // console.log('onkeydown')
      const code = e.keyCode
      // this.selection.rangeRect = null
      const ctrl = (e.ctrlKey || e.metaKey)
      console.log(ctrl, code)
      switch (code) {
        case 8: // 退格
          this.onKeyBackspace(e)
          break
        case 9:
          this.onKeyTab(e)
          break
        case 27:
          this.onKeyEsc(e)
          break
        case 13: // 回车
          this.onKeyEnter(e)
          break
      }
      // 禁用快捷键
      if (ctrl) {
        // console.log(e.keyCode)
        switch (e.keyCode) {
          case 66: // ctrl+B
            e.preventDefault()
            this.toggleInlineStyle('bold')
            break
          case 73: // ctrl+I
            e.preventDefault()
            this.toggleInlineStyle('italic')
            break
          case 85: // ctrl+U
            e.preventDefault()
            this.toggleInlineStyle('underline')
            break
          case 83: // ctrl+S
            // e.preventDefault()
            // console.log(e)
            // this.exe('underline')
            break
          case 90: // ctrl+Z
            this.historyBack()
            break
        }
      }
    },
    onKeyBackspace (e) {
      const { startBlock, endBlock, startOffset, endOffset } = this.selection
      if (!startBlock || !endBlock) return
      const vblocks = this.value.blocks
      if (startBlock === endBlock) {
        const type = startBlock.type
        const node = getNodeById(startBlock.id)
        const prevBlock = vblocks[vblocks.indexOf(startBlock) - 1]
        const prevBlockNode = prevBlock ? getNodeById(prevBlock.id) : null

        // 当 startBlock 为第一个时
        if (!prevBlock) {
          if (!isTextBlock(startBlock)) return
          if (startOffset === 0 && endOffset === 0) {
            e.preventDefault()
            if (type === 'paragraph') return
            this.clearBlockType()
            this.setSelection(startBlock, startBlock, 0, 0)
            return
          }
        }
        // 正常退格
        if (!(!startOffset && !endOffset)) return
        e.preventDefault()
        // 非文本元素上
        if (!isTextBlock(startBlock)) {
          this.removeBlock(startBlock)
          isTextBlock(prevBlock)
            ? this.setSelection(prevBlock, prevBlock, prevBlock.text.length, prevBlock.text.length)
            : prevBlockNode.focus()
          return
        }
        if (type === 'paragraph' || (type === 'blockcode' && node.dataset.index !== '1')) {
          if (!isTextBlock(prevBlock)) {
            if (!startBlock.text.length) this.removeBlock(startBlock)
            prevBlockNode.focus()
            return
          }
          const prevTextLen = prevBlock.text.length
          mergeBlocks(prevBlock, startBlock)
          mergeRanges(prevBlock.ranges)
          this.removeBlock(startBlock)
          this.setSelection(prevBlock, prevBlock, prevTextLen, prevTextLen)
          return
        }
        this.clearBlockType()
        this.setSelection(startBlock, startBlock, 0, 0)
        return
      }
      e.preventDefault()
      this.onInputCrossBlocks()
      mergeBlocks(startBlock, endBlock)
      mergeRanges(startBlock.ranges)
      this.removeBlock(endBlock)
      this.setSelection(startBlock, startBlock, startOffset, startOffset)
    },
    onKeyEnter (e) {
      e.preventDefault()
      const { startBlock, endBlock, startOffset, endOffset } = this.selection
      if (startBlock === endBlock) {
        if (!isTextBlock(startBlock)) {
          const newBlock = { type: 'paragraph', id: createGUID(), key: 0, text: '', ranges: [] }
          this.addBlockAt(this.value.blocks.indexOf(startBlock) + 1, newBlock)
          this.setSelection(newBlock, newBlock, 0, 0)
          return
        }
        const range = { offset: startOffset, length: endOffset - startOffset }
        const newBlock = splitBlock(startBlock, range)
        const type = startBlock.type
        const index = this.value.blocks.indexOf(startBlock)

        if (!listTypes[type]) {
          this.addBlockAt(index + 1, newBlock)
          this.setSelection(newBlock, newBlock, 0, 0)
          return
        }
        // 这里对列表类型的 block 特殊处理，回车有可能要保留原来的 type
        if (startBlock.text.length || newBlock.text.length) {
          newBlock.type = type
          newBlock.checked = false
          this.addBlockAt(index + 1, newBlock)
          this.setSelection(newBlock, newBlock, 0, 0)
        } else {
          // 对代码块特殊处理两个空行才跳出
          if (type !== 'blockcode') {
            this.clearBlockType(startBlock)
            this.setSelection(startBlock, startBlock, 0, 0)
          } else {
            const prev = this.value.blocks[this.value.blocks.indexOf(startBlock) - 1]
            if (!prev) return
            if (!prev.text.length) {
              this.clearBlockType(startBlock)
              this.setSelection(startBlock, startBlock, 0, 0)
            } else {
              newBlock.type = type
              this.addBlockAt(index + 1, newBlock)
              this.setSelection(newBlock, newBlock, 0, 0)
            }
          }
        }
        return
      }
      this.onInputCrossBlocks()
      this.setSelection(endBlock, endBlock, 0, 0)
    },
    onKeyTab (e) {
      const { addTool } = this.$refs
      if (addTool.isShow) {
        e.preventDefault()
        addTool.isOpen = true
        addTool.$el.querySelector('button').focus()
      }
    },
    onKeyEsc (e) {
      const { addTool } = this.$refs
      if (addTool.isShow) {
        e.preventDefault()
        addTool.isOpen = false
      }
    },
    onMousedown (e) {
      this.isSelecting = true
      this.isOperating = false
      // const { startBlock, endBlock, startOffset, endOffset } = this.selection
      // if (startBlock === endBlock && startOffset === endOffset) this.isSelecting = true
      // console.log(this.isSelecting)
    },
    onFocus (e) {
      this.isFocus = true
      // console.log(e)
      // console.log('focus')
      let focusNode = e.target
      if (focusNode.tagName === 'INPUT' || focusNode.tagName === 'TEXTAREA') return
      if (focusNode === this.$refs.article) {
        this.onSelectionchange()
        return
      }
      const selection = getSelection()
      if (selection) selection.removeAllRanges()
      if (!focusNode.dataset.id) {
        focusNode = getBlockNodeByChildNode(focusNode)
      }
      if (!focusNode) return
      // this.isChildFocus = true
      const block = getBlockById(this.value.blocks, focusNode.dataset.id)

      // 前面的 selection.removeAllRanges 会触发 selectionchange 这里延时等触发完成后再设置 this.selection
      setTimeout(() => {
        this.selection = {
          blocks: [block],
          startBlock: block,
          endBlock: block,
          startOffset: null,
          endOffset: null,
          rangeRect: getRangeRect(focusNode, this.$el),
          blockStyle: block.type,
          inlineStyles: null
        }
      }, 60)
    },
    onSelectionchange (e = {}) {
      // console.log('selectionchange', e.isTrusted)
      if (this.isComposing) return
      this.getSelection()
      this.getSelectedBlockStyle()
      const { startBlock, endBlock, startOffset, endOffset } = this.selection
      if (!(startBlock === endBlock && startOffset === endOffset)) {
        this.getSelectedInlineStyles()
      }
      // this.$emit('selectionchange', JSON.parse(JSON.stringify(this.selection))) // 不用要取消，耗费性能
    },
    getSelection () {
      if (this.isOperating) return
      // console.log('get selection')
      const selection = getSelection()
      // console.log(selection)
      if (selection.anchorNode === this.$refs.article) {
        selection.removeAllRanges()
        return
      }
      if (selection.type === 'None') {
        this.clearSelection()
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
      let endNode = getBlockNodeByChildNode(range.endContainer)
      // console.log(startNode, endNode)
      if (!startNode) {
        this.clearSelection()
        return
      }
      if (!endNode) {
        if (this.selection.endBlock) endNode = getNodeById(this.selection.endBlock.id)
        else return this.clearSelection()
      }

      const startId = startNode.dataset.id
      const endId = endNode.dataset.id

      let selectedBlocks = getSelectedBlocks(this.value.blocks, startId, endId)
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
      const _blocks = (blocks || []).filter(item => isTextBlock(item))
      if (!_blocks || !_blocks.length) {
        this.selection.blockStyle = null
        return
      }
      let styles = _blocks.map(item => {
        if (item.type === 'heading') return item.type + item.level
        return item.type
      })
      styles = Array.from(new Set(styles))
      this.selection.blockStyle = styles.length === 1 ? styles[0] : null
    },
    getSelectedInlineStyles () {
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection
      // 略过其它非文本 block
      const _blocks = (blocks || []).filter(item => isTextBlock(item))
      if (!_blocks || !_blocks.length) {
        this.selection.inlineStyles = null
        return
      }
      // console.log(_blocks.length)
      if (_blocks.length === 1) {
        this.selection.inlineStyles = getRangeStyles(_blocks[0].ranges, startOffset, endOffset)
        return
      }
      const stylesMap = {} // { bold: [1, 1, 1] } 判断每一项长度是否和选中的 blocks 长度相同
      const result = {}
      _blocks.forEach(item => {
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
        if (item.length === _blocks.length) result[key] = 1
      }
      this.selection.inlineStyles = result
    },
    addInlineStyle (style, attrs = {}) {
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection
      if (!blocks || !blocks.length) return

      if (startBlock === endBlock) {
        if (startOffset === endOffset) return
        if (startBlock.type === 'blockcode' && style === 'code') return // 代码块不能再应用行内代码样式
        const newRange = { style, offset: startOffset, length: endOffset - startOffset }
        for (let key in attrs) this.$set(newRange, key, attrs[key])
        startBlock.ranges.push(newRange)
        mergeRanges(startBlock.ranges)
        startBlock.key++
        return
      }

      blocks.forEach(item => {
        if (!isTextBlock(item)) return
        if (item.type === 'blockcode' && style === 'code') return // 代码块不能再应用行内代码样式
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
        item.key++
      })
    },
    removeInlineStyle (style) {
      const { startBlock, endBlock, blocks, startOffset, endOffset } = this.selection
      if (!blocks || !blocks.length) return

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
        item.key++
      }

      if (startBlock === endBlock) {
        if (startOffset === endOffset) return
        handleItem(startBlock, startOffset, endOffset)
        return
      }
      blocks.forEach(item => {
        if (!isTextBlock(item)) return
        if (item === startBlock) {
          handleItem(item, startOffset, item.text.length)
        } else if (item === endBlock) {
          handleItem(item, 0, endOffset)
        } else {
          handleItem(item, 0, item.text.length)
        }
      })
    },
    toggleInlineStyle (style, attrs = {}) {
      const { inlineStyles } = this.selection
      if (!inlineStyles) return
      if (!inlineStyles[style]) {
        this.addInlineStyle(style, attrs)
      } else {
        this.removeInlineStyle(style)
      }
      this.restoreSelection()
    },
    setBlockType (type, attrs = {}) {
      // console.log(type, attrs)
      const { blocks } = this.selection
      blocks.forEach(item => {
        if (!isTextBlock(item)) return
        this.$set(item, 'type', type)
        if (type === 'todolist') this.$set(item, 'checked', false)
        for (let key in attrs) this.$set(item, key, attrs[key])
      })
    },
    clearBlockType () {
      const { blocks } = this.selection
      let attrs = ['type', 'id', 'key', 'text', 'ranges']
      blocks.forEach(item => {
        if (!isTextBlock(item)) return
        for (let key in item) if (!attrs.includes(key)) delete item[key]
        this.$set(item, 'type', 'paragraph')
        this.$set(item, 'key', 0)
        this.$set(item, 'text', item.text || '')
        this.$set(item, 'ranges', item.ranges || [])
      })
    },
    toggleBlockType (type, attrs = {}) {
      const { blockStyle, startBlock } = this.selection
      let isSame = type === blockStyle
      // 对 heading 特殊处理
      if (startBlock.type === 'heading') isSame = blockStyle === type + attrs.level
      if (isSame) {
        this.clearBlockType()
      } else {
        this.setBlockType(type, attrs)
      }
      this.restoreSelection()
    },
    restoreSelection () {
      const { startBlock, endBlock, startOffset, endOffset } = this.selection
      this.setSelection(startBlock, endBlock, startOffset, endOffset)
    },
    setSelection (startBlock, endBlock, startOffset, endOffset) {
      this.$nextTick(() => {
        try {
          const startNode = getNodeById(startBlock.id)
          const endNode = getNodeById(endBlock.id)
          const start = getFocusNodeAndOffset(startNode, startOffset)
          const end = (startBlock === endBlock && startOffset === endOffset)
            ? start
            : getFocusNodeAndOffset(endNode, endOffset)
          // console.log(start, end)
          const selection = getSelection()
          const range = document.createRange()
          range.setStart(start.focusNode, start.focusOffset)
          range.setEnd(end.focusNode, end.focusOffset)
          selection.removeAllRanges()
          selection.addRange(range)
        } catch (err) {
          console.warn('setRange failed: ' + err.message)
        }
      })
    },
    clearSelection () {
      for (let key in this.selection) this.selection[key] = null
    },
    addBlockAt (index, block) {
      if (!block) return
      block.type = block.type || 'paragraph'
      this.value.blocks.splice(index, 0, block)
    },
    removeBlock (block) {
      if (!block) return
      const { blocks } = this.value
      const i = blocks.indexOf(block)
      if (i < 0) return
      blocks.splice(i, 1)
    },
    getValue (e) {
      const value = JSON.parse(JSON.stringify(this.value))
      value.blocks.forEach(block => {
        delete block.id
        delete block.key
        if (block.ranges && block.ranges.length) {
          const { text } = block
          if (text === undefined && block.ranges) {
            delete block.ranges
            return
          }
          block.ranges.forEach((range, i) => {
            const { offset, length } = range
            if (offset < 0) range.offset = 0
            if (offset + length > text.length) range.length = text.length - offset
            if (!length) {
              block.ranges.splice(i, 1)
            }
          })
        }
      })
      return value
    },
    historyForward () {
      const { list } = this.history
      const historyItem = {
        value: JSON.stringify(this.value)
      }
      historyItem.selection = JSON.stringify(this.selection)
      list.push(historyItem)
      if (list.length > 20) list.shift()
      this.history.index = list.length - 1 || 0
    },
    historyBack () {
      const { list } = this.history
      if (list.length < 2) return
      this.isHistoryBacking = true
      list.pop()
      const historyItem = list[list.length - 1]
      // const prevItem = list[list.length - 2]
      this.value.blocks = JSON.parse(historyItem.value).blocks
      this.selection = JSON.parse(historyItem.selection)
      // if (prevItem) this.selection = JSON.parse(prevItem.selection)
      this.restoreSelection()
    }
  }
}
