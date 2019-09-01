import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-heading-1',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (val) {
      this.isActive = val && val === 'heading1'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockStyle('heading', { level: 1 })
      this.$editor.isOperating = false
    }
  }
}
