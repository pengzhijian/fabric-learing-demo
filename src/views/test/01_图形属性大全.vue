<script setup>
// 学习文档地址：http://fabricjs.com/fabric-intro-part-1
import { ref, reactive, onMounted, onBeforeUnmount } from 'vue';
import { fabric } from 'fabric';
let canvas = null;
let nowSelectObj = ref();
let propertiesArr = ref([]);
const dialogVisible = ref(false);
const checkItem = ref();

function propertieClick(item) {
  checkItem.value = item;
  dialogVisible.value = true;
}

// 获取所有对象的属性
function getAllProperties(obj) {

  const tmpArr = []
  for (let key in obj) {
    // 类的内部方法就不展示了
    if (key[0] !== '_') {
      tmpArr.push({
        type: typeof obj[key],
        value: obj[key],
        key: key
      })
    }
  }

  // 把object类型全放在最后面，因为都没啥用
  const objArr = tmpArr.filter(item => item.type === 'object' || item.type === 'function')
  const notObjArr = tmpArr.filter(item => item.type!== 'object' && item.type !== 'function')
  propertiesArr.value = notObjArr.concat(objArr)
}

function updateCanvas(e, item) {
  console.log('更新对象:', e, nowSelectObj.value)
  nowSelectObj.value.set(item.key, e)
  canvas.renderAll();
}

// 初始化 fabric.js 画布
function initCanvas() {
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
  console.log('rect', rect)
  // 创建一个圆形
  let circle = new fabric.Circle({
    left: 200,
    top: 200,
    radius: 50,
    fill: 'blue',
    stroke: 'green',
    strokeWidth: 3
  });
  // 创建一个椭圆
  let ellipse = new fabric.Ellipse({
    left: 300,
    top: 300,
    rx: 100,
    ry: 50,
    fill: 'yellow',
    stroke: 'purple',
    strokeWidth: 5
  });
  // 创建一个线
  let line = new fabric.Line([300, 50, 400, 100], {
    stroke: 'orange',
    strokeWidth: 2,
    fill: 'none'
  });
  // 创建一个多边形
  let polygon = new fabric.Polygon([
    { x: 0, y: 500 },
    { x: 100, y: 400 },
    { x: 200, y: 500 }
  ], {
    fill: 'pink',
    stroke: 'brown',
    strokeWidth: 3
  });
  const imgUrl = new URL('../../assets/imgs/cute.png', import.meta.url);
  console.log('imgUrl', imgUrl)
  const imgElement = new Image(600, 600);
  imgElement.src = imgUrl;
  imgElement.onload = () => {
    canvas.renderAll();
  }
  let img = new fabric.Image(imgElement, {
    left: 300,
    top: 400,
    angle: 0,
    scaleX: 0.3,
    scaleY: 0.3,
    angle: 0,
  });
  // 创建一个文本
  let text = new fabric.Text('Hello Fabric.js', {
    left: 100,
    top: 300,
    fontFamily: 'Arial',
    fontSize: 30,
    fill: 'black'
  });
  // 将所有图形添加到 canvas 中
  canvas.add(rect, circle, ellipse, line, polygon, img, text);
  canvas.renderAll();
  console.log('渲染完毕')

  // 监听对象被选中的事件
  canvas.getObjects().forEach((obj) => {
    obj.on('selected', function(e) {
      console.log('对象被选中:', e, obj);
      nowSelectObj.value = obj;
      getAllProperties(nowSelectObj.value)
    })
    obj.on('mouseup', function(e) {
      console.log('对象状态修改结束')
      nowSelectObj.value = obj;
      getAllProperties(nowSelectObj.value)
    })
  })
}

onMounted(() => {
  initCanvas();
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
  // lastNode.height = 600;
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
    <div class="properties-boxs">
      <template v-for="item in propertiesArr" >
        <span class="properties-box" size="large" @click="propertieClick(item)">{{ item.key + ':' + item.value }}</span>
      </template>
    </div>
  </div>
  <el-dialog
    v-model="dialogVisible"
    title="修改属性"
    width="500"
  >
    <el-input-number v-if="checkItem.type === 'number'" v-model="checkItem.value" @change="updateCanvas($event, checkItem)"></el-input-number>
    <el-select v-else-if="checkItem.type === 'boolean'" v-model="checkItem.value" @change="updateCanvas($event, checkItem)">
      <el-option label="false" :value="false"></el-option>
      <el-option label="true" :value="true"></el-option>
    </el-select>
    <el-input v-else="checkItem.type === 'string'" v-model="checkItem.value" @change="updateCanvas($event, checkItem)"></el-input>
  </el-dialog>
</template>

<style lang="scss">
  #canvas {
    border: 1px solid greenyellow;
  }
  .main {
    display: flex;
    .properties-boxs {
      display: flex;
      flex-wrap: wrap;
      height: 600px;
      margin-left: 20px;
      width: calc(100% - 520px);
      overflow: auto;
      background-color: antiquewhite;
      .properties-box {
        background-color: antiquewhite;
        border: 1px solid black;
        padding: 10px;
        margin: 5px;
        font-size: 15px;
        border-radius: 3px;
        cursor: pointer;
      }
    }
  }
</style>
<style lang="scss" scoped>

</style>
