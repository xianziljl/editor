import textRender from '../../text/text-render'
import TextEditor from '../../text/text-editor'

export default {
  name: 'editor-list-item',
  inject: ['editor', 'list'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    const { text, ranges } = this.value
    const tagName = 'li'
    if (this.readonly) return h(tagName, textRender(h, this, text, ranges))
    return h(TextEditor, {
      props: { tagName, value: this.value },
      on: Object.assign({}, this.$listeners, {
        'insert-before': e => {
          const { blocks } = this.list.value
          this.editor.insertBeforeBlock(blocks, this.value, e)
        },
        'insert-after': e => {
          if (this.value.text.length) {
            const { blocks } = this.list.value
            this.editor.insertAfterBlock(blocks, this.value, e)
            return
          }
          this.list.split(this.value)
        },
        'clear-block-style': val => {
          this.list.split(val, 'paragraph')
        }
      })
    })
  }
}
