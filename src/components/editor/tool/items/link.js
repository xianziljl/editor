export default {
  name: 'editor-tool-link',
  inject: ['editor', 'tool'],
  data () {
    return {
      href: this.editor.selection.styles.link || '',
      isActive: false,
      isInput: false // 是否在输入界面
    }
  },
  watch: {
    'tool.isShow' (isShow) {
      if (isShow) this.isActive = !!this.editor.selection.styles.link
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
        attrs: {
          placeholder: '输入链接并回车',
          value: this.href
        },
        on: {
          keydown: this.onKeydown
        }
      })
      children.push(input)
    }
    return h('div', {
      class: 'editor-tool--link'
    }, children)
  },
  methods: {
    onClick (e) {
      const { styles } = this.editor.selection
      if (styles.link) {
        this.editor.exe('link')
        this.href = ''
        this.editor.isOperating = false
      } else {
        this.isInput = true
        this.$nextTick(() => {
          this.$el.querySelector('input').focus()
        })
      }
    },
    onInput (e) {
      this.href = e.target.value
    },
    onKeydown (e) {
      // console.log(e.keyCode)
      e.stopPropagation()
      if (e.isComposing) return
      if (e.keyCode === 13) {
        e.stopPropagation()
        if (!e.target.value) return
        this.editor.exe('link', e.target.value)
        this.editor.isOperating = false
        this.tool.close()
        return
      }
      if (e.keyCode === 27) {
        this.editor.isOperating = false
        this.tool.close()
      }
    }
  }
}
