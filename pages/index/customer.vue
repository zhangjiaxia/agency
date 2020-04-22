<template>
	<view class="layer">
		<view class="uni-flex uni-column content">
			<view class="uni-flex" style="position: relative;">
				<image class="hotline" src="../../static/hotline.png"></image>
				<view class="service">
					<view class="hot">客服热线:</view>
					<view class="phone">020-4646343</view>
				</view>
			</view>
			<view class="uni-flex space">
				<image class="hotline" src="../../static/email.png"></image>
				<view class="service">
					<view class="hot">客服邮箱:</view>
					<view class="phone">4654646@163.com</view>
				</view>
			</view>
			<view class="uni-flex">
				<image class="code" src="../../static/email.png"></image>
			</view>
			<view class="uni-flex codetext">扫码咨询客服</view>
		</view>
	</view>
</template>

<script>
	export default {
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
	.layer {
		margin: 20rpx;
		.space {
			margin-top: 20rpx;
			margin-bottom: 136rpx;
		}
		.hotline {
			width: 710rpx;
			height: 150rpx;
			// border: 1px dashed #888888;
		}
		.service {
			position: absolute;
			margin-top: 20rpx;
			margin-left: 24rpx;
			color: #FFFFFF;
			.hot {
				font-size: 23rpx;
			}
			.phone {
				font-size: 25rpx;
			}
		}
		.code {
			width:210rpx;
			height:210rpx;
		}
		.codetext {
			color: #666666;
			font-size: 23rpx;
			margin-top: 20rpx;
		}
	}
</style>
