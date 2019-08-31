import renderText from '../../text/text-render'
// import TextEditor from '../../text/text-editor'
import blockMxin from '../block-mixin'

export default {
  name: 'editor-list-item',
  mixins: [blockMxin],
  render (h) {
    const { text, ranges } = this.value
    const tagName = 'li'
    return h(tagName, renderText(h, this, text, ranges))
  }
}
