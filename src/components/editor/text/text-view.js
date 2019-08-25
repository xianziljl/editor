import textRender from './text-render'

export default {
  name: 'editor-text-view',
  props: {
    tagName: String,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  render (createElement) {
    const { tagName, value } = this
    const { text, ranges } = value
    return createElement(
      tagName || 'div',
      { class: 'editor-text-view' },
      textRender(createElement, this, text || '', ranges || [])
    )
  },
  mounted () {
    console.log('mounted')
  }
}
