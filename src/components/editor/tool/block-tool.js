export default {
  name: 'editor-tool-block',
  inject: ['$editor'],
  render (h) {
    return h('div', {
      class: [
        'editor-tool-block',
        'editor-tool-block-show'
      ]
    })
  }
}
