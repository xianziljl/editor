<template>
  <div id="app">
    <!-- <div class="toolbar">
      <span :class="{'on': rangeStyles.bold}" @click="exe('bold')">Bold</span>
      <span :class="{'on': rangeStyles.italic}" @click="exe('italic')">Italic</span>
      <span :class="{'on': rangeStyles.hilight}" @click="exe('hilight')">Hilight</span>
      <span :class="{'on': rangeStyles.strikethrough}" @click="exe('strikethrough')">Strikethrough</span>
      <span :class="{'on': rangeStyles.code}" @click="exe('code')">Code</span>
      <span :class="{'on': rangeStyles.link}" @click="exe('link', 'https://www.qq.com')">Link</span>
    </div>
    <text-editor
      ref="editor"
      :value="testValue"
      @selection="onSelection"></text-editor>
    <div id="native-render"></div>
    <div id="text-view"></div>
    <div v-if="range" style="margin-top: 20px;">
      <span style="margin-right: 20px;">offset: {{range.offset}}</span>
      <span>length: {{range.length}}</span>
    </div>
    <div style="margin-top: 20px;" v-else>null</div>
    <div>
      <span>styles: </span>
      <span v-for="(item, key) in rangeStyles" :key="key">{{key}}, </span>
    </div>
    <heading :value="testValue" readonly></heading> -->
    <!-- <input type="text"> -->
    <editor :readonly="readonly" :value="testValue"></editor>
    <button @click="readonly=!readonly">readonly: {{readonly}}</button>
    <i class="material-icons-outlined">pie_chart</i>
    <!-- <div>
      <img src="./assets/24px.svg" alt="">
    </div> -->
  </div>
</template>

<script>
import '@/components/editor/editor.scss'
import testValue from './components/editor/value'
import Editor from '@/components/editor/editor'

// const testValue = {
//   type: 'heading',
//   level: 1,
//   text: 'Finally, does this technique have an impact on performance? Well, in recent versions of v8 (and Node.js), the performance is almost the same. Using octance benchmark I did not find any difference in performance. I know that Google deprecated octance (because browsers and JS engines were cheating), but the results in our situation are significant, because we are comparing the same code on the same JS engine. So, the final answer is: Bytenode does NOT have a negative impact on performance.',
//   ranges: [
//     { offset: 307, length: 6, style: 'bold' },
//     { offset: 9, length: 10, style: 'link', href: 'https://www.google.com' },
//     { offset: 2, length: 4, style: 'strikethrough' },
//     { offset: 2, length: 5, style: 'hilight' },
//     { offset: 9, length: 2, style: 'hilight' },
//     { offset: 74, length: 14, style: 'hilight' },
//     { offset: 91, length: 9, style: 'code' }
//   ]
// }

export default {
  components: { Editor },
  data () {
    return {
      readonly: false,
      testValue,
      range: {},
      rangeStyles: {}
    }
  },
  methods: {
    exe (type, href) {
      this.$refs.editor.exe(type, href)
    },
    onSelection (range, rangeStyles) {
      this.range = range
      this.rangeStyles = rangeStyles
    }
  }
}
</script>

<style lang="scss">
  #app{margin: 60px auto;font-size: 16px;max-width: 700px;}
  .toolbar{
    user-select: none;
    margin-bottom: 10px;
    span{display: inline-block;padding: 3px 10px;cursor: pointer;}
    span.on{color: #03a87c;}
  }
  .text-editor{outline: none;}
  // .text_render-hilight{background: yellow;}
  // span{margin-right: 2px;background: #ffd68b;}
</style>
