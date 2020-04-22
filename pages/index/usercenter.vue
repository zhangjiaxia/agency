<template>
	<view class="">
		<view class="uni-flex uni-row vertical info">
			<view class="uni-flex uni-row vertical">
				<view class="uni-flex">
					<image class="head" :src="userInfo.avatarUrl"></image>
				</view>
				<view class="uni-flex uni-column">
					<view class="uni-flex">
						<text class="nick">{{userInfo.nickName}}</text>
						<text class="iconfont .icon-vip vip"></text>
					</view>
					<view class="uni-flex">
						<text class="code">我的推荐码：{{userInfo.id}}</text>
						<text class="iconfont .icon-fuzhi copy"></text>
					</view>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row bar" @click="$turnPage('customer', 'navigateTo')">
			<view class="uni-flex rest">
				<text class="contact">联系客服</text>
			</view>
			<view class="uni-flex">
				<text class="iconfont .icon-gengduo enter"></text>
			</view>
		</view>
		<view class="uni-flex uni-row bar" @click="$turnPage('../extension/index', 'switchTab')">
			<view class="uni-flex rest">
				<text class="contact">去推广</text>
			</view>
			<view class="uni-flex">
				<text class="iconfont .icon-gengduo enter"></text>
			</view>
		</view>
		<view class="uni-flex uni-row bar" @click="$turnPage('help', 'navigateTo')">
			<view class="uni-flex rest">
				<text class="contact">帮助&FAQ</text>
			</view>
			<view class="uni-flex">
				<text class="iconfont .icon-gengduo enter"></text>
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
				title: '工作台'
			}
		},
		onLoad() {
	
		},
		methods: {
	
		}
	}
</script>

<style lang="scss">
	.info {
		height:205rpx;
		background:rgba(239,239,239,1);
		.head {
			width:120rpx;
			height:120rpx;
			border-radius:50%;
			margin-left: 30rpx;
			margin-right: 24rpx;
		}
		.nick {
			color: #000000;
			font-size: 31rpx;
		}
		.vip {
			font-size: 36rpx;
			color: #DDA81B;
		}
		.code {
			color: #666666;
			font-size: 23rpx;
		}
		.copy {
			color: #666666;
			font-size: 21rpx;
		}
	}
	.bar {
		margin: 40rpx 30rpx;
		.contact {
			color: #4A4A4A;
			font-size: 26rpx;
		}
		.enter {
			color: #CECECE;
			font-size: 27rpx;
		}
	}
</style>
