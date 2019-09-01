import debounce from 'debounce'
import ToolPopup from './tool/popup-tool'
// import ToolBlock from './tool/block-tool'
import textRange from './text/text-range'
import formatters from './formatters'
import createGUID from './utils/createGUID'
import getEditorByKey from './utils/getEditorByKey'
import renderBlocks from './blocks/block-render'

function formatValue (value) {
  if (!value) return
  if (!value.blocks || !(value.blocks instanceof Array)) value.blocks = []
  value.blocks.forEach(item => {
    item.key = createGUID()
    if (item.blocks && item.blocks.length) formatValue(item)
  })
}

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
      isInputing: false,
      isMousedown: false,
      isSelecting: false,
      isComposing: false, // 正在拼写
      isOperating: false, // 正在操作工具栏
      isHistoryBacking: false, // 正在进行回退
      isSetingRange: false,
      selection: {
        oldRange: null,
        range: null, // { offset, length }
        styles: {}, // 选中文字已有的样式
        blockStyle: null, // 选中的 block 样式
        rect: null, // { width, height, left, top }
        target: null // TextEditor
      },
      history: []
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
  // watch: {
  //   value: {
  //     handler () {
  //       if (this.isHistoryBacking) {
  //         this.isHistoryBacking = false
  //         return
  //       }
  //       this.historyForward()
  //     },
  //     deep: true
  //   }
  // },
  render (h) {
    console.log('render')
    const { value, readonly } = this
    // 渲染子元素
    const article = h('article', {
      // attrs: { contenteditable: true }
    }, renderBlocks(h, value.blocks, readonly))
    const children = [article]
    // 渲染工具条
    if (!readonly) {
      const toolPopup = h(ToolPopup, { ref: 'popupTool' })
      // const toolBlock = h(ToolBlock, { ref: 'toolBlock' })
      children.push(toolPopup)
      // children.push(toolBlock)
    }

    return h('div', {
      class: ['editor'],
      on: readonly ? {} : {
        mousedown: this.onMousedown,
        mouseup: this.onMouseup,
        input: this.onInput,
        compositionstart: this.onCompositionstart,
        compositionend: this.onCompositionend,
        keydown: this.onKeydown,
        cut: this.onCut,
        copy: this.onCopy,
        paste: this.onPaste,
        drop: this.onDrop
      }
    }, children)
  },
  mounted () {
    document.addEventListener('selectionchange', this.onSelectionchange)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('selectionchange', this.onSelectionchange)
    })
  },
  methods: {
    onInput (e) {
      if (this.isComposing || this.isOperating) return
      // console.log('input')
      // 在一些非文档编辑内容时不做处理，例如：输入 A 链接的地址时
      if (!this.selection.target || e.target !== this.selection.target.$el) return
      const { replaceRange, splitRange, mergeRanges, filterRanges } = textRange
      const { value, $el } = this.selection.target
      const { range } = this.selection
      const oldLength = value.text.length
      const newLength = $el.innerText.length
      const oldRange = { offset: range.offset, length: range.length }
      // this.onSelectionchange()
      let inputLength = e.data ? e.data.length : newLength + oldRange.length - oldLength
      // 选中英文单词删除时会多删除单词前的空格，此时 inputLength < 0, 将选区修正为选中单词前的空格 inputLength 修正为 0。
      if (inputLength < 0) {
        oldRange.offset += inputLength
        oldRange.length -= inputLength
        inputLength = 0
      }
      // console.log(range.offset, this.selection.range.offset)
      // console.log(JSON.stringify(oldRange), inputLength)
      replaceRange(value.ranges, oldRange, inputLength)
      // 在 range 末尾输入空格时 跳出 range
      if (e.data === ' ' && !oldRange.length) {
        let newRanges = []
        value.ranges.forEach((item, i) => {
          if (oldRange.offset === item.offset + item.length - 1) {
            const splited = splitRange(item, { offset: oldRange.offset, length: 1 })
            splited.forEach(r => { r.href = item.href })
            newRanges = newRanges.concat(splited)
            item.offset = item.length = 0
          }
        })
        newRanges.forEach(r => { value.ranges.push(r) })
      }
      value.text = $el.innerText.replace(/\n/g, ' ')
      // 用于快捷格式化段落
      let formatted = false
      if (value.type === 'paragraph') {
        formatters.forEach(formatter => {
          const res = formatter(value, this)
          if (res) formatted = true
        })
      }
      // 整理range
      mergeRanges(value.ranges)
      filterRanges(value.ranges, $el.innerText)
      // ranges 更改后也要更新光标处的已经应用样式
      // this.selection.styles = textRange.getRangeStyles(this.selection.range, this.selection.target.value.ranges)
      // 更新文字
      this.selection.target.key += 1
      // 复位光标
      this.$nextTick(() => {
        const newOffset = formatted ? 0 : oldRange.offset + inputLength
        this.setRange(this.selection.target, newOffset, 0)
        // console.log('input end')
        // console.log('set range 3')
      })
    },
    onCompositionstart (e) {
      this.isComposing = true
    },
    onCompositionend (e) {
      this.isComposing = false
      this.onInput(e)
    },
    onMousedown (e) {
      this.isMousedown = true
      const popupTool = this.$refs.popupTool
      const path = e.path || (e.composedPath && e.composedPath())
      this.isOperating = !!((popupTool && path.includes(this.$refs.popupTool.$el)))
    },
    onMouseup (e) {
      this.isMousedown = false
    },
    onKeydown (e) {
      // console.log(e)
      this.onSelectionchange()
      const ctrl = (e.metaKey || e.ctrlKey)
      // if (ctrl) e.preventDefault()
      switch (e.keyCode) {
        case 37:
        case 38:
          this.navitagionBack()
          break
        case 39:
        case 40:
          this.navitagionForward()
          break
      }
      // 禁用快捷键
      if (ctrl) {
        // console.log(e.keyCode)
        switch (e.keyCode) {
          case 66: // ctrl+B
            e.preventDefault()
            this.exe('bold')
            break
          case 73: // ctrl+I
            e.preventDefault()
            this.exe('italic')
            break
          case 85: // ctrl+U
            e.preventDefault()
            this.exe('underline')
            break
          case 83: // ctrl+S
            // e.preventDefault()
            // console.log(e)
            // this.exe('underline')
            break
          case 90: // ctrl+Z
            // this.historyBack()
            break
        }
      }
    },
    onSelectionchange (e) {
      // console.log(this.isInputing)
      // console.log('selection change')
      if (this.isOperating || this.isSetingRange || this.value.readonly) return
      if (this.isComposing || this.readonly || !this.selection.target) return
      // console.log('on selectionchange')
      const { getRange, getRangeRect, getRangeStyles } = textRange
      // console.log(JSON.stringify(this.selection.rect))
      const focusNode = document.activeElement
      const range = getRange(focusNode)
      const rangeRect = getRangeRect(this.$el)
      // this.selection.oldRange = this.selection.range
      this.selection.range = range
      // console.log(range.offset)
      this.selection.styles = getRangeStyles(this.selection.range, this.selection.target.value.ranges)
      this.selection.blockStyle = this.selection.target.value.type
      // if (this.isMousedown && (!range || !range.length)) this.isSelecting = true
      this.selection.rect = (!range || !range.length) ? null : rangeRect

      if (!this.history.length) {
        this.historyForward()
      }
    },
    onCut (e) {
      console.log('onCut')
    },
    onCopy (e) {
      console.log('onCopy')
    },
    onPaste (e) {
      console.log('onPaste')
    },
    onDrop (e) {
      e.preventDefault()
    },
    /**
     * 设置文字样式
     * @param {TextEditor} target 所操作的 text-editor 组件
     * @param {Object} range { offset, length }
     * @param {string} style 样式名称
     * @param {href} href style 为 link 时需要传入
     */
    setTextStyle (target, range, style, href) {
      const { mergeRanges, splitRange, filterRanges } = textRange
      const { styles } = this.selection
      const value = target.value
      if (!range) return
      const { offset, length } = range
      if (!length) return
      if (!styles[style]) { // 新增样式
        const newRange = { offset, length, style }
        if (style === 'link') newRange.href = href
        value.ranges.push(newRange)
      } else { // 取消样式
        const rangeEnd = offset + length
        let focusRange = value.ranges.filter(item => {
          const end = item.offset + item.length
          if (item.style === style && item.offset <= offset && end >= rangeEnd) return item
        })[0]
        if (!focusRange) return
        const i = value.ranges.indexOf(focusRange)
        value.ranges.splice(i, 1)
        if (focusRange.style !== 'link') value.ranges = value.ranges.concat(splitRange(focusRange, range))
      }
      mergeRanges(value.ranges)
      filterRanges(value.ranges, value.text)
      // ranges 更改后也要更新光标处的已经应用样式
      // this.selection.styles = textRange.getRangeStyles(this.selection.range, this.selection.target.value.ranges)
      target.key += 1
      this.$nextTick(() => {
        this.setRange(target, range.offset, range.length)
      })
    },
    /**
     * 设置 block 类型
     * @param {VueComponent} target 所操作的子组件
     * @param {string} type 对应 value 中的type
     */
    setBlockType (target, type) {
      target.value.type = type
      // this.$nextTick(() => {
      //   this.setRange(target, range.offset, range.length)
      // })
    },
    /**
     * 设置光标位置
     * @param {TextEditor} target 所操作的 text-editor 组件
     * @param {number} offset 光标在 target.$el 的起始位置
     * @param {number} length 选区长度
     */
    setRange (target, offset, length) {
      // console.log(target.$el, offset, length)
      this.isSetingRange = true
      const { getFocusNodeAndOffset } = textRange
      const start = getFocusNodeAndOffset(target.$el, offset)
      const end = length ? getFocusNodeAndOffset(target.$el, offset + length) : start
      const selection = getSelection()
      const range = document.createRange()
      // console.log(range, start, end)
      // console.log(start, end)
      try {
        range.setStart(start.focusNode, start.focusOffset)
        range.setEnd(end.focusNode, end.focusOffset)
        selection.removeAllRanges()
        selection.addRange(range)
      } catch (err) {
        console.warn('setRange failed: ' + err.message)
      }
      // console.log('set range 2')
      this.isSetingRange = false
    },
    // 快捷调用 自动确定选区和操作对象
    exe (style, href) {
      // console.log(this.$refs.popupTool)
      const { target, range } = this.selection
      this.setTextStyle(target, range, style, href)
    },
    historyForward: debounce(function () {
      const { range, target } = this.selection
      this.history.push(JSON.stringify({
        range,
        focusKey: target ? target.value.key : null,
        blocks: this.value.blocks
      }))
      if (this.history.length > 10) this.history.shift()
    }, 300),
    historyBack () {
      if (this.history.length < 2) return
      this.isHistoryBacking = true
      this.history.pop()
      const value = JSON.parse(this.history[this.history.length - 1])
      const { range, focusKey } = value
      // console.log(range, focusKey)
      this.value.blocks = value.blocks
      this.$nextTick(() => {
        // this.selection.styles = textRange.getRangeStyles(this.selection.range, this.selection.target.value.ranges)

        const target = getEditorByKey(focusKey)
        if (range && target) this.setRange(target, range.offset, range.length)
      })
    },
    insertBeforeBlock (blocks, block, insertBlock) {
      const i = blocks.indexOf(block)
      blocks.splice(i, 0, insertBlock)
    },
    insertAfterBlock (blocks, block, insertBlock) {
      const i = blocks.indexOf(block)
      blocks.splice(i + 1, 0, insertBlock)
      const key = insertBlock.key
      this.$nextTick(() => {
        const target = getEditorByKey(this, key)
        // console.log(target)
        this.setRange(target, 0, 0)
      })
    },
    navitagionBack () {
      const { range } = this.selection
      if (!range || range.offset !== 0 || range.length) return
      console.log('navitagionBack')
      // const prevValue =
    },
    navitagionForward () {
      const { range, target } = this.selection
      if (!range || !target || range.offset !== target.value.text.length || range.length) return
      console.log('navitagionForward')
    }
  }
}