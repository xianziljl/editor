export default {
  name: 'editor-progressbar',
  props: {
    percent: 0
  },
  render (h) {
    const progress = h('div', {
      class: 'editor-progress',
      style: { width: this.percent * 100 + '%' }
    })
    return h('div', { class: 'editor-progressbar' }, [progress])
  }
}
