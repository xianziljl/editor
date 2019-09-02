import toolItemMixin from './toolItemMixin'

export default {
  name: 'editor-tool-delete',
  mixins: [toolItemMixin],
  methods: {
    onClick (e) {
      console.log('toolclick: delete.')
    }
  }
}
