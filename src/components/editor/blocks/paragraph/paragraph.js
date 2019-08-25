import createBlockTextElement from '../create-block-text-element'
import blockMixin from '../block-mixin'

export default {
  name: 'editor-block-paragraph',
  mixins: [blockMixin],
  render (createElement) {
    let { value } = this
    const tagName = 'p'
    return createBlockTextElement(createElement, this, tagName, value)
  }
}
