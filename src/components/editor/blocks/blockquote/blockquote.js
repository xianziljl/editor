import blockMixin from '../block-mixin'
import renderText from '../../text/text-render'

export default {
  name: 'editor-block-blockquote',
  mixins: [blockMixin],
  render (h) {
    let { text, ranges, key } = this.value
    return h('div', { key }, [
      h('blockquote', renderText(h, this, text, ranges))
    ])
  }
}
