import toolMaps from './popup-tool-map'
const { toolMap, toolItems } = toolMaps
// console.log(toolMap, toolItems)

export default {
  name: 'editor-tool-popup',
  inject: ['$editor'],
  data () {
    return {
      isShow: false,
      // focusBlockType: 'paragraph',
      position: {},
      items: []
    }
  },
  provide () {
    return {
      $tool: this
    }
  },
  render (h) {
    const { items, position } = this
    const { x, y, arrowX } = position
    // const { rangeRect } = this.$editor.selection
    // console.log(x, y, arrowX)
    const children = items.map(item => {
      return h(toolMap[item])
    })
    children.push(h('i', {
      class: 'editor-tool-popup-arrow',
      style: { left: arrowX + '%' }
    }))
    return h('div', {
      class: ['editor-tool-popup', '', this.isShow ? 'editor-tool-popup-show' : ''],
      style: { left: x + 'px', top: y + 'px' },
      on: { mousedown: this.onMousedown },
      key: 1
    }, children)
  },
  watch: {
    '$editor.isSelecting' (isSelecting) {
      this.isShow = !isSelecting && this.$editor.selection.rangeRect
      if (this.isShow) this.$nextTick(this.getPosition)
    },
    '$editor.selection.rangeRect' (val) {
      this.isShow = !this.$editor.isSelecting && val
      if (this.isShow) this.$nextTick(this.getPosition)
    },
    '$editor.selection.blockStyle' (style) {
      this.items = toolItems[style || 'paragraph']
    }
  },
  methods: {
    getPosition () {
      const { rangeRect } = this.$editor.selection
      if (!rangeRect || !this.$el) {
        this.position = { x: 0, y: 0, arrowX: 50 }
        return
      }
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
      this.position = { x, y, arrowX }
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
