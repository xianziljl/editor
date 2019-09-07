import blockMixin from '../block-mixin'
import createGUID from '../../utils/createGUID'
export default {
  name: 'editor-block-table',
  mixins: [blockMixin],
  data () {
    return {
      isSelected: false,
      isFocus: false,
      selection: {
        rows: [], // [indexs]
        cols: [] // [indexs]
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
    const { selection } = this

    const rows = (value.rows || []).map((row, i) => {
      const cols = row.map((text, j) => {
        let textarea = null
        let addRowBtn = null
        let addColBtn = null
        let selRowHandler = null
        let selColHandler = null
        if (!readonly) {
          textarea = h('textarea', {
            attrs: { rows: '1' },
            on: {
              input: e => { this.onInput(i, j, e) },
              focus: this.onTextareaFocus
            },
            key: value.key
          }, [text])
          if (i === 0) {
            addColBtn = h('button', {
              class: 'editor-table-addbtn editor-table-addbtn-col',
              attrs: { 'data-col': j },
              on: {
                mouseenter: e => { this.hover.col = j },
                mouseleave: e => { this.hover.col = null },
                click: this.onAddBtnClick
              }
            })
            selColHandler = h('button', {
              class: 'editor-table-selcolbtn',
              attrs: { 'data-col': j },
              on: { click: this.onSelBtnClick }
            })
          }
          if (j === 0) {
            addRowBtn = h('button', {
              class: 'editor-table-addbtn',
              attrs: { 'data-row': i },
              on: {
                mouseenter: e => { this.hover.row = i },
                mouseleave: e => { this.hover.row = null },
                click: this.onAddBtnClick
              }
            })
            selRowHandler = h('button', {
              class: 'editor-table-selrowbtn',
              attrs: { 'data-row': i },
              on: { click: this.onSelBtnClick }
            })
          }
        }

        return h('td', {
          class: {
            'editor-table-col-hover': this.hover.col === j,
            'editor-table-td-selected': selection.rows.includes(i) || selection.cols.includes(j)
          }
        }, [
          h('div', { class: 'td' }, [text, textarea]), selRowHandler, addRowBtn, selColHandler, addColBtn
        ])
      })
      return h('tr', {
        class: { 'editor-table-row-hover': this.hover.row === i }
      }, cols)
    })

    let addRowBtn1, addColBtn1
    if (!readonly) {
      addRowBtn1 = h('div', {
        class: 'editor-block-table-addrowbtn',
        attrs: { 'data-row': value.rows.length },
        on: { click: this.onAddBtnClick }
      })
      addColBtn1 = h('div', {
        class: 'editor-block-table-addcolbtn',
        attrs: { 'data-col': value.rows[0].length },
        on: { click: this.onAddBtnClick }
      })
    }

    const table = h('table', rows)

    const container = h('div', { class: 'editor-block-table-container' }, [table, addRowBtn1, addColBtn1])

    return h('div', {
      class: {
        'editor-block-selected': this.isSelected,
        'editor-block-table-focused': this.isFocus
      },
      on: {
        keydown: this.onKeydown,
        mousedown: this.$editor.clearSelection
      },
      attrs: { contenteditable: false, tabindex: 1 }
    }, [container])
  },
  mounted () {
    document.addEventListener('mousedown', this.onDoucumentMousedown)
    this.$once('hook:beforeDestroy', () => {
      document.removeEventListener('mousedown', this.onDoucumentMousedown)
    })
  },
  methods: {
    onInput (i, j, e) {
      e.stopPropagation()
      const row = this.value.rows[i]
      this.$set(row, j, e.target.value)
    },
    onKeydown (e) {
      console.log(e.keyCode)
      const ctrl = e.ctrlKey || e.metaKey
      if (e.keyCode === 90 && ctrl) e.stopPropagation()
      if (e.keyCode === 8) this.onKeyBackspace(e)
      if (e.keyCode === 13) {
        e.stopPropagation()
        e.preventDefault()
        this.onKeyEnter(e)
      }
    },
    onKeyEnter (e) {
      // console.log(e.target)
      if (e.target.tagName !== 'TEXTAREA') return
      const textareas = Array.from(this.$el.querySelectorAll('textarea'))
      const i = textareas.indexOf(e.target)
      if (i < textareas.length - 1) {
        (textareas[i + 1]).focus()
      } else {
        const index = this.$editor.value.blocks.indexOf(this.value)
        const newBlock = {
          type: 'paragraph',
          id: createGUID(),
          key: 0,
          text: '',
          ranges: []
        }
        this.$editor.addBlockAt(index + 1, newBlock)
        this.$editor.isOperating = false
        this.$editor.setSelection(newBlock, newBlock, 0, 0)
      }
    },
    onDoucumentMousedown (e) {
      if (this.readonly) return
      const path = e.path || (e.composedPath && e.composedPath())
      this.isFocus = path.includes(this.$el)
      if (this.isFocus) this.$editor.isOperating = true
      else this.selection = { rows: [], cols: [] }
    },
    onAddBtnClick (e) {
      const { row, col } = e.target.dataset
      // console.log(row, col)
      if (row !== undefined) this.addRow(~~row)
      if (col !== undefined) this.addCol(~~col)
      this.selection = { cols: [], rows: [] }
    },
    addRow (row) {
      const { rows } = this.value
      const newRow = new Array(rows[0].length)
      newRow.fill('')
      rows.splice(row, 0, newRow)
      this.value.key++
    },
    addCol (col) {
      const { rows } = this.value
      rows.forEach(row => {
        row.splice(col, 0, '')
      })
      this.value.key++
    },
    onSelBtnClick (e) {
      const { row, col } = e.target.dataset
      // console.log(row, col)
      if (row !== undefined) this.selRow(~~row)
      if (col !== undefined) this.selCol(~~col)
    },
    selRow (row) {
      // console.log(1)
      this.selection.cols = []
      this.selection.rows = [row]
    },
    selCol (col) {
      // console.log(2)
      this.selection.rows = []
      this.selection.cols = [col]
    },
    onTextareaFocus (e) {
      // console.log('textarea focus')
      this.selection = { cols: [], rows: [] }
    },
    onKeyBackspace (e) {
      // console.log(e)
      const { rows, cols } = this.selection
      if (!rows.length && !cols.length) return
      if (rows.length) {
        e.preventDefault()
        rows.forEach((r, i) => {
          this.value.rows.splice(r, 1)
        })
      }
      if (cols.length) {
        e.preventDefault()
        this.value.rows.forEach((row, i) => {
          row.forEach((r, j) => {
            if (cols.includes(j)) row.splice(j, 1)
          })
        })
      }
      this.selection = { rows: [], cols: [] }
      const vrows = this.value.rows
      this.value.key++
      if (!vrows.length || !vrows[0].length) {
        this.$editor.removeBlock(this.value)
      }
    }
  }
}
