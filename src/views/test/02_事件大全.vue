<script setup>
// 在console里面看
import { onMounted, onBeforeUnmount, ref } from 'vue';
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

  // 监听对象被选中的事件
  rect.on('selected', function () {
    console.log('Object事件：对象被选中');
  });

  // 监听对象取消选中的事件
  rect.on('deselected', function () {
    console.log('Object事件：对象取消选中');
  });

  // 监听对象被修改的事件
  rect.on('modified', function () {
    console.log('Object事件：对象已修改');
  });

  // 监听对象移动的事件
  rect.on('moving', function () {
    console.log('Object事件：对象正在移动');
  });

  // 监听对象缩放的事件
  rect.on('scaling', function () {
    console.log('Object事件：对象正在缩放');
  });

  // 监听对象旋转的事件
  rect.on('rotating', function () {
    console.log('Object事件：对象正在旋转');
  });

  // 监听鼠标按下事件
  rect.on('mousedown', function () {
    console.log('Object事件：鼠标按下');
  });

  // 监听鼠标释放事件
  rect.on('mouseup', function () {
    console.log('Object事件：鼠标释放');
  });

  // 监听鼠标移到对象上事件
  rect.on('mouseover', function () {
    console.log('Object事件：鼠标移到对象上');
  });

  // 监听鼠标移出对象事件
  rect.on('mouseout', function () {
    console.log('Object事件：鼠标移出对象');
  });

  // 监听双击事件
  rect.on('mousedblclick', function () {
    console.log('Object事件：对象双击');
  });

  // 监听 Canvas 事件
  canvas.on('object:selected', function (e) {
    console.log('Canvas事件：对象被选中:', e.target);
  });

  canvas.on('selection:created', function (e) {
    console.log('Canvas事件：选中创建:', e.target);
  });

  canvas.on('selection:updated', function (e) {
    console.log('Canvas事件：选中更新:', e.target);
  });

  canvas.on('selection:cleared', function () {
    console.log('Canvas事件：选中清除');
  });

  canvas.on('object:moving', function (e) {
    console.log('Canvas事件：对象正在移动:', e.target);
  });

  canvas.on('object:scaling', function (e) {
    console.log('Canvas事件：对象正在缩放:', e.target);
  });

  canvas.on('object:rotating', function (e) {
    console.log('Canvas事件：对象正在旋转:', e.target);
  });

  canvas.on('object:modified', function (e) {
    console.log('Canvas事件：对象已修改:', e.target);
  });

  canvas.on('mouse:down', function (e) {
    console.log('Canvas事件：鼠标按下:', e.pointer);
  });

  canvas.on('mouse:up', function (e) {
    console.log('Canvas事件：鼠标抬起:', e.pointer);
  });

  canvas.on('mouse:move', function (e) {
    // console.log('Canvas事件：鼠标移动:', e.pointer);
  });

  canvas.on('mouse:over', function (e) {
    console.log('Canvas事件：鼠标移到对象上:', e.target);
  });

  canvas.on('mouse:out', function (e) {
    console.log('Canvas事件：鼠标移出对象:', e.target);
  });

  canvas.on('mouse:dblclick', function (e) {
    console.log('Canvas事件：对象双击:', e.target);
  });

  // 将所有图形添加到 canvas 中
  canvas.add(rect);
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
    <div> 自己看console打印的事件！</div>
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
