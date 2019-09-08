import Bold from './items/bold'
import Italic from './items/italic'
import Link from './items/link'
import Code from './items/code'
import Hilight from './items/hilight'
import Strikethrough from './items/strikethrough'
import Blockquote from './items/blockquote'
import Unorderlist from './items/unorderlist'
import Orderlist from './items/orderlist'
import Todolist from './items/todolist'
import Heading1 from './items/heading1'
import Heading2 from './items/heading2'
import Delete from './items/delete'
import Image from './items/image'
import Video from './items/video'
import Divider from './items/divider'
import Blockcode from './items/blockcode'
import Table from './items/table'
import Attach from './items/attach'

const toolMap = {
  'bold': Bold,
  'italic': Italic,
  'link': Link,
  'code': Code,
  'hilight': Hilight,
  'strikethrough': Strikethrough,
  'blockquote': Blockquote,
  'orderlist': Orderlist,
  'unorderlist': Unorderlist,
  'todolist': Todolist,
  'heading1': Heading1,
  'heading2': Heading2,
  'delete': Delete,
  'hr': 'hr',
  'image': Image,
  'video': Video,
  'divider': Divider,
  'blockcode': Blockcode,
  'table': Table,
  'attach': Attach
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
  blockcode: ['bold', 'italic', 'strikethrough', 'link', 'hilight', 'hr', 'heading1', 'heading2', 'blockquote', 'unorderlist'],
  // imagetext: ['bold', 'italic', 'strikethrough', 'link', 'hilight'],
  image: ['image', 'hr', 'delete'],
  divider: ['delete'],
  video: ['video', 'hr', 'delete'],
  table: ['delete'],
  attach: ['delete']
}

export default { toolMap, toolItems }
