import renderText from '../../text/text-render'
// import TextEditor from '../../text/text-editor'
import blockMxin from '../block-mixin'

export default {
  name: 'editor-list-item',
  mixins: [blockMxin],
  render (h) {
    const { text, ranges, key } = this.value
    return h('li', { key }, renderText(h, this, text, ranges))
  }
}
