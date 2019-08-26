import Border from './items/bold'
import Italic from './items/italic'
import Link from './items/link'
import Code from './items/code'
import Hilight from './items/hilight'
import Strikethrough from './items/strikethrough'

const items = [Border, Italic, Strikethrough, Link, Code, Hilight]

export default {
  name: 'editor-tool-flaot',
  inject: ['editor'],
  props: {
    rect: Object // 矩形范围
  },
  data () {
    return {
      isShow: false,
      position: {}
    }
  },
  provide () {
    return {
      floatTool: this
    }
  },
  render (h) {
    const { x, y } = this.position
    const children = items.map(item => {
      return h(item)
    })
    return h('div', {
      class: ['editor-tool-flaot', this.isShow ? 'editor-tool-flaot-show' : ''],
      style: {
        left: x + 'px',
        top: y + 'px'
      },
      on: {
        mousedown: this.onMousedown,
        mouseup: this.onMouseuup
      },
      key: 1
    }, children)
  },
  mounted () {
    this.position = this.getPosition()
    this.$nextTick(() => { this.isShow = true })
  },
  watch: {
    rect () {
      this.position = this.getPosition()
    }
  },
  methods: {
    getPosition () {
      if (!this.rect || !this.$el) return { x: 0, y: 0 }
      const PADDING = 0
      const { clientWidth, clientHeight } = this.$el
      const innerWidth = this.$el.parentNode.clientWidth
      // console.log(this.$el.parentNode)
      const { left, top, width, height } = this.rect
      let x = ~~(left + (width - clientWidth) / 2)
      let y = ~~(top - clientHeight - 10)
      if (x < PADDING) x = PADDING
      if (x + clientWidth + PADDING > innerWidth) x = innerWidth - clientWidth - PADDING
      if (y < PADDING) y = top + height + 10
      return { x, y }
    },
    onMousedown (e) {
      this.editor.isOperating = true
      const { target, range } = this.editor.selection
      this.editor.setRange(target, range.offset, range.length)
    },
    onMouseuup (e) {
      // this.editor.isOperating = false
    },
    close (e) {
      this.editor.isOperating = false
      // console.log('close')
      const { range, target } = this.editor.selection
      // console.log(range.offset, range.length)
      range.offset = range.offset + range.length
      range.length = 0
      this.editor.selection.rect = null
      this.editor.setRange(target, range.offset, 0)
    }
  }
}
