<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { fabric } from 'fabric';

let canvas = null;
const fileList = ref([]);
// 导入各种类型文件
function fileChange(file, fileList) {
  console.log(file)
  if (file.raw.type === 'image/svg+xml') {
    // 处理SVG文件
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.loadSVGFromString(e.target.result, (objects, options) => {
        const svgGroup = fabric.util.groupSVGElements(objects, options);
        console.log('svgGroup', svgGroup)
        canvas.add(svgGroup);
        canvas.renderAll();
        fileList.value = [];
      });
    };
    reader.readAsText(file.raw);
  } else if (file.raw.type.startsWith('image/')) {
    // 处理图片文件
    const reader = new FileReader();
    reader.onload = (e) => {
      fabric.Image.fromURL(e.target.result, (img) => {
        canvas.add(img);
        canvas.renderAll();
        fileList.value = [];
      });
    };
    reader.readAsDataURL(file.raw);
  } else if (file.raw.type === 'text/plain') {
    console.log('处理TXT文件', JSON.stringify(canvas))
    // 处理TXT文件
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target.result); // 可以在这里处理TXT文件内容
      canvas.loadFromJSON(e.target.result);
      fileList.value = [];
    };
    reader.readAsText(file.raw);
  }
}

// 导出图片
function exportImage() {
  const dataURL = canvas.toDataURL({
    format: 'png', // 图片格式
    quality: 1, // 图片质量
    multiplier: 2, // 图片放大倍数
    left: 0, // 裁剪区域左上角x坐标
    top: 0, // 裁剪区域左上角y坐标
    width: canvas.width, // 裁剪区域宽度
    height: canvas.height, // 裁剪区域高度
    cropX: 0, // 裁剪导出图片的起始 X 坐标
    cropY: 0, // 裁剪导出图片的起始 Y 坐标
    cropWidth: canvas.width, // 裁剪导出图片的裁剪宽度
    cropHeight: canvas.height // 裁剪导出图片的裁剪高度
  })

  // 创建下载链接
  let downloadLink = document.createElement('a');
  downloadLink.href = dataURL;
  downloadLink.download = 'canvas-image.jpg';
  downloadLink.click();
}

// 导出为svg图片
function exportSVGImg() {
  const svg = canvas.toSVG();
  const downloadLink = document.createElement('a');
  downloadLink.href = 'data:image/svg+xml;base64,' + btoa(svg);
  downloadLink.download = 'canvas-image.svg';
  downloadLink.click();
}

// 导出为序列化字符串
function exportText() {
  const text = JSON.stringify(canvas);
  const downloadLink = document.createElement('a');
  downloadLink.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text);
  downloadLink.download = 'canvas-image.txt';
  downloadLink.click();
}

onMounted(() => {
  if (!canvas) {
    canvas = new fabric.Canvas('canvas');
  }
  // 创建一个矩形对象
  let rect = new fabric.Rect({
    left: 100,
    top: 100,
    fill: "red",
    width: 100,
    height: 100,
  });

  // 创建一个圆形
  let circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 50,
    fill: "blue",
    stroke: "green",
    strokeWidth: 3,
  });

  // 创建一个三角形
  let triangle = new fabric.Triangle({
    left: 300,
    top: 300,
    width: 100,
    height: 100,
    fill: "yellow",
    stroke: "purple",
    strokeWidth: 5,
  });

  // 添加矩形到画布
  canvas.add(rect, circle, triangle);
  canvas.on("mouse:wheel", function (option) {
    // 判断是放大还是缩小
    const delta = option.e.deltaY;
    let zoom = canvas.getZoom();
    zoom *= 0.999 ** delta;
    if (zoom > 20) zoom = 20;
    if (zoom < 0.01) zoom = 0.01;
    // 在鼠标位置缩放
    canvas.zoomToPoint({ x: option.e.offsetX, y: option.e.offsetY }, zoom);
    option.e.preventDefault();
    option.e.stopPropagation();
  });

  // 当鼠标按下时
  canvas.on('mouse:down', function (option) {
    const evt = option.e;
    if (evt.altKey === true) {  // 检查是否按下alt键
      this.isDragging = true;
      this.selection = false;
      this.lastPosX = evt.clientX;
      this.lastPosY = evt.clientY;
    }
  });
  // 当鼠标按下时
  canvas.on('mouse:down', function (option) {
    const evt = option.e;
    // 用transformPoint创建一个小方块
    // 注意 transformPoint 作用是将一个坐标从一个坐标系转换到另一个坐标系
    // 由于这里的将按下的视口坐标转换成 canvas画布坐标系，所以需要用 invertTransform 反转变换
    this.add(new fabric.Rect({
      left: fabric.util.transformPoint({ x: evt.offsetX, y: evt.offsetY }, fabric.util.invertTransform(canvas.viewportTransform)).x,
      top: fabric.util.transformPoint({ x: evt.offsetX, y: evt.offsetY }, fabric.util.invertTransform(canvas.viewportTransform)).y,
      width: 50,
      height: 50,
      fill: 'red'
    }))
    // 用getPointer创建一个小方块
    const pointer = canvas.getPointer(evt);
    console.log('potint, ', pointer)
    this.add(new fabric.Rect({
      left: pointer.x,
      top: pointer.y,
      width: 50,
      height: 50,
      fill: 'blue'
    }))
    this.renderAll();
  });

  // 当鼠标移动时
  canvas.on('mouse:move', function (option) {
    if (this.isDragging) {
      const e = option.e;
      const vpt = this.viewportTransform;
      vpt[4] += e.clientX - this.lastPosX;
      vpt[5] += e.clientY - this.lastPosY;
      this.requestRenderAll();
      this.lastPosX = e.clientX;
      this.lastPosY = e.clientY;
    }
  });

  // 当鼠标松开时
  canvas.on('mouse:up', function (option) {
    // 在鼠标松开时重新计算所有对象的交互
    this.setViewportTransform(this.viewportTransform);
    this.isDragging = false;
    this.selection = true;
  });
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
    <div>
      滚轮滚动缩放，
      按下Ctrl键可拖动画布
      <el-button type="primary" @click="exportImage()">导出为图片</el-button>
      <el-button type="primary" @click="exportSVGImg()">导出svg图片</el-button>
      <el-button type="primary" @click="exportText()">导出为序列化字符串</el-button>
      <el-upload v-model:file-list="fileList" :limit="1" :on-change="fileChange" :auto-upload="false">
        <el-button type="primary">导入各种类型文件</el-button>
      </el-upload>
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
