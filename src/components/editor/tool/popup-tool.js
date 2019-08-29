import Border from './items/bold'
import Italic from './items/italic'
import Link from './items/link'
import Code from './items/code'
import Hilight from './items/hilight'
import Strikethrough from './items/strikethrough'

const items = [Border, Italic, Link, Strikethrough, Code, Hilight]

export default {
  name: 'editor-tool-popup',
  inject: ['editor'],
  data () {
    return {
      isShow: false,
      isUnder: false,
      position: {}
    }
  },
  provide () {
    return {
      tool: this
    }
  },
  render (h) {
    const { x, y, arrowX } = this.position
    const children = items.map(item => {
      return h(item)
    })
    children.push(h('i', {
      class: 'editor-tool-popup-arrow',
      style: { left: arrowX + '%' }
    }))
    return h('div', {
      class: [
        'editor-tool-popup',
        // this.isUnder ? 'editor-tool-popup-under' : '',
        this.isShow ? 'editor-tool-popup-show' : ''
      ],
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
  },
  watch: {
    'editor.selection.rect' (val) {
      if (val) this.position = this.getPosition()
      this.$nextTick(() => {
        this.isShow = !!val
      })
    }
  },
  methods: {
    getPosition () {
      const { rect } = this.editor.selection
      if (!rect || !this.$el) return { x: 0, y: 0 }
      const PADDING = 0
      const { clientWidth, clientHeight } = this.$el
      const innerWidth = this.$el.parentNode.clientWidth

      const { left, top, width } = rect
      let x = ~~(left + (width - clientWidth) / 2)
      let y = ~~(top - clientHeight - 10)
      let arrowX = 50
      if (x < PADDING) x = PADDING
      if (x + clientWidth + PADDING > innerWidth) x = innerWidth - clientWidth - PADDING
      arrowX = (left - x + width / 2) / clientWidth * 100
      // if (y < PADDING) {
      //   y = top + height + 10
      //   this.isUnder = true
      // }
      return { x, y, arrowX }
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
