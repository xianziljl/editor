import Bold from './items/bold'
import Italic from './items/italic'
import Link from './items/link'
import Code from './items/code'
import Hilight from './items/hilight'
import Strikethrough from './items/strikethrough'

const items = [Bold, Italic, Strikethrough, Link, Code, Hilight]

export default {
  name: 'editor-tool-popup',
  inject: ['$editor'],
  data () {
    return {
      isShow: false,
      position: {}
    }
  },
  provide () {
    return {
      $tool: this
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
        'editor-tool-popup', '',
        this.isShow ? 'editor-tool-popup-show' : ''
      ],
      style: {
        left: x + 'px',
        top: y + 'px'
      },
      on: { mousedown: this.onMousedown },
      key: 1
    }, children)
  },
  watch: {
    '$editor.selection.rangeRect' (val) {
      if (val) this.position = this.getPosition()
      this.$nextTick(() => {
        this.isShow = !!val
      })
    }
  },
  methods: {
    getPosition () {
      const { rangeRect } = this.$editor.selection
      if (!rangeRect || !this.$el) return { x: 0, y: 0 }
      const PADDING = 0
      const { clientWidth, clientHeight } = this.$el
      const innerWidth = this.$el.parentNode.clientWidth

      const { left, top, width } = rangeRect
      let x = ~~(left + (width - clientWidth) / 2)
      let y = ~~(top - clientHeight - 10)
      let arrowX = 50
      if (x < PADDING) x = PADDING
      if (x + clientWidth + PADDING > innerWidth) x = innerWidth - clientWidth - PADDING
      arrowX = (left - x + width / 2) / clientWidth * 100
      return { x, y, arrowX }
    },
    onMousedown (e) {
      this.$editor.isOperating = true
    },
    close (e) {
      this.$editor.isOperating = false
      this.$editor.selection.rangeRect = null
    }
  }
}
