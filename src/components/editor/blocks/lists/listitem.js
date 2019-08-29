import renderText from '../../text/text-render'
import TextEditor from '../../text/text-editor'
import blockMxin from '../block-mixin'

export default {
  name: 'editor-list-item',
  mixins: [blockMxin],
  render (h) {
    const { text, ranges } = this.value
    const tagName = 'li'
    if (this.readonly) return h(tagName, renderText(h, this, text, ranges))
    return h(TextEditor, {
      class: 'editor-block',
      props: { tagName, value: this.value },
      on: Object.assign({}, this.$listeners, {
        'newline-before': this.newlineBefore,
        'newline-after': this.newlineAfter,
        'clear-block-style': this.clearBlockStyle
      })
    })
  }
}
