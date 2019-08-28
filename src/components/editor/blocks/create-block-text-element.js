import TextEditor from '../text/text-editor'
import textRender from '../text/text-render'
import getComponetByKey from '../utils/getComponentByKey'
// import TextView from '../text/text-view'
// import merge from 'deepmerge' // merge 会导致数据失去响应

// const blockTextTypes = new Set(['heading', 'paragraph', 'blockquote'])

function createTextEditorElement (h, context, tagName, value, options) {
  if (context.readonly) {
    return h(tagName, {
      class: 'editor-block'
    }, textRender(h, context, value.text || '', value.ranges || []))
  }
  return h(TextEditor, {
    class: 'editor-block',
    props: { tagName, value },
    on: Object.assign({}, context.$listeners, {
      'insert-before': e => {
        const { blocks } = context.editor.value
        context.$set(e, 'type', 'paragraph')
        context.editor.insertBeforeBlock(blocks, value, e)
      },
      'insert-after': e => {
        const { blocks } = context.editor.value
        context.$set(e, 'type', 'paragraph')
        context.editor.insertAfterBlock(blocks, value, e)
      },
      'clear-block-style': val => {
        val.type = 'paragraph'
        context.$nextTick(() => {
          const { target, range } = context.editor.selection
          context.editor.setRange(target, range.offset, range.length)
        })
      },
      'merge-to-prev': val => {
        const { blocks } = context.editor.value
        const prevValue = blocks[blocks.indexOf(val) - 1]
        if (!prevValue) return
        const prevComponent = getComponetByKey(context.editor, prevValue.key)
        // console.log(prevComponent)
        prevComponent && prevComponent.mergeNext && prevComponent.mergeNext()
      }
    })
  })
}

export default createTextEditorElement
