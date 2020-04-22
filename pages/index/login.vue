<template>
	<view>
		<view v-if="!token">
			<authForm @isShow="isShow"
				:title="loginInfo.title" 
				:content="loginInfo.content" 
				:logName="loginInfo.logName" 
				:logImage="loginInfo.logImage" 
				:show="!token ? true : false">
			</authForm>
		</view>
		<view class="layer" v-else>
			<view class="uni-flex uni-column">
				<view class="uni-flex vertical phone">
					<input type="text" placeholder="手机号" v-model="params.mobile" />
				</view>
				<view class="uni-flex uni-row verify">
					<view class="uni-flex rest">
						<view class="uni-flex vertical code">
							<input type="text" placeholder="验证码" v-model="params.code" />
						</view>
					</view>
					<view class="uni-flex content getcode" @click="sendCode">{{number === 0 ? '获取验证码' : number+'秒 重发'}}</view>
				</view>
				<view class="uni-flex content login" @click="login">登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import authForm from '@/components/authorization-form.vue' //引入授权窗体
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authForm
		},
		data() {
			return {
				number: 0, //短信发送后60s倒计时
				params: {
					mobile: '',
					code: '', //验证码
					openId: '', //用户openId
					userInfo: {} //用户授权信息
				},
				loginInfo:{
				  title:'微信授权',
				  content:'获得您的公开信息(昵称、头像等)',
				  logName:'乐哒哒',
				  logImage:'/static/head.png',
				} //授权窗体
			}
		},
		computed: mapState(['token', 'userInfo', 'openId']),
		onLoad() {
			
		},
		methods: {
			isShow(){
				uni.showModal({
				    showCancel: false,
				    content: '您取消了授权，请允许授权，以便提供更好的服务'
				});
				uni.navigateBack({
				  delta: 1
				})
			},
			countdown() {
				this.number --;
				if(this.number == 0) {
					return;
				}
				setTimeout(this.countdown,1000);
			},
			sendCode() {
				let that = this;
				if(!that.params.mobile) {
					uni.showToast({
					    title: '手机号不能为空',
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				if(this.number != 0) {
					uni.showToast({
					    title: that.number+'秒后重新获取验证码',//'wifi信号弱'
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				that.number = 60;
				that.countdown();
				interfaceurl.checkAuth(interfaceurl.send, {mobile: that.params.mobile}, false).then((res) => {
					that.params.code = res.data;
					uni.showToast({
					    title: '发送成功',
					    icon: 'none',
					    duration: 2000
					});
				});
			},
			login() {
				let that = this;
				that.params.openId = uni.getStorageSync('openId');
				that.params.userInfo = this.userInfo;
				interfaceurl.checkAuth(interfaceurl.agentLogin, that.params, false).then((res) => {
					//保存全局token，用户信息
					that.$store.commit("updateToken", res.data.token);
					uni.setStorageSync("token", res.data.token);
					let userInfo = uni.getStorageSync("userInfo");
					userInfo.id = res.data.id;
					that.$store.commit("setUserInfo", userInfo);
					uni.setStorageSync("userInfo", userInfo);
					//登录成功跳转首页
					that.$turnPage('index', 'switchTab');
				});
			}
		}
	}
</script>

<style lang="scss">
	input {
		margin-left: 26rpx;
		width: 100%;
	}
	.layer {
		margin: 0 75rpx;
		padding-top: 107rpx;
		.phone {
			height:80rpx;
			background:rgba(236,236,236,1);
			border-radius:10rpx;
		}
		.verify {
			margin-top: 31rpx;
			margin-bottom: 107rpx;
			.code {
				width:380rpx;
				height:80rpx;
				background:rgba(236,236,236,1);
				border-radius:10rpx;
			}
		}
		.getcode, .login {
			height:80rpx;
			background:rgba(253,94,45,1);
			border-radius:10rpx;
			color: #FFFFFF;
		} 
		.getcode {
			width:200rpx;
		}
	}
</style>
