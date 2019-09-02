import blockMixin from '../block-mixin'
export default {
  name: 'editor-block-divider',
  mixins: [blockMixin],
  render (h) {
    return h('hr', this.readonly ? {} : {
      attrs: {
        tabindex: 0,
        contenteditable: false
      }
    })
  }
}
