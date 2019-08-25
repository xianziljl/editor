export default {
  name: 'editor-tool-link',
  inject: ['editor', 'floatTool'],
  data () {
    return {
      href: this.editor.selection.styles.link || '',
      isInput: false // 是否在输入界面
    }
  },
  render (createElement) {
    const { styles } = this.editor.selection
    const children = [createElement('button', {
      class: ['editor-tool-btn', styles.link ? 'editor-tool-btn-on' : ''],
      on: {
        click: this.onClick
      }
    }, ['L'])]
    if (this.isInput) {
      const input = createElement('input', {
        attrs: {
          placeholder: 'URL',
          value: this.href
        },
        on: {
          input: this.onInput,
          keydown: this.onKeydown
        }
      })
      children.push(input)
    }
    return createElement('div', {
      class: 'editor-tool-link'
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
      if (e.isComposing) return
      if (e.keyCode === 13) {
        this.editor.exe('link', this.href)
        this.editor.isOperating = false
        this.floatTool.close()
      }
    }
  }
}
