import renderText from '../../text/text-render'
import blockMxin from '../block-mixin'

export default {
  name: 'editor-blockcode-line',
  mixins: [blockMxin],
  render (h) {
    const { text, ranges } = this.value
    const tagName = 'div'
    return h(tagName, renderText(h, this, text, ranges))
  }
}
