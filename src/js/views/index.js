/**
 * @desc 主页面入口js
 * @author cuixinming
 * @email  [cxm_job@163.com]
 */
import Vue from 'vue';
import App from '../pages/app.vue';
import '../../css/reset.less';

Vue.config.devtools = process.env.NODE_ENV != 'production';

// new Rem();
window.General && window.General.rem();

new Vue({
    el: '#app', 
    render: h => h(App)
})