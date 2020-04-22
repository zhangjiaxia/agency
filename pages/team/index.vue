<template>
	<view class="">
		<view class="uni-flex uni-row condition">
			<view class="uni-flex rest content base" 
				@click="setIsAchievement(true)"	:class="{active: isAchievement}">
				团队业绩
				<view class="underline" v-if="isAchievement"></view>
			</view>
			<view class="uni-flex rest content base" 
				@click="setIsAchievement(false)" :class="{active: !isAchievement}">
				成员管理
				<view class="underline" v-if="!isAchievement"></view>
			</view>
		</view>
		<view v-if="isAchievement">
			<view class="uni-flex uni-row vertical tablehead">
				<view class="uni-flex rest base">成员</view>
				<view class="uni-flex rest base">邀请数</view>
				<view class="uni-flex rest base">本月业绩</view>
				<view class="uni-flex rest base">总业绩</view>
			</view>
			<view class="uni-flex uni-row vertical tablebody"
				v-for="(item, index) in teams" :key="index">
				<view class="uni-flex rest base">{{item.name}}</view>
				<view class="uni-flex rest base">{{item.quantity}}</view>
				<view class="uni-flex rest base">{{item.monthCommission / 100}}</view>
				<view class="uni-flex rest base">{{item.totalCommission / 100}}</view>
			</view>
		</view>
		<view v-else>
			<view class="uni-flex uni-row vertical tablehead">
				<view class="uni-flex rest base">成员</view>
				<view class="uni-flex rest base">地区</view>
				<view class="uni-flex rest base">联系电话</view>
				<view class="uni-flex rest base">加入时间</view>
			</view>
			<view class="uni-flex uni-row vertical tablebody"
				v-for="(item, index) in members" :key="index">
				<view class="uni-flex rest base">{{item.name}}</view>
				<view class="uni-flex rest base">{{item.city}}</view>
				<view class="uni-flex rest base">{{item.mobile}}</view>
				<view class="uni-flex rest base">{{item.createDt}}</view>
			</view>
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
		computed: mapState(['userInfo']),
		data() {
			return {
				isAchievement: true, //是否为团队业绩
				teams: [],
				members: []
			}
		},
		onLoad() {
			
		},
		onShow() {
			this.getTeamCommission();
			this.getTeamUser();
		},
		methods: {
			getTeamCommission () {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.teamCommission, {userId: that.userInfo.id}, false).then((res) => {
					that.teams = res.data;
				});
			},
			getTeamUser () {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.teamUser, {userId: that.userInfo.id}, false).then((res) => {
					that.members = res.data;
					for(var item of that.members) {
						item.createDt = new Date(item.createDt).format("yyyy-MM-dd hh:mm:ss");
					}
				});
			},
			setIsAchievement(flag) {
				this.isAchievement = flag;
			}
		}
	}
</script>

<style lang="scss">
	.underline {
		width:30rpx;
		height:3rpx;
		background:rgba(253,94,45,1);
	}
	.base {
		color: #666666;
		font-size: 23rpx;
	}
	.condition {
		height:90rpx;
		background:rgba(240,240,240,1);
		.active {
			color: #FD5E2D;
		}
	}
	.tablehead {
		height: 70rpx;
		border-bottom: 1px solid #DDDDDD;
		padding-left: 20rpx;
	}
	.tablebody {
		margin: 20rpx 0;
		padding-left: 20rpx;
	}
</style>
