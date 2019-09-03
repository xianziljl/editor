import blockMixin from '../block-mixin'
export default {
  name: 'editor-block-divider',
  mixins: [blockMixin],
  computed: {
    isSelected () {
      const { blocks } = this.$editor.selection
      return (blocks && blocks.includes(this.value))
    }
  },
  render (h) {
    return h('hr', this.readonly ? {} : {
      class: this.isSelected ? 'editor-block-selected' : '',
      attrs: {
        tabindex: 0,
        contenteditable: false
      }
    })
  }
}
