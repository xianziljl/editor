import Bold from './items/bold'
import Italic from './items/italic'
import Link from './items/link'
import Code from './items/code'
import Hilight from './items/hilight'
import Strikethrough from './items/strikethrough'
import Blockquote from './items/blockquote'
import Unorderlist from './items/unorderlist'
import Heading1 from './items/heading1'
import Heading2 from './items/heading2'
import Delete from './items/delete'

const toolMap = {
  'bold': Bold,
  'italic': Italic,
  'link': Link,
  'code': Code,
  'hilight': Hilight,
  'strikethrough': Strikethrough,
  'blockquote': Blockquote,
  'unorderlist': Unorderlist,
  'heading1': Heading1,
  'heading2': Heading2,
  'delete': Delete,
  'hr': 'hr'
}

const common = ['bold', 'italic', 'strikethrough', 'link', 'code', 'hilight', 'hr', 'heading1', 'heading2', 'blockquote', 'unorderlist']
const toolItems = {
  paragraph: common,
  heading1: common,
  heading2: common,
  heading3: common,
  heading4: common,
  blockquote: common,
  orderlist: common,
  unorderlist: common,
  todolist: common,
  blockcode: ['bolc', 'italic', 'strikethrough', 'link', 'hilight', 'hr', 'heading1', 'heading2', 'blockquote', 'unorderlist'],
  imagetext: ['bolc', 'italic', 'strikethrough', 'link', 'hilight'],
  image: ['bold'],
  divider: ['bold']
}

export default { toolMap, toolItems }
