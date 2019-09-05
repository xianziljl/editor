import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-table',
  mixins: [toolItemMixin],
  methods: {
    onClick () {
      this.$editor.toggleBlockType('table')
      this.$editor.isOperating = false
    }
  }
}
