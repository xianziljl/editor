import toolItemMixin from './toolItemMixin'
export default {
  name: 'editor-tool-hilight',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.styles' (styles) {
      this.isActive = !!styles.hilight
    }
  },
  methods: {
    onClick (e) {
      this.$editor.exe('hilight')
      this.$editor.isOperating = false
    }
  }
}
