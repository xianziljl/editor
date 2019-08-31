import renderText from '../../text/text-render'
import Checkbox from './checkbox'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-todo-item',
  mixins: [blockMixin],
  render (h) {
    const { readonly, value } = this
    const tagName = 'li'
    const children = renderText(h, this, value.text, value.ranges)
    children.unshift(h(Checkbox, {
      props: { readonly, checked: this.value.checked }
    }))
    return h(tagName, {
      on: Object.assign({}, this.$listeners, {})
    }, children)
  }
}
