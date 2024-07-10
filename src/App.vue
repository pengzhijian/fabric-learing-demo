<script setup>
import * as menu from './menu.js'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter();

let menuList = reactive([])
menuList = menu.testMenuList()

const itemClick = (item) => {
  router.push({path: `/${item}`});
}
</script>

<template>
  <div class="list-boxs">
    <div class="box" v-for="item in menuList" @click="itemClick(item.url)">
      {{item.name}}
    </div>
  </div>
  <div class="router-view-box">
    <div>内容展示：</div>
    <RouterView />
  </div>
</template>

<style scoped lang="scss">
.list-boxs {
  box-sizing: border-box;
  padding: 20px;
  display: flex;
  width: 100vw;
  overflow: auto;
	&::-webkit-scrollbar {
		width: 3px;
		height: 10px;
		cursor: pointer;
	}
	&::-webkit-scrollbar-track {
		background: #f1f1f1;
		cursor: pointer;
	}
	&::-webkit-scrollbar-thumb {
		cursor: pointer;
		background: #888;
	}
  .box {
    margin-right: 20px;
    box-shadow: 0 0 5px black;
    background-color: beige;
    padding: 5px;
    width: 130px;
    height: 50px;
    display: flex;
    flex: none;
    justify-content: center;
    align-items: center;
    &:hover {
      background-color: pink;
      cursor: pointer;
    }
    &:active {
      background-color: red;
    }
  }
}
.router-view-box {
  box-sizing: border-box;
  width: 100vw;
  padding: 20px;
  border: 1px solid peru;
  min-height: 500px;
}
</style>
