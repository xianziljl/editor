
export default {
  name: 'editor-tool-add',
  inject: ['$editor'],
  data () {
    return {
      isShow: false
    }
  },
  render (h) {
    return h('div', {
      class: ['editor-tool-add']
    })
  }
}
