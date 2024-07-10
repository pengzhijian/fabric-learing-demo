<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';

let canvas = null;
let rect = null;
let rectLevel = ref(0);

// 改变方块的图层
function changeRectLevel(index) {
  rect.moveTo(index);
  // 正常的获取图层的方法
  // rectLevel.value = canvas.getObjects().indexOf(rect);
  // 使用getLevel方法获取图层
  // rectLevel.value = rect.getLevel();

  // 使用level属性获取图层（必须延迟）
  setTimeout(() => {
    rectLevel.value = rect.level;
  }, 200);
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
  // 创建一个圆形
  let circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 50,
    fill: 'blue',
    stroke: 'green',
    strokeWidth: 3
  });
  // 创建一个三角形
  let triangle = new fabric.Triangle({
    left: 350,
    top: 350,
    width: 100,
    height: 100,
    fill: 'yellow',
    angle: 30,
    originX: 'center',
    originY: 'center'
  });

  // 新增 level 方法
  fabric.Object.prototype.getLevel = function() {
    return this.canvas.getObjects().indexOf(this);
  }

  // 新增 level 属性
  fabric.Object.prototype.level = 0


  // Canvas 类新增 setAllLevel 方法 （经过查找发现 getObjects 在父类的父类中所以是.__proto__.__proto__）
  canvas.__proto__.__proto__.setAllLevel = function() {
    this.getObjects().forEach((obj, index) => {
      obj.level = index;
    })
  }

  // Canvas 类 重写renderAll方法
  canvas.__proto__.renderAll = function () {
    console.log('renderAll')
    !this.contextTopDirty ||
      this._groupSelector ||
      this.isDrawingMode ||
      (this.clearContext(this.contextTop), (this.contextTopDirty = !1)),
      this.hasLostContext && this.renderTopLayer(this.contextTop);
    var t = this.contextContainer;
    // 偷个懒，直接用 setTimeout 0 延迟执行
    setTimeout(() => {
      this.setAllLevel();
    })
    return this.renderCanvas(t, this._chooseObjectsToRender()), this;
  }

  // 将所有图形添加到 canvas 中
  canvas.add(rect, circle, triangle);
  rectLevel.value = canvas.getObjects().indexOf(rect);
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
      <el-button type="primary" @click="changeRectLevel(rectLevel+1)">上移方块图层</el-button>
      
      <el-button type="primary" @click="changeRectLevel(rectLevel-1)">下移方块图层</el-button>

      <span>当前方块图层：{{ rectLevel }}</span>
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
