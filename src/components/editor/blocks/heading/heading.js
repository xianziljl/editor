import blockMixin from '../block-mixin'
import renderText from '../../text/text-render'

export default {
  name: 'editor-block-heading',
  mixins: [blockMixin],
  render (h) {
    let { text, ranges, key, level } = this.value
    const tagName = 'h' + (level || 1)
    return h('div', {
      key,
      attrs: { id: `user-content-${text}` }
    }, [
      h(tagName, renderText(h, this, text, ranges))
    ])
  }
}
