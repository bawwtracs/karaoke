import Karaoke from './Karaoke'
// 为组件提供 install 安装方法，供按需引入
Karaoke.install = function(Vue) {
  Vue.component(Karaoke.name, Karaoke)
}
// 默认导出组件
export default Karaoke
