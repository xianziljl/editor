import blockMixin from '../block-mixin'
export default {
  name: 'editor-block-divider',
  mixins: [blockMixin],
  data () {
    return {
      isSelected: false
    }
  },
  watch: {
    '$editor.selection.blocks' (blocks) {
      this.isSelected = (blocks && blocks.includes(this.value))
    }
  },
  render (h) {
    return h('hr', this.readonly ? {} : {
      class: this.isSelected ? 'editor-block-selected' : '',
      attrs: { tabindex: 0 }
    })
  }
}
