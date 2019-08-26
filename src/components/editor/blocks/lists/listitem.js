import blockMixin from '../block-mixin'
import textRender from '../../text/text-render'
import TextEditor from '../../text/text-editor'

export default {
  name: 'editor-list-item',
  inject: ['editor'],
  mixins: [blockMixin],
  render (h) {
    const { text, ranges } = this.value
    const tagName = 'li'
    if (this.readonly) return h(tagName, textRender(h, this, text, ranges))
    return h(TextEditor, {
      props: { tagName, value: this.value },
      on: Object.assign({}, this.$listeners, {})
    })
  }
}
