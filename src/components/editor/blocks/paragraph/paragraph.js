// import createBlockTextElement from '../create-block-text-element'
import blockMixin from '../block-mixin'
import renderText from '../../text/text-render'

export default {
  name: 'editor-block-paragraph',
  mixins: [blockMixin],
  render (h) {
    let { text, ranges, key } = this.value
    return h('div', {
      key,
      class: text.length ? '' : 'editor-block-paragraph-empty'
    }, [
      h('p', renderText(h, this, text, ranges))
    ])
  }
}
