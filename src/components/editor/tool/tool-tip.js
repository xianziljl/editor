import { getRangeRect } from '../utils/editor-util'

export default {
  name: 'editor-tool-tip',
  data () {
    return {
      isShow: false,
      isEnter: false,
      content: '',
      target: null,
      x: 0,
      y: 0,
      arrowX: 50,
      timer: null
    }
  },
  render (h) {
    const { isShow, content, x, y, arrowX } = this
    const arrow = h('i', {
      class: 'editor-tool-tip-arrow',
      style: { left: arrowX + '%' }
    })
    return h('div', {
      class: ['editor-tool-tip', isShow ? 'editor-tool-tip-show' : ''],
      style: { left: x + 'px', top: y + 'px' }
    }, [content, arrow])
  },
  mounted () {
    this.addListeners()
  },
  methods: {
    addListeners () {
      const editorEl = this.$el.parentNode
      editorEl.addEventListener('mouseenter', this.onMouseenter, true)
      editorEl.addEventListener('mouseleave', this.onMouseleave, true)
      this.$once('hook:beforeDestroy', () => {
        editorEl.removeEventListener('mouseenter', this.onMouseenter, true)
        editorEl.removeEventListener('mouseleave', this.onMouseleave, true)
      })
    },
    onMouseenter (e) {
      const el = e.target
      if (!el.dataset.tip || this.isEnter) return
      this.target = el
      this.isEnter = true
      this.timer = setTimeout(() => {
        if (this.isEnter) {
          this.content = this.target.dataset.tip
          this.isShow = true
          this.$nextTick(this.getPosition)
        }
      }, 500)
    },
    onMouseleave (e) {
      const el = e.target
      if (!el.dataset.tip) return
      clearTimeout(this.timer)
      this.isEnter = false
      this.content = ''
      this.isShow = false
    },
    getPosition () {
      const { target } = this
      const { clientWidth } = this.$el
      const editorEl = this.$el.parentNode
      const rect = getRangeRect(target, editorEl)
      const { left, top, width, height } = rect
      let x = ~~(left + (width - clientWidth) / 2)
      let y = ~~(top + height + 10)
      let arrowX = 50
      if (x < 0) x = 0
      if (x + clientWidth > innerWidth) x = innerWidth - clientWidth
      arrowX = (left - x + width / 2) / clientWidth * 100
      this.x = x
      this.y = y
      this.arrowX = arrowX
      // const
    }
  }
}
