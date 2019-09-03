import Heading from './blocks/heading/heading'
import Paragraph from './blocks/paragraph/paragraph'
import Blockquote from './blocks/blockquote/blockquote'
import Divider from './blocks/divider/divider'
import Listitem from './blocks/lists/listitem'
import Todoitem from './blocks/lists/todoitem'
import Images from './blocks/image/images'
import Image from './blocks/image/image'
import Blockcode from './blocks/blockcode/blockcode'
import Video from './blocks/video/video'
// import Orderlist from './blocks/lists/orderlist'
// import Unorderlist from './blocks/lists/unorderlist'
// import Todolist from './blocks/lists/todolist'

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
  orderlist: Listitem,
  unorderlist: Listitem,
  todolist: Todoitem,
  images: Images,
  image: Image,
  blockcode: Blockcode,
  video: Video
}

const textBlockMap = {
  heading: Heading,
  paragraph: Paragraph,
  blockquote: Blockquote,
  orderlist: Listitem,
  unorderlist: Listitem,
  todolist: Todoitem,
  blockcode: Blockcode
}

const listTypes = {
  orderlist: 'ol',
  unorderlist: 'ul',
  todolist: 'ul',
  blockcode: 'code',
  image: 'div'
}

export { spanMap, blockMap, listTypes, textBlockMap }
