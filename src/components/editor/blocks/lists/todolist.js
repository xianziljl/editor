import listMixin from './list-mixin'
import Todoitem from './todoitem'

export default {
  name: 'editor-block-todolist',
  mixins: [listMixin],
  render (h) {
    const { value, readonly } = this
    const items = value.blocks.map(item => {
      if (item.checked === undefined) this.$set(item, 'checked', false)
      return h(Todoitem, {
        props: {
          readonly,
          value: item,
          checked: item.checked
        },
        key: item.key,
        on: Object.assign({}, this.$listeners, {})
      })
    })
    return h('ul', {
      class: 'editor-block-todolist'
    }, items)
  }
}
