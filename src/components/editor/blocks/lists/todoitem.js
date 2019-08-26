import blockMixin from '../block-mixin'
import textRender from '../../text/text-render'
import TextEditor from '../../text/text-editor'
import Checkbox from './checkbox'

export default {
  name: 'editor-todo-item',
  mixins: [blockMixin],
  render (h) {
    const { readonly, value } = this
    const tagName = 'li'
    if (readonly) {
      const children = textRender(h, this, value.text, value.ranges)
      children.unshift(h(Checkbox))
      return h(tagName, children)
    }
    return h(tagName, [
      h(Checkbox),
      h(TextEditor, {
        props: { tagName: 'span', value, readonly }
      })
    ])
  }
}
