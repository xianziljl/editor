import createBlockTextElement from '../create-block-text-element'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-block-paragraph',
  mixins: [blockMixin],
  render (h) {
    let { value } = this
    const tagName = 'p'
    return h('div', [createBlockTextElement(h, this, tagName, value)])
  }
}
