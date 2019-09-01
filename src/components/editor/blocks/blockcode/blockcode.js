import renderText from '../../text/text-render'
import blockMxin from '../block-mixin'

export default {
  name: 'editor-blockcode-line',
  mixins: [blockMxin],
  render (h) {
    const { text, ranges, key } = this.value
    return h('div', { key }, renderText(h, this, text, ranges))
  }
}
