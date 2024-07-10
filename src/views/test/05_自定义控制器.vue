<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';

let canvas = null;
onMounted(() => {
  if (!canvas) {
    canvas = new fabric.Canvas('canvas');
  }
  // 创建一个矩形
  let rect = new fabric.Rect({
    left: 50,
    top: 50,
    fill: 'red',
    width: 100,
    height: 100,
    angle: 45
  });

  // 创建一个圆形
  let circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 50,
    fill: 'blue',
    stroke: 'green',
    strokeWidth: 3
  });

  // 克隆默认的controls
  circle.controls = fabric.util.object.clone(fabric.Rect.prototype.controls);
  // 为了不所有对象全部修改，同样需要对其tl控制点进行克隆
  circle.controls.tl = fabric.util.object.clone(fabric.Object.prototype.controls.tl);
  // 将左上角控制点样式修改为一个实心小圆点 
  circle.controls.tl.render = function (ctx, left, top, styleOverride, fabricObject) {
    ctx.save();
    ctx.fillStyle = 'rgb(78, 172, 189)';
    ctx.beginPath();
    ctx.arc(left, top, 8, 0, Math.PI * 2, true);
    ctx.fill();
    ctx.restore();
  }

  circle.controls.tl.actionHandler = function (eventData, transform, x, y) {
    console.log('自定义控制点的行为', eventData, transform, x, y);
    // 自定义控制点的行为
    // 这里可以做一些自定义的操作，比如修改圆的颜色
    transform.target.set('fill', `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`);
    canvas.renderAll();
  }

  // 创建一个控件
  const deleteControl = new fabric.Control({
    // 相对于中心点的偏移量，1指偏移一整个width
    x: 0.7,
    y: -0.7,
    sizeX: 30, // 控件的宽度
    sizeY: 30,
    cursorStyle: 'pointer',
    // 鼠标按下事件
    mouseDownHandler: (eventData, transform, x, y) => {
      if (confirm('确定删除？')) {
        canvas.remove(transform.target);
      }
      canvas.renderAll();
    },
    // 控件名字
    actionName: 'delete',
    // 自定义渲染
    render: function (ctx, left, top, styleOverride, fabricObject) {
      ctx.save();
      ctx.translate(left, top);
      ctx.fillStyle = 'red';
      ctx.font = '20px Arial';
      ctx.fillText('X', -10, 10); // 确保文字在控件的中心
      ctx.restore();
    }
  });

  // 将控件添加到圆的controls对象中
  circle.controls.delete = deleteControl

  // 将所有图形添加到 canvas 中
  canvas.add(rect, circle);
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
  // // 4. 从 DOM 中移除 Canvas 元素（如果需要）
  // const canvasElement = document.querySelector('.canvas-container');
  // const parentNode = canvasElement.parentNode;
  // const lastNode = document.createElement('canvas');
  // lastNode.id = 'canvas';
  // lastNode.width = 500;
  // lastNode.height = 500;
  // if (canvasElement) {
  //   parentNode.removeChild(canvasElement);
  //   // console.log(parentNode)
  //   parentNode.appendChild(lastNode);
  // }

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
