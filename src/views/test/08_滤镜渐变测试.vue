<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';
let canvas = null;
let img = null;
let rect = null;
function addFilter(type) {
  img.filters = [];
  if (type === '灰度滤镜') {
    img.filters.push(new fabric.Image.filters.Grayscale());
  } else if (type === '棕色滤镜') {
    img.filters.push(new fabric.Image.filters.Sepia());
  } else if (type === '亮度滤镜') {
    img.filters.push(new fabric.Image.filters.Brightness({ brightness: 0.5 }));
  } else if (type === '还原') {
    img.filters = [];
  }

  // 应用滤镜
  img.applyFilters();
  canvas.renderAll();
}

function setGradients() {
  const gradient = new fabric.Gradient({
    type: 'linear',
    gradientUnits: 'pixels', // or 'percentage'
    coords: { x1: 0, y1: 0, x2: rect.width, y2: rect.height },
    colorStops:[
      { offset: 0, color: 'blue' },
      { offset: 1, color: 'yellow'}
    ]
  })

  rect.set('fill', gradient);
  canvas.renderAll();
}

onMounted(() => {
  if (!canvas) {
    canvas = new fabric.Canvas('canvas');
  }
  // 创建一个矩形
  rect = new fabric.Rect({
    left: 50,
    top: 50,
    fill: 'red',
    width: 100,
    height: 100,
  });
  const imgUrl = new URL('../../assets/imgs/cute.png', import.meta.url);
  console.log('imgUrl', imgUrl)
  const imgElement = new Image(600, 600);
  imgElement.src = imgUrl;
  imgElement.onload = () => {
    canvas.renderAll();
  }
  img = new fabric.Image(imgElement, {
    left: 200,
    top: 200,
    angle: 0,
    scaleX: 0.3,
    scaleY: 0.3,
    angle: 0,
  });
  // 将所有图形添加到 canvas 中
  canvas.add(rect, img);
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
      <el-button type="primary" @click="addFilter('灰度滤镜')">灰度滤镜</el-button>
      <el-button type="primary" @click="addFilter('棕色滤镜')">棕色滤镜</el-button>
      <el-button type="primary" @click="addFilter('亮度滤镜')">亮度滤镜</el-button>
      <el-button type="primary" @click="addFilter('还原')">还原</el-button>
      <el-button type="primary" @click="setGradients">方块设为渐变色</el-button>
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
