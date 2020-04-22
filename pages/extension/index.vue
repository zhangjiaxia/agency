<template>
	<view class="">
		<view class="uni-flex uni-row vertical invite">
			<view class="uni-flex">
				<text class="team">{{type === 0 ? member.object : user.object}}</text>
			</view>
			<view class="uni-flex rest">
				<view class="content switch" @click="setIsMember">
					<text class="switchtext">切换</text>
				</view>
			</view>
			<view class="uni-flex" v-if="type === 0">
				<text class="code">我的推荐码：{{userInfo.id}}</text>
			</view>
		</view>
		<view class="uni-flex uni-column invitepic">
			<image class="uni-flex pic" :src="type == 0 ? poster.member.iconImg : poster.user.iconImg"></image>
			<view class="uni-flex rest vertical invitetext">
				【{{type == 0 ? poster.member.name : poster.user.name || ''}}】
				{{type == 0 ? poster.member.content : poster.user.content || ''}}
			</view>
		</view>
		<view class="uni-flex uni-row content">
			<button class="share-btn uni-flex content invitebtn" open-type="share" v-if="type === 0">{{member.btn}}</button>
			<button class="share-btn uni-flex content invitebtn" @click="createPoster" v-else>{{user.btn}}</button>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	export default {
		data() {
			return {
				code: '', //邀请码
				isMember: true, //是否成员
				member: {
					object: '邀请团队成员',
					btn: '邀请团队'
				},
				user: {
					object: '邀请用户',
					btn: '分享给用户'
				},
				type: 0, //type: 0团队，1成员
				poster: {} //海报推广
			}
		},
		computed: mapState(['userInfo']),
		onLoad() {
			this.getPoster();
		},
		onShareAppMessage(res) {
			if(this.type === 0) {
				let paramsStr = '?agentId=' + this.userInfo.id + '&nick=' + this.userInfo.nickName + '&head=' + this.userInfo.avatarUrl + '&poster=' + this.poster.iconImg;
				return {
					title: '加入战队',
					path: '/pages/extension/addteam' + paramsStr
				}
			}
		},
		methods: {
			createPoster() {
				let extraData = '?agentId='+this.userInfo.id+'&poster='+this.poster.user.iconImg
				this.$turnPage('poster'+extraData, 'navigateTo')
			},
			turnMiniProgram() {
				//跳转到商城小程序
				uni.navigateToMiniProgram({
					appId: 'wx8886f23ea6db4812',
					path: 'pages/my/index?agentId='+ this.userInfo.id,
					// extraData: {
					// 	'agentId': 2
					// },
					envVersion: 'develop',
					success(res) {
						console.log('商城小程序跳转',res)
					},
					fail(res) {
						console.log('商城小程序跳转失败',res)
					}
				})
			},
			getTeamShare () {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.teamShare, {userId: that.userInfo.id}, false).then((res) => {
					that.code = res.data.code;
				});
			},
			getPoster () {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.poster, {type: 0}, false).then((res) => {
					that.$set(that.poster,"member",res.data[0].type == 0 ? res.data[0] : res.data[1]);
					that.$set(that.poster,"user",res.data[0].type == 1 ? res.data[0] : res.data[1]);
				});
			},
			setIsMember() {
				this.type = this.type === 0 ? 1 : 0;
				this.getPoster();
			}
		}
	}
</script>

<style lang="scss">
	.invite {
		margin: 30rpx 60rpx;
		.team {
			color: #666666;
			font-size: 34rpx;
		}
		.switch {
			margin-left: 22rpx;
			width:70rpx;
			height:33rpx;
			border:1px solid rgba(253,94,45,1);
			border-radius:17rpx;
			.switchtext {
				color: #FD5E2D;
				font-size: 20rpx;
			}
		}
		.code {
			color: #666666;
			font-size: 23rpx;
		}
	}
	.invitepic {
		margin: 0 auto;
		width:630rpx;
		height:700rpx;
		background:rgba(243,243,243,1);
		border-radius:20rpx;
		.pic {
			width: 100%;
			height:558rpx;
			border-top-right-radius: 20rpx;
			border-top-left-radius: 20rpx;
		}
		.invitetext {
			font-size: 29rpx;
			color: #343434;
			line-height: 1.2;
			margin-left: 21rpx;
			margin-right: 14rpx;
		}
	}
	.invitebtn {
		margin-top: 82rpx;
		width:630rpx;
		height:90rpx;
		color: #FFFFFF;
		background:rgba(253,94,45,1);
		border-radius:45rpx;
	}
</style>
