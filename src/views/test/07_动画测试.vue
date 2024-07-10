<script setup>
import { onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';

let canvas = null;
let rect = null;

function animate(type) {
  if (type === 'angle') {
    // 旋转
    rect.animate('angle',' +=360', {
      onChange: canvas.renderAll.bind(canvas),
      duration: 2000, // 持续时间
      easing: fabric.util.ease.easeOutBounce // 动画效果 easeInCubic, easeOutCubic, easeInElastic, easeOutElastic, easeInBounce, easeOutExpo
    });
  }
  if (type === 'left') {
    // 旋转
    rect.animate('left',' +=300', {
      onChange: canvas.renderAll.bind(canvas),
      duration: 2000, // 持续时间
      easing: fabric.util.ease.easeInCubic // 动画效果 easeInCubic, easeOutCubic, easeInElastic, easeOutElastic, easeInBounce, easeOutExpo
    });
  }
}

// Fabric.runningAnimations.findAnimation(signature) - 返回与签名匹配的动画上下文，该签名是由fabric.util.animate返回的中止函数
// Fabric.runningAnimations.findAnimationIndex(signature) - 与 findAnimation 相同，返回索引。
// Fabric.runningAnimations.findAnimationsByTarget(target) - 返回具有等于 target 的 target 属性的所有动画。
// Fabric.runningAnimations.cancelAll() - 取消所有正在运行的动画。
// Fabric.runningAnimations.cancelByTarget(target) - 取消具有等于 target 的 target 属性的动画。
// object.dispose() - 取消由对象 (object.animate(...)) 创建的所有动画。如果您想使用 Fabric.util.animate 而不是 object.animate(...) 添加动画，您可以通过传递 target 属性将它们附加到对象。这样，一旦对象被处理，动画就会取消。
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

  // 将所有图形添加到 canvas 中
  canvas.add(rect);
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
      <el-button @click="animate('angle')" type="primary">开始旋转动画</el-button>
      <el-button @click="animate('left')" type="primary">开始平移动画</el-button>
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
