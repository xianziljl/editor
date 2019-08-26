import Heading from './blocks/heading/heading'
import Paragraph from './blocks/paragraph/paragraph'
import Blockquote from './blocks/blockquote/blockquote'
import Divider from './blocks/divider/divider'
import Orderlist from './blocks/lists/orderlist'
import Unorderlist from './blocks/lists/unorderlist'
import Todolist from './blocks/lists/todolist'

const spanMap = {
  bold: 'strong',
  italic: 'em',
  link: 'a',
  underline: 'ins',
  strikethrough: 'del',
  hilight: 'mark',
  code: 'code'
}

const blockMap = {
  heading: Heading,
  paragraph: Paragraph,
  blockquote: Blockquote,
  divider: Divider,
  orderlist: Orderlist,
  unorderlist: Unorderlist,
  todolist: Todolist
}

export { spanMap, blockMap }
