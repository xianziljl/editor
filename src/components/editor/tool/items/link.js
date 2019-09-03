import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-link',
  mixins: [toolItemMixin],
  data () {
    return {
      isInput: false // 是否在输入界面
    }
  },
  watch: {
    '$editor.selection.inlineStyles' (styles) {
      this.isActive = styles && styles.link
    },
    '$tool.isShow' () {
      this.isInput = false
    }
  },
  render (h) {
    const children = [h('button', {
      class: [
        'editor-tool-btn',
        'editor-tool-link',
        this.isActive ? 'editor-tool-btn-on' : ''
      ],
      on: {
        click: this.onClick
      }
    })]
    if (this.isInput) {
      const input = h('input', {
        attrs: { placeholder: '输入链接并回车' },
        on: { keydown: this.onKeydown }
      })
      children.push(input)
    }
    return h('div', {
      class: 'editor-tool--link'
    }, children)
  },
  methods: {
    onClick (e) {
      const { inlineStyles } = this.$editor.selection
      if (inlineStyles.link) {
        this.$editor.toggleInlineStyle('link')
        this.$editor.isOperating = false
        this.isInput = false
      } else {
        this.isInput = true
        this.$nextTick(() => {
          this.$el.querySelector('input').focus()
        })
      }
    },
    onKeydown (e) {
      // console.log(e.keyCode)
      e.stopPropagation()
      if (e.isComposing) return
      if (e.keyCode === 13) {
        e.preventDefault()
        if (!e.target.value) return
        this.$editor.toggleInlineStyle('link', { href: e.target.value })
        this.$editor.isOperating = false
        this.$tool.close()
        this.isInput = false
        return
      }
      if (e.keyCode === 27) {
        this.$editor.isOperating = false
        this.$tool.close()
        this.isInput = false
      }
    }
  }
}
