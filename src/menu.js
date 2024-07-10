const modules = import.meta.glob("./views/test/*.vue")

const testArr = []

for (const path in modules) {
  if (path) {
    // encodeURI 解决中文路径问题
    testArr.push({
      url: encodeURI(path.replace('./views/test/', '').replace('.vue', '')),
      name: path.replace('./views/test/', '').replace('.vue', '')
    });
  }
}

export function testMenuList() {
  return testArr
}