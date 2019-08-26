import blockMixin from '../block-mixin'
import Todoitem from './todoitem'

export default {
  name: 'editor-block-todolist',
  inject: ['editor'],
  mixins: [blockMixin],
  render (h) {
    const items = this.value.blocks.map(item => {
      return h(Todoitem, {
        props: { value: item, readonly: this.readonly },
        key: item.key
      })
    })
    return h('ul', items)
  }
}
