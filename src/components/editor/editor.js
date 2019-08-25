// import debounce from 'debounce'
import { blockMap } from './map'
import ToolFloat from './tool/float'
import textRange from './text/text-range'
import formatters from './formatters'
import createGUID from './utils/createGUID'

function formatValue (value) {
  if (!value || !(value instanceof Array)) return
  value.forEach(item => { item.key = createGUID() })
}

export default {
  name: 'editor',
  props: {
    readonly: Boolean,
    value: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      isMousedown: false,
      isSelecting: false,
      isComposing: false, // 正在拼写
      isOperating: false, // 正在操作工具栏
      selection: {
        range: null, // { offset, length }
        styles: {}, // 选中文字已有的样式
        rect: null, // { width, height, left, top }
        target: null // TextEditor
      }
    }
  },
  provide () {
    return {
      editor: this,
      selection: this.selection
    }
  },
  created () {
    formatValue(this.value)
  },
  watch: {
    value (val) {
      formatValue(val)
    }
  },
  render (createElement) {
    const { value, readonly, selection } = this
    // 渲染子元素
    const children = value.map(item => {
      const component = blockMap[item.type] || blockMap['paragraph']
      return createElement(component, {
        props: { value: item, readonly },
        on: {
          'link-hover': e => { console.log('link-hover', e.target.getAttribute('href')) },
          'link-leave': e => { console.log('link-leave') }
        },
        key: item.key
      })
    })
    // 渲染工具条
    if (!readonly && selection.range && selection.range.length) {
      const toolFloat = createElement(ToolFloat, {
        props: { rect: this.selection.rect },
        ref: 'floatTool'
      })
      children.push(toolFloat)
    }
    //
    return createElement('article', {
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
      if (this.isComposing) return
      // 在一些非文档编辑内容时不做处理，例如：输入 A 链接的地址时
      if (!this.selection.target || e.target !== this.selection.target.$el) return
      const { replaceRange, splitRange, mergeRanges, filterRanges } = textRange
      const { value, $el } = this.selection.target
      const oldLength = value.text.length
      const newLength = $el.innerText.length
      const oldRange = this.selection.range
      let inputLength = e.data ? e.data.length : newLength + oldRange.length - oldLength
      // 选中英文单词删除时会多删除单词前的空格，此时 inputLength < 0, 将选区修正为选中单词前的空格 inputLength 修正为 0。
      if (inputLength < 0) {
        oldRange.offset += inputLength
        oldRange.length -= inputLength
        inputLength = 0
      }
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

      formatters.forEach(formatter => {
        formatter(value)
      })
      // 整理range
      mergeRanges(value.ranges)
      filterRanges(value.ranges, $el.innerText)
      // ranges 更改后也要更新光标处的已经应用样式
      this.selection.styles = textRange.getRangeStyles(this.selection.range, this.selection.target.value.ranges)
      // 更新文字
      this.selection.target.key += 1
      // 复位光标
      this.$nextTick(() => {
        const offset = this.selection.range ? this.selection.range.offset : 0
        // console.log(this.selection.target)
        this.setRange(this.selection.target, offset, 0)
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
      const floatTool = this.$refs.floatTool
      this.isOperating = !!((floatTool && e.path.includes(this.$refs.floatTool.$el)))
    },
    onMouseup (e) {
      this.isMousedown = false
    },
    onKeydown (e) {
      const ctrl = (e.metaKey || e.ctrlKey)
      // if (ctrl) e.preventDefault()
      switch (e.keyCode) {
        case 13: // 回车
          e.preventDefault()
          this.$emit('')
          break
      }
      // 禁用快捷键
      if (ctrl) {
        switch (e.keyCode) {
          case 66: // ctrl+B or ctrl+b
          case 98:
          case 73: // ctrl+I or ctrl+i
          case 105:
          case 85: // ctrl+U or ctrl+u
          case 117: {
            e.preventDefault()
            break
          }
        }
      }
    },
    onSelectionchange (e) {
      // console.log(e)
      if (this.isOperating) return
      if (this.isComposing || this.readonly || !this.selection.target) return
      // console.log(JSON.stringify(this.selection.rect))
      const focusNode = document.activeElement
      const range = textRange.getRange(focusNode)
      const rangeRect = textRange.getRangeRect(this.$el)
      this.selection.range = range
      this.selection.styles = textRange.getRangeStyles(this.selection.range, this.selection.target.value.ranges)
      if (this.isMousedown && (!range || !range.length)) this.isSelecting = true
      this.selection.rect = (!range || !range.length) ? null : rangeRect
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
      this.selection.styles = textRange.getRangeStyles(this.selection.range, this.selection.target.value.ranges)
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
      const { getFocusNodeAndOffset } = textRange
      const start = getFocusNodeAndOffset(target.$el, offset)
      const end = length ? getFocusNodeAndOffset(target.$el, offset + length) : start
      const selection = getSelection()
      const range = document.createRange()
      range.setStart(start.focusNode, start.focusOffset)
      range.setEnd(end.focusNode, end.focusOffset)
      selection.removeAllRanges()
      selection.addRange(range)
    },
    // 快捷调用 自动确定选区和操作对象
    exe (style, href) {
      // console.log(this.$refs.floatTool)
      const { target, range } = this.selection
      this.setTextStyle(target, range, style, href)
    }
  }
}
