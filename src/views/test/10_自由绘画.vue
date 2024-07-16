<script setup>
import { onMounted, onBeforeUnmount, ref, watch } from 'vue';
import { fabric } from 'fabric';

const isDrawing = ref(true);

const lineWidth = ref(5);

const color = ref('#000000');

const lineWidthChange = (val) => {
  lineWidth.value = val;
  canvas.freeDrawingBrush.width = val;
}

watch(isDrawing, (newVal, oldVal) => {
  canvas.isDrawingMode = newVal;
})
watch(color, (newVal, oldVal) => {
  canvas.freeDrawingBrush.color = newVal;
})
let canvas = null;
onMounted(() => {
  if (!canvas) {
    canvas = new fabric.Canvas('canvas');
    canvas.isDrawingMode = true;
  }

  console.log('渲染完毕')
})

onBeforeUnmount(() => {
  console.log('卸载完毕')
  canvas.getObjects().forEach(function(obj) {
    canvas.remove(obj);
  });

  // 2. 清空画布
  canvas.clear();

  // 3. 移除事件监听器（如有必要）
  canvas.off();
  // 4. 从 DOM 中移除 Canvas 元素（如果需要）
  const canvasElement = document.querySelector('.canvas-container');
  const parentNode = canvasElement.parentNode;
  const lastNode = document.createElement('canvas');
  lastNode.id = 'canvas';
  lastNode.width = 500;
  lastNode.height = 500;
  if (canvasElement) {
    parentNode.removeChild(canvasElement);
    // console.log(parentNode)
    parentNode.appendChild(lastNode);
  }

  canvas = null;
})
</script>

<template>
  <div class="main">
    <canvas id="canvas" width="500" height="600"></canvas>
    <div>
      自由绘画开启：<el-switch v-model="isDrawing"></el-switch>
      线宽:  <el-input-number v-model="lineWidth"  @change="lineWidthChange" />
      颜色： <el-color-picker v-model="color"></el-color-picker>
    </div>
  </div>
</template>

<style lang="scss">
  #canvas {
    border: 1px solid greenyellow;
  }
</style>
<style lang="scss" scoped>
.main {
  display: flex;
}
</style>
