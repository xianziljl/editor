import renderText from '../../text/text-render'
import Checkbox from './checkbox'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-todo-item',
  mixins: [blockMixin],
  render (h) {
    const { readonly, value } = this
    const { text, ranges, key, checked } = value
    const texts = h('div', {
      class: 'editor-todo-content'
    }, renderText(h, this, text, ranges))
    const checkbox = h(Checkbox, {
      props: { readonly, checked },
      on: {
        change: e => { value.checked = e }
      }
    })
    return h('li', {
      class: checked ? 'editor-todo-checked' : '',
      on: Object.assign({}, this.$listeners, {}),
      key
    }, [checkbox, texts])
  }
}
