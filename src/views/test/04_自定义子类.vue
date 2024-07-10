<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';

let canvas = null;

/* 
  绘制地图表格横竖线
*/
function initMap(options, ctx) {
  const { gridNumX, gridNumY, width, height, fill, left, top } = options;
  ctx.save();
  ctx.translate(-width / 2, -height / 2)
  // 开始路径并绘制线条
  ctx.beginPath();
  // 设置线条样式
  ctx.lineWidth = 1;
  ctx.strokeStyle = fill;
  // 开始绘制横线
  for (let i = 0; i < gridNumY + 1; i++) {
    // 注意要算线的宽度，也就是后面那个+i
    ctx.moveTo(0, height / gridNumY * i);
    ctx.lineTo(width, height / gridNumY * i);
    ctx.stroke();
  }
  // 开始绘制竖线
  for (let i = 0; i < gridNumX + 1; i++) {
    ctx.moveTo(width / gridNumX * i, 0);
    ctx.lineTo(width / gridNumX * i, height);
    ctx.stroke();
  }
  ctx.restore();
}

onMounted(() => {
  if (!canvas) {
    canvas = new fabric.Canvas('canvas');
  }
  // 创建一个自定义子类
  const Map = fabric.util.createClass(fabric.Object, {
    type: "Map",
    initialize: function (options) {
      options || (options = {});
      this.callSuper("initialize", options);
      this.set("gridNumX", options.gridNumX || "");
      this.set("gridNumY", options.gridNumY || "");
    },

    toObject: function () {
      return fabric.util.object.extend(this.callSuper("toObject"), {
        gridNumX: this.get("gridNumX"),
        gridNumY: this.get("gridNumY"),
      });
    },

    _render: function (ctx) {
      this.callSuper("_render", ctx);
      initMap({
        ...this
      }, ctx)
    },
  });

  const map = new Map({
    left: 100,
    top: 100,
    label: "test",
    fill: "#faa",
    width: 100,
    height: 100,
    gridNumX: 4,
    gridNumY: 3
  });

  const map2 = new Map({
    left: 300,
    top: 100,
    label: "test",
    fill: "green",
    width: 200,
    height: 300,
    gridNumX: 2,
    gridNumY: 5
  });
  // 将所有图形添加到 canvas 中
  canvas.add(map, map2);
  console.log('渲染完毕')
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
