<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';

let canvas = null;
onMounted(() => {
  if (!canvas) {
    canvas = new fabric.Canvas('canvas');
  }
  const circle = new fabric.Circle({
    radius: 100,
    fill: '#eef',
    scaleY: 0.5,
    originX: 'center',
    originY: 'center'
  });

  const text = new fabric.Text('hello world', {
    fontSize: 30,
    originX: 'center',
    originY: 'center'
  });

  const group = new fabric.Group([circle, text], {
    left: 150,
    top: 100,
    angle: -10
  });

  // 将所有图形添加到 canvas 中
  canvas.add(group);
  console.log('渲染完毕', group)
})

onBeforeUnmount(() => {
  console.log('卸载完毕')
  canvas.getObjects().forEach(function (obj) {
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
