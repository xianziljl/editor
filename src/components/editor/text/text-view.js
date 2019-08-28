import renderText from './text-render'

export default {
  name: 'editor-text-view',
  props: {
    tagName: String,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (h) {
    const { tagName, value } = this
    const { text, ranges } = value
    return h(
      tagName || 'div',
      { class: 'editor-text-view' },
      renderText(h, this, text || '', ranges || [])
    )
  },
  mounted () {
    console.log('mounted')
  }
}
