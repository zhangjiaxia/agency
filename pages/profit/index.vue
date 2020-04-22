<template>
	<view class="">
		<view class="uni-flex uni-column commission">
			<view class="uni-flex uni-row first">
				<view class="uni-flex rest">
					<text class="left">我的佣金（本月）</text>
				</view>
				<view class="uni-flex">
					<text class="right">未结算：{{myIncome.noSettle / 100 || 0}}元</text>
				</view>
			</view>
			<view class="uni-flex uni-column rest content money">
				<view class="uni-flex total">{{myIncome.month / 100 || 0}}</view>
				<view class="uni-flex settle">已结算：{{myIncome.settled / 100 || 0}}元</view>
				<view class="uni-flex content withdrawal" @click="getMoneyApply">
					<text class="cash">去提现</text>
				</view>
			</view>
		</view>
		<view class="uni-flex uni-row condition">
			<view class="uni-flex rest content base" @click="setTimeRange(1)" :class="{active: timeRange === 1}">七天
				<view class="underline" v-if="timeRange === 1"></view>
			</view>
			<view class="uni-flex rest content base" @click="setTimeRange(2)" :class="{active: timeRange === 2}">本月
				<view class="underline" v-if="timeRange === 2"></view>
			</view>
			<view class="uni-flex rest content base" @click="setTimeRange(3)" :class="{active: timeRange === 3}">本年
				<view class="underline" v-if="timeRange === 3"></view>
			</view>
			<view class="uni-flex rest content base" @click="setTimeRange(4)" :class="{active: timeRange === 4}">全部收益
				<view class="underline" v-if="timeRange === 4"></view>
			</view>
		</view>
		<view class="infos">
			<view class="uni-flex uni-row vertical info"
				v-for="(item, index) in profits" :key="index">
				<view class="uni-flex uni-column" style="width: 100%;">
					<view class="uni-flex uni-row">
						<view class="uni-flex rest rebate">{{item.name}}</view>
						<view class="uni-flex price">{{item.commission / 100}}</view>
					</view>
					<view class="uni-flex">
						<text class="date">{{item.createDt}}</text>
					</view>
				</view>
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
				myIncome: {},
				profits: [], //收益列表
				params: {
					userId: '',
					startDT: '', //yyyy-mm-dd
					endDT: '',
					start: 0,
					length: 10
				}, //收益参数
				applyParams: {
					userId: '',
					money: 1
				}, //提现参数
				timeRange: 1, //时间范围参数索引
				dateOption: {
					currentDate: '', //当前时间
					sevenBefor: '', //七天前
					currentMonth: '', //本月
					currentYear: '' //本年
				} //时间条件参数
			}
		},
		onLoad() {
			
		},
		onShow() {
			//获取时间条件
			this.getDateOption();
			//我的收益
			this.getIncome();
			this.getCommission();
		},
		methods: {
			getDateOption() {
				let currentDate = new Date(), seven = new Date(), currentMonth = new Date(), currentYear = new Date();
				seven.setDate(currentDate.getDate()-7);
				//当前时间
				currentDate = new Date(currentDate).format("yyyy-MM-dd");
				//七天
				seven = new Date(seven).format("yyyy-MM-dd");
				//本月
				currentMonth.setDate(1);
				currentMonth = new Date(currentMonth).format("yyyy-MM-dd");
				//本年
				currentYear.setMonth(0);
				currentYear.setDate(1);
				currentYear = new Date(currentYear).format("yyyy-MM-dd");
				this.dateOption.currentDate = currentDate;
				this.dateOption.sevenBefor = seven;
				this.dateOption.currentMonth = currentMonth;
				this.dateOption.currentYear = currentYear;
				//赋值时间参数
				this.params.startDT = this.dateOption.sevenBefor;
				this.params.endDT = this.dateOption.currentDate;
			},
			setTimeRange(index) {
				this.timeRange = index;
				this.params.endDT = this.dateOption.currentDate;
				if(index === 1) {
					this.params.startDT = this.dateOption.sevenBefor;
				} else if(index === 2) {
					this.params.startDT = this.dateOption.currentMonth;
				} else if(index === 3) {
					this.params.startDT = this.dateOption.currentYear;
				} else if(index === 4) {
					this.params.startDT = '';
					this.params.endDT = '';
				}
				this.getCommission();
			},
			getMoneyApply() {
				if(this.applyParams.money == 0) {
					uni.showToast({
					    title: '提现金额不能为0',
					    icon: 'none',
					    duration: 2000
					});
					return;
				}
				let that = this;
				that.applyParams.userId = that.userInfo.id
				that.applyParams.money = this.myIncome.noSettle
				interfaceurl.checkAuth(interfaceurl.moneyApply, that.applyParams, false).then((res) => {
					that.getIncome();
					uni.showToast({
					    title: '提现申请成功',
					    icon: 'none',
					    duration: 2000
					});
				});
			},
			getCommission() {
				let that = this;
				that.params.userId = that.userInfo.id
				interfaceurl.checkAuth(interfaceurl.commission, that.params, false).then((res) => {
					that.profits = res.data;
					for(var item of that.profits) {
						item.createDt = new Date(item.createDt).format("yyyy-MM-dd hh:mm:ss");
					}
				});
			},
			getIncome () {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.income, {userId: that.userInfo.id}, false).then((res) => {
					that.myIncome = res.data;
				});
			},
		}
	}
</script>

<style lang="scss">
	.underline {
		width:30rpx;
		height:3rpx;
		background:rgba(253,94,45,1);
	}
	.commission {
		height:350rpx;
		background:rgba(91,142,245,1);
		color: #FFFFFF;
		.first {
			margin: 0 20rpx;
			margin-top: 32rpx;
			.left {
				font-size: 24rpx;
			}
			.right {
				font-size: 23rpx;
			}
		}
		.money {
			.total {
				font-size: 54rpx;
			}
			.settle {
				font-size: 23rpx;
				margin-bottom: 30rpx;
			}
			.withdrawal {
				width:200rpx;
				height:60rpx;
				background:rgba(255,255,255,1);
				opacity:0.5;
				border-radius:30rpx;
				.cash {
					font-size: 29rpx;
					color: #295DC7;
				}
			}
		}
	}
	.condition {
		height:90rpx;
		background:rgba(240,240,240,1);
		.base {
			color: #666666;
			font-size: 23rpx;
		}
		.active {
			color: #FD5E2D;
		}
	}
	.infos {
		margin: 0 20rpx;
		.info {
			height: 144rpx;
			border-bottom: 1px solid #DDDDDD;
			.rebate {
				font-size: 26rpx;
				color: #343434;
			}
			.price {
				font-size: 22rpx;
				color: #343434;
			}
			.date {
				color: #999999;
				font-size: 19rpx;
			}
		}
	}
</style>
