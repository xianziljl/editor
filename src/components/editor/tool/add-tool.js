import { getNodeById, getRangeRect } from '../utils/editor-util'
import toolMaps from './popup-tool-map'
const { toolMap } = toolMaps

const items = ['heading1', 'heading2', 'blockquote', 'unorderlist', 'orderlist', 'todolist', 'hr',
  'image', 'video', 'divider', 'blockcode']

export default {
  name: 'editor-tool-add',
  inject: ['$editor'],
  provide () {
    return {
      $tool: this
    }
  },
  data () {
    return {
      isShow: false,
      isOpen: false,
      position: {}
    }
  },
  watch: {
    '$editor.selection.startBlock' (startBlock) {
      const endBlock = this.$editor.selection.endBlock
      this.isShow = (startBlock && startBlock === endBlock && startBlock.type === 'paragraph' && !startBlock.text.length)
      if (this.isShow) this.$nextTick(this.getPosition)
      else this.isOpen = false
    }
  },
  render (h) {
    const { isShow, isOpen, position } = this
    const { x, y } = position
    const addBtn = h('button', {
      class: ['editor-tool-btn', 'editor-tool-add-btn'],
      on: {
        click: e => { this.isOpen = !this.isOpen }
      }
    })

    const btns = items.map(item => h(toolMap[item]))

    const btnsContainer = h('div', {
      class: 'editor-tool-add-btns',
      on: { mousedown: this.onMousedown }
    }, btns)

    return h('div', {
      class: [
        'editor-tool-add',
        isShow ? 'editor-tool-add-show' : '',
        isOpen ? 'editor-tool-add-open' : ''
      ],
      style: { left: x + 'px', top: y + 'px' },
      on: {
        keydown: this.onKeydown
      }
    }, [addBtn, btnsContainer])
  },
  methods: {
    getPosition () {
      const { startBlock } = this.$editor.selection
      const node = getNodeById(startBlock.id)
      if (!node) {
        this.position = { x: 0, y: 0 }
        return
      }
      const nodeHeight = node.clientHeight
      const { clientHeight } = this.$el
      const rect = getRangeRect(node, this.$editor.$el)
      // console.log(rect)
      this.position = {
        x: rect.left + 5,
        y: rect.top + (nodeHeight - clientHeight) / 2
      }
      // console.log(this.position.x, this.position.y)
    },
    onMousedown (e) {
      this.$editor.isOperating = true
    },
    onKeydown (e) {
      switch (e.keyCode) {
        case 27:
          this.isOpen = false
          break
        case 9:
          this.isOpen = true
          break
      }
    }
  }
}
