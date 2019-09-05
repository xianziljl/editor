import blockMixin from '../block-mixin'
export default {
  name: 'editor-block-table',
  mixins: [blockMixin],
  data () {
    return {
      isSelected: false,
      selection: {
        rows: null, // [indexs]
        cols: null // [indexs]
      },
      hover: {
        row: null,
        col: null
      }
    }
  },
  watch: {
    '$editor.selection.blocks' (blocks) {
      this.isSelected = (blocks && blocks.includes(this.value))
    }
  },
  render (h) {
    const { value, readonly } = this

    const rows = (value.rows || []).map((row, i) => {
      const cols = row.map((text, j) => {
        let textarea = null
        let addRowBtn = null
        let addColBtn = null
        if (!readonly) {
          textarea = h('textarea', {
            attrs: { rows: '1' },
            on: {
              input: e => { this.onInput(i, j, e) },
              keydown: this.onKeydown
            }
          }, [text])
          if (i === 0) {
            addColBtn = h('button', {
              class: 'editor-table-addbtn editor-table-addbtn-col',
              on: {
                mouseenter: e => { this.hover.col = j },
                mouseleave: e => { this.hover.col = null }
              }
            })
          }
          if (j === 0) {
            addRowBtn = h('button', {
              class: 'editor-table-addbtn',
              on: {
                mouseenter: e => { this.hover.row = i },
                mouseleave: e => { this.hover.row = null }
              }
            })
          }
        }

        return h('td', {
          class: this.hover.col === j ? 'editor-table-col-hover' : ''
        }, [h('div', { class: 'td' }, [text, addRowBtn, addColBtn, textarea])])
      })
      return h('tr', {
        class: this.hover.row === i ? 'editor-table-row-hover' : ''
      }, cols)
    })

    const table = h('table', rows)

    const container = h('div', { class: 'editor-block-table-container' }, [table])

    return h('div', {
      // class: this.isSelected ? 'editor-block-selected' : '',
      attrs: { contenteditable: false }
    }, [container])
  },
  methods: {
    onInput (i, j, e) {
      const row = this.value.rows[i]
      this.$set(row, j, e.target.value)
    },
    onKeydown (e) {
      e.stopPropagation()
      // console.log(e)
    }
  }
}
