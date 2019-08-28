import getComponentByKey from '../../utils/getComponentByKey'
import { mergeRanges } from '../../text/text-range'
import createGUID from '../../utils/createGUID'
import { mergeLists, filterLists } from './list-utils'

export default {
  inject: ['editor'],
  props: {
    readonly: Boolean,
    value: {
      type: Object,
      default: () => ({})
    }
  },
  provide () {
    return { list: this }
  },
  methods: {
    mergeNext () {
      // console.log(this)
      const { editor, value } = this
      const { blocks } = editor.value
      const listBlocks = value.blocks || []
      if (!blocks.length) {
        console.warn('List miss items, merge next failed.')
        return
      }
      const i = blocks.indexOf(value)
      const next = blocks[i + 1]
      if (!next || next.type !== 'paragraph') return
      blocks.splice(i + 1, 1)
      const lastItem = listBlocks[listBlocks.length - 1]
      // console.log(listBlocks)
      next.ranges.forEach(item => { item.offset += lastItem.text.length })
      lastItem.ranges = lastItem.ranges.concat(next.ranges)
      mergeRanges(lastItem.ranges)
      const oldLength = lastItem.text.length
      // console.log(oldLength)
      lastItem.text += next.text
      mergeLists(blocks)
      filterLists(blocks)
      this.$nextTick(() => {
        const lastItemComponent = getComponentByKey(this, lastItem.key)
        editor.setRange(lastItemComponent, oldLength, 0)
      })
    },
    /**
     * 将一个 list 拆分成两个
     * @param {Object} val list的一项，拆分后将变成普通段落或其他文字块
     * @param {string} splitType val 需要应有的 type
     */
    split (val, splitType) {
      const { blocks } = this.value
      if (!blocks || !blocks.length) {
        console.warn('List miss blocks, split failed.')
        return
      }
      const { range } = this.editor.selection // 记录分割之前的光标

      const i = blocks.indexOf(val)
      const list1 = this.value
      const list2 = {
        type: list1.type,
        key: createGUID(),
        blocks: list1.blocks.slice(i + 1)
      }
      list1.blocks = list1.blocks.slice(0, i)
      val.type = splitType || 'paragraph'

      // console.log('list1', list1)
      // console.log('list2', list2)

      const editorBlocks = this.editor.value.blocks
      const listIndex = editorBlocks.indexOf(list1)
      editorBlocks.splice(listIndex + 1, 0, val)
      editorBlocks.splice(listIndex + 2, 0, list2)
      // console.log('filter')
      filterLists(editorBlocks)
      this.$nextTick(() => {
        const target = getComponentByKey(this.editor, val.key)
        this.editor.setRange(target, range ? range.offset + range.length : val.text.length, 0)
      })
    }
  }
}
