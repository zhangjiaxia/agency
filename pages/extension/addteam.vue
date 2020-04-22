<template>
	<view class="layer">
		<view class="uni-flex uni-column content addteam">
			<view class="uni-flex">
				<image class="head" :src="info.head"></image>
			</view>
			<view class="uni-flex">
				<text class="nick">{{info.nick}}</text>
			</view>
			<view class="uni-flex">
				<text class="invite">诚挚邀请你加入我的战队</text>
			</view>
			<view class="uni-flex">
				<image class="poster" :src="info.poster"></image>
			</view>
			<view class="uni-flex">
				<text class="recommend">推荐人：{{info.agentId}}</text>
			</view>
			<view class="uni-flex content press">
				<input type="text" placeholder="请输入用户手机" placeholder-class="pressnick" style="text-align: center;" v-model="params.mobile" />
			</view>
			<view class="uni-flex">
				<authPage :show="true">
					<view class="uni-flex content confirm" @click="setJoinTeam">
						<text>确认</text>
					</view>
				</authPage>
			</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import authPage from '@/components/authorization-page.vue' //引入授权窗体
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		components: {
			authPage
		},
		computed: mapState(['loginInfo', 'userInfo']),
		data() {
			return {
				title: '加入战队',
				info: {
					agentId: 0, //代理人ID
					nick: '', //代理人昵称
					head: '' //代理人头像
				},
				params: {
					sessionKey: '', //授权返回
					openId: '', //授权返回
					agentId: '' , //推荐人ID
					mobile: '' , //被邀请人手机号
					userInfo: {} //被邀请人授权信息
				}
			}
		},
		onLoad(options) {
			//this.info = options;
			if(!this.info.nick) {
				this.info = {
					agentId: 2, //代理人ID
					nick: '许松璋', //代理人昵称
					head: '' //代理人头像
				}
			}
		},
		watch: {
			loginInfo(newValue) {
				if (newValue.openId) {
					this.params.sessionKey = newValue.sessionKey;
					this.params.openId = newValue.openId;
					this.params.userInfo = this.userInfo;
					this.params.agentId = this.info.agentId;
					this.setJoinTeam();
				}
			}
		},
		methods: {
			//加入战队
			setJoinTeam () {
				if(!this.params.mobile) {
					uni.showToast({
					    title: '手机号不能为空',
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				let that = this;
				interfaceurl.checkAuth(interfaceurl.joinTeam, that.params).then((res) => {
					uni.showToast({
					    title: '加入成功',
					    icon: 'none',
					    duration: 2000
					});
					that.$turnPage('../index/login', 'reLaunch');
				});
			},
		}
	}
</script>

<style lang="scss">
	.layer {
		border-top: 1px solid #E3E3E3;
		.addteam {
			.head {
				width:90rpx;
				height:90rpx;
				border-radius:50%;
				margin-top: 32rpx;
				margin-bottom: 24rpx;
			}
			.nick {
				color: #343434;
				font-size: 26rpx;
			}
			.invite {
				color: #343434;
				font-size: 34rpx;
				margin: 41rpx 0;
			}
			.poster {
				width:440rpx;
				height:399rpx;
				border-radius:10rpx;
			}
			.recommend {
				font-size: 26rpx;
				color: #343434;
				margin-top: 40rpx;
				margin-bottom: 95rpx;
			}
			.press {
				margin-bottom: 50rpx;
				width: 440rpx;
				border-bottom: 1px solid #DDDDDD;
				.pressnick {
					font-size: 26rpx;
					color: #5B70DE;
				}
			}
			.confirm {
				color: #FFFFFF;
				width:440rpx;
				height:70rpx;
				background:rgba(91,112,222,1);
				border-radius:10rpx;
			}
		}
	}
</style>
