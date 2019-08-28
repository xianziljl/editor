import textRender from '../../text/text-render'
import TextEditor from '../../text/text-editor'
import Checkbox from './checkbox'

export default {
  name: 'editor-todo-item',
  inject: ['editor', 'list'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    const { readonly, value } = this
    const tagName = 'li'
    if (readonly) {
      const children = textRender(h, this, value.text, value.ranges)
      children.unshift(h(Checkbox, {
        props: { readonly, checked: this.value.checked }
      }))
      return h(tagName, {
        on: Object.assign({}, this.$listeners, {})
      }, children)
    }
    return h(tagName, [
      h(Checkbox, {
        props: { readonly, checked: this.value.checked },
        on: {
          change: e => { this.value.checked = e }
        }
      }),
      h(TextEditor, {
        props: { tagName: 'div', value },
        on: Object.assign({}, this.$listeners, {
          'insert-before': e => {
            const { blocks } = this.list.value
            this.editor.insertBeforeBlock(blocks, this.value, e)
          },
          'insert-after': e => {
            console.log(this.value.text)
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
    ])
  }
}
