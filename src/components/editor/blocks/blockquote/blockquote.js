import createBlockTextElement from '../create-block-text-element'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-block-blockquote',
  mixins: [blockMixin],
  render (h) {
    let { value } = this
    const tagName = 'blockquote'
    return createBlockTextElement(h, this, tagName, value)
  }
}
