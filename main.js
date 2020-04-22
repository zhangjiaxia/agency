import Vue from 'vue'
import App from './App'
import store from './store' //全局变量
import './style/iconfont.css' //全局字体图标

Vue.config.productionTip = false
Vue.prototype.$store = store;

Date.prototype.format = function(fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,
        //月份
        "d+": this.getDate(),
        //日
        "h+": this.getHours(),
        //小时
        "m+": this.getMinutes(),
        //分
        "s+": this.getSeconds(),
        //秒
        "q+": Math.floor((this.getMonth() + 3) / 3),
        //季度
        "S": this.getMilliseconds() //毫秒
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
}

//注册全局跳转
Vue.prototype.$turnPage = (url, turnType) => {
    if(turnType === 'navigateTo') { //保留当前页面，跳转到应用内的某个页面
		uni.navigateTo({
		    url: url
		});
	} else if(turnType === 'switchTab') { //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面wx.redirectTo
		uni.switchTab({
		    url: url
		});
	} else if(turnType === 'redirectTo') { //关闭当前页面，跳转到应用内的某个页面。但是不允许跳转到 tabbar 页面
		uni.redirectTo({
		  url: url
		})
	} else if(turnType === 'reLaunch') { //关闭所有页面，打开到应用内的某个页面
		uni.reLaunch({
		  url: url
		})
	} else if(turnType === 'navigateBack') { //关闭当前页面，返回上一页面或多级页面
		uni.navigateBack({
		  delta: url
		})
	}
};

App.mpType = 'app'

const app = new Vue({
	store,
    ...App
})
app.$mount()
