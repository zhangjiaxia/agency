import req from './request.js' //引入请求api
import store from '@/store' //引入全局变量的token

const isFormal = false //是否正式,false:测试，true:正式

const localUrlTest = "http://39.97.247.179:8080" //本地项目https://192.168.0.127
const baseUrlTest = "https://game.itaocow.com.cn"; //测试域名，平时开发用测试域名，例如39.97.247.179
const baseUrlFormal = "https://shop.itaocow.com.cn"; //正式域名，提交文件时要切换到正式域名，例如https://wxmini.etour.wangytech.com
const newTestUrl = "http://pro.gzzshd.com";
//const baseUrl = isFormal ? baseUrlFormal : baseUrlTest;
const baseUrl = newTestUrl

/**后台>http://39.97.247.179:8080/productInfoList.html
 * 后台账号：test  密码： 123456
 * 后台接口》https://192.168.0.199/swagger-ui.html#!/
 * 配置接口定义，请求方式默认为get，post方式需明确指定
 * 根据指引》https://www.jianshu.com/p/edd9a1aac8bd
 */
const interfaceurl = {
    /**
     * 错误弹窗
     */
    showErr(err) {
        uni.hideLoading();
        const msg = req.errPicker(err);
        //正式，由于正式环境不可在用户面前暴露过多问题，所以像500,404这些未正常请求到后台的异常直接提示‘wifi信号弱’
        if (isFormal) {
            uni.showToast({
                title: msg,//'wifi信号弱'
                icon: 'none',
                duration: 2000
            });
        } else { //测试,尽可能的暴露问题
            uni.showModal({
                showCancel: false,
                content: msg
            });
        }
    },
    /**
     * 数据格式业务处理
     */
    showBussisnessErr(res) {
        console.log(res);
        //res.respCode为0则是正常，其它数值代表请求有正常跑完全程，后台接口能够捕获到的异常处理
        if (res.respCode !== '0000') {
			if(res.respCode === '0029') {
				uni.showToast({
				    title: '用户登录过期,请重新登录',
				    icon: 'none',
				    duration: 2000
				});
				uni.getUserInfo({
				  success: function(res) {
					interfaceurl.login(res);
				  }
				})
				uni.reLaunch({
				  url: '/pages/index/login'
				})
			} else {
				uni.showToast({
				    title: res.respMsg,
				    icon: 'none',
				    duration: 2000
				});
			}
            return false
        }
        //返回true值后，执行正常业务
        return true
    },
	/**
	 * 用户登录，若用户授权登录后，检查登录状态失效，就要重新登录
	 */
	login(detail, successBack) {
		console.log('login')
		//let code = store.state.code;
		uni.login({
		  success (res) {
		    if (res.code) {
				console.log('uni.login',res.code)
				//这里直接用原生请求就行了
				uni.request({
					url: `${baseUrl}/mp/wxapi/session.do`,
					data: {
					  appId: 'wxb0feded4d7d7aad2',
					  code: res.code
					},
					method: 'post',
					success (res) {
						let loginResp = res.data.data;
						uni.setStorageSync('token', loginResp.token)
						uni.setStorageSync('loginInfo', loginResp)
						uni.setStorageSync('userInfo', detail.userInfo)
						uni.setStorageSync('openId', loginResp.openId)
						store.commit('setOpenId', loginResp.openId)
						store.commit('updateToken', loginResp.token)
						store.commit('setLoginInfo', loginResp)
						store.commit('setUserInfo', detail.userInfo);
						if(successBack) {
							successBack();
						}
					},
					fail(res) {
						interfaceurl.showErr(res)
					}
				})
		    } else {
		      uni.showToast({
				  title: '登录失败！' + res.errMsg,
				  icon: 'none',
				  duration: 2000
		      });
		    }
		  }
		})
	},
	/**
	 * 检查登录状态，每次调用权限接口时都要检查登录状态
	 */
	checkLogin(){
	  return new Promise(function(resolve,reject){
	    wx.checkSession({
	      success: resolve,
	      fail: reject
	    })
	  })
	},
	//小程序接口,标记false的接口都是开放接口，其余的为权限接口
	
	//获取登录授权sessin_key
	session(data) { return req.request({ url: `${baseUrl}/mp/wxapi/session.do`, data, method: 'POST' }, false) },
	//代理登录
	agentLogin(data) { return req.request({ url: `${baseUrl}/mpa/agent/login.do`, data, method: 'POST' }, false) },
	//短信验证码
	send(data) { return req.request({ url: `${baseUrl}/msg/send.do`, data }, false) },
	//小程序推广码
	qrcode(data) { return req.request({ url: `${baseUrl}/mp/wxapi/getQrcode.do`, data, method: 'POST' }, false) },
	
	//权限接口调用前先检查下用户登录状态
	checkAuth(bussinessInterfaceurl, data, isAuth = true) {
		return new Promise(function (resolve, reject) {
			if(isAuth) {
				interfaceurl.checkLogin().then((res) => { //login API 获取code
					console.log('权限接口调用前')
					// wx.showLoading({
					// 	title: '',
					// 	mask: true,
					// 	duration:3000
					// });
					//权限接口调用
					bussinessInterfaceurl(data).then((res) => {
						if(interfaceurl.showBussisnessErr(res)){
							//wx.hideLoading();
							resolve(res); //接口200时返回的数据
						} 
					}).catch(interfaceurl.showErr); //异常捕获
				}).catch((err) => {
					//interfaceurl.showErr(err)	弹出session通道失效
					interfaceurl.login()
				});
			} else {
				//开放接口调用
				bussinessInterfaceurl(data).then((res) => {
					if(interfaceurl.showBussisnessErr(res)){
						resolve(res); //接口200时返回的数据
					} 
				}).catch(interfaceurl.showErr); //异常捕获
			}
		})
	},
	
	//授权获取手机号
	getMobile(data) { return req.request({ url: `${baseUrl}/mp/wxapi/auth/getMobile.do`, data, method: 'POST' }) },
	//保存并返回用户信息
	storeUser(data) { return req.request({ url: `${baseUrl}/mp/wxapi/storeUser.do`, data, method: 'POST'}) },
	//工作台--今日数据
	dataByDay(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/dataByDay.do`, data}) },
	//工作台-邀请用户数
	extensionUser(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/extensionUser.do`, data}) },
	//工作台-佣金数据
	commissionByUser(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/commissionByUser.do`, data}) },
	//工作台-消费数据
	consumption(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/consumption.do`, data}) },
	//我的收益
	income(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/income.do`, data}) },
	//收益明细
	commission(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/commission.do`, data, method: 'POST'}) },
	//提现申请
	moneyApply(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/cash/apply.do`, data, method: 'POST'}) },
	//团队业绩
	teamCommission(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/teamCommission.do`, data}) },
	//团队成员
	teamUser(data) { return req.request({ url: `${baseUrl}/mpa/agent/auth/teamUser.do`, data, method: 'POST'}) },
	//推广团队
	teamShare(data) { return req.request({ url: `${baseUrl}/mp/auth/agent/teamShare.do`, data}) },
	//推广海报
	poster(data) { return req.request({ url: `${baseUrl}/mp/poster/list.do`, data}) },
	//加入站队（代理人）
	joinTeam(data) { return req.request({ url: `${baseUrl}/mpa/agent/jointeam.do`, data, method: 'POST' }) },
}

export default interfaceurl;