import renderText from '../../text/text-render'
import TextEditor from '../../text/text-editor'
import Checkbox from './checkbox'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-todo-item',
  mixins: [blockMixin],
  render (h) {
    const { readonly, value } = this
    const tagName = 'li'
    if (readonly) {
      const children = renderText(h, this, value.text, value.ranges)
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
          'insert-before': this.insertBefore,
          'insert-after': this.insertAfter,
          'clear-block-style': this.clearBlockStyle
        })
      })
    ])
  }
}
