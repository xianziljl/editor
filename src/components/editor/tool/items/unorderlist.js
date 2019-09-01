import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-unorderlist',
  mixins: [toolItemMixin],
  watch: {
    '$editor.selection.blockStyle' (val) {
      this.isActive = val === 'unorderlist'
    }
  },
  methods: {
    onClick () {
      this.$editor.toggleBlockStyle('unorderlist')
      this.$editor.isOperating = false
    }
  }
}
