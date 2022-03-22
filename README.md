# 基于 vue 和 json 数据格式的富文本编辑器。

[演示地址](https://xianziljl.github.io/editor/)


## Todo
- 选中文字鼠标未松开不弹出工具条
- ~~list 末尾回车如果此项是空则将此项改为普通段落，而非在后面插入新的段落~~
- ~~在非 list 开始位置回车，应在之前插入普通段落，而非相同格式段落~~
- ~~*性能优化（onSelectionchange触发频繁）*~~ 避免在 render 中使用频繁变化的数据
- 方向键导航功能
- 链接的提示（通用，也可用于其它需要提示的地方）
- block 工具条的实现
- block 的拖动排序
- image 组件（可拖动排序）
- video 组件
- audio 组件
- attach 组件
- table 组件
- chart 组件
- blockcode 组件
- 输入拦截器（markdown快捷输入)
- 历史记录功能
- 标题导航功能
