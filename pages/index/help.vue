<template>
	<view class="layer">
		<view class="help">
			<view class="space">
				<view class="question">我的收益是如何结算的？</view>
				<view class="answer">结算时间是工作日，每个月5号会进行一次核算，节假日期间不进行结算。</view>
			</view>
		</view>
		<view class="help">
			<view class="space">
				<view class="question">提现何时到账？</view>
			</view>
		</view>
		<view class="help">
			<view class="space">
				<view class="question">用户退货我的收益还有吗？</view>
			</view>
		</view>
		<view class="help">
			<view class="space">
				<view class="question">如何申请成为分销商</view>
			</view>
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
		.help {
			width:710rpx;
			background:rgba(243,243,243,1);
			border-radius:5rpx;
			margin-bottom: 19rpx;
			padding: 16rpx 0rpx;
			.space {
				margin-left: 26rpx;
				margin-right: 35rpx;
				.question {
					color: #343434;
					font-size: 27rpx;
					margin-bottom: 6rpx;
				}
				.answer {
					color: #666666;
					font-size: 25rpx;
					line-height: 1.2;
				}
			}
		}
	}
</style>
