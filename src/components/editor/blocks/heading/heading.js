import createBlockTextElement from '../create-block-text-element'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-block-heading',
  mixins: [blockMixin],
  render (h) {
    let { value } = this
    const tagName = 'h' + (value.level || 1)
    return h('div', [createBlockTextElement(h, this, tagName, value)])
  }
}
