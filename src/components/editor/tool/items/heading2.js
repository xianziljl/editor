import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-heading-2',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (val) {
      this.isActive = val && val === 'heading2'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockStyle('heading', { level: 2 })
      this.$editor.isOperating = false
    }
  }
}
