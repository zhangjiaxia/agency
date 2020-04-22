<template>
	<view class="layer">
		<view class="uni-flex content achieve">
			<view class="uni-flex uni-column" style="width: 100%;">
				<view class="uni-flex uni-row">
					<view class="uni-flex rest me">今日邀请用户数：{{todayData.quantity || 0}}人</view>
					<view class="uni-flex me">今日业绩：{{todayData.dayTotal / 100 || 0}}元</view>
				</view>
				<view class="count">团队今日业绩：{{todayData.teamTotal / 100 || 0}}元</view>
			</view>
		</view>
		<image src="../../static/index.png" class="bgimg" mode="scaleToFill"></image>
		<view class="uni-flex uni-column content wxuser">
			<view class="uni-flex circle" @click="$turnPage('usercenter', 'navigateTo')">
				<image class="head" :src="userInfo.avatarUrl"></image>
			</view>
			<view class="uni-flex vertical">
				<text class="nick">{{userInfo.nickName}}</text>
				<text class="iconfont .icon-vip vip"></text>
			</view>
		</view>
		<view class="uni-flex uni-column" style="margin: 0 20rpx;">
			<view class="uni-flex content lefttext">我最近一周业绩</view>
			<view class="uni-flex">
				<view class="qiun-charts" >
					<canvas ref="lineChart" canvas-id="canvasLineA" id="canvasLineA" class="charts" v-if="LineA.series.length > 0"
						@touchstart="touchLineA" @touchmove="moveLineA" @touchend="touchEndLineA"></canvas>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import uCharts from '@/components/u-charts/u-charts.js';
	import interfaceurl from '@/utils/interface.js'
	//引入store的内容
	import {
		mapState,
		mapMutations,
		mapActions
	} from 'vuex'
	var _self;
	var canvaLineA = null;
	export default {
		computed: mapState(['userInfo']),
		data() {
			return {
				cWidth:'',
				cHeight:'',
				pixelRatio:1,
				LineA: {
				  categories: ["2020-03-09", "2020-03-10", "2020-03-11", "2020-03-12", "2020-03-13", "2020-03-14", "2020-03-15"],
				  series: []
				 //  series: [{
					// name: "我邀请的用户数",
					// data: [5, 8, 2, 3, 4, 20, 10]
				 //  },{
					// name: "我的业绩榜",
					// data: [3, 9, 1, 13, 14, 20, 16]
				 //  },{
					// name: "用户消费状况",
					// data: [4, 5, 12, 13, 14, 22, 12]
				 //  }]
				},
				todayData: {}, //今日数据
				consumption: {},
				commission: {},
				extension: {}
			}
		},
		onLoad() {
			_self = this;
		},
		onShow() {
			this.LineA.series = []
			//获取今日业绩
			this.getDataByDay();
			//邀请用户数
			this.getExtensionUser();
			// //佣金数据
			// this.getCommissionByUser();
			// //消费数据
			// this.getConsumption();
			this.cWidth=uni.upx2px(710);
			this.cHeight=uni.upx2px(450);
			//this.getServerData();
		},
		methods: {
			getConsumption () {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.consumption, {userId: that.userInfo.id}).then((res) => {
					that.consumption = res.data;
					let data = []
					for(var i in that.consumption) {
						data.push(that.consumption[i]);
					}
					let consumption = {
						name: "用户消费状况",
						data: data
					}
					that.LineA.series.push(consumption);
					this.getServerData();
				});
			},
			getCommissionByUser() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.commissionByUser, {userId: that.userInfo.id}).then((res) => {
					that.commission = res.data;
					let data = []
					for(var i in that.commission) {
						data.push(that.commission[i]);
					}
					let commissionByUser = {
						name: "我的业绩榜",
						data: data
					}
					that.LineA.series.push(commissionByUser);
					//消费数据
					that.getConsumption();
				});
			},
			getExtensionUser() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.extensionUser, {userId: that.userInfo.id}).then((res) => {
					that.extension = res.data;
					let data = [], x = 0
					for(var i in that.extension) {
						//设置x轴数据
						that.LineA.categories.splice(x, 1, i)
						data.push(that.extension[i]);
						x++;
					}
					let extensionUser = {
						name: "我邀请的用户数",
						data: data
					}
					that.LineA.series.push(extensionUser)
					//佣金数据
					that.getCommissionByUser();
				});
			},
			getDataByDay() {
				let that = this;
				interfaceurl.checkAuth(interfaceurl.dataByDay, {userId: that.userInfo.id}).then((res) => {
					that.todayData = res.data;
				});
			},
			/*以下为图表相关*/
			getServerData(){
				this.showLineA("canvasLineA", this.LineA);
				// this.showLineA("canvasLineB", this.LineA);
				// this.showLineA("canvasLineC", this.LineA);
			},
			showLineA:function(canvasId, chartData) {
				canvaLineA = new uCharts({
					$this: _self,
					canvasId: canvasId,
					type: 'line',
					fontSize: 11,
					legend:{show:true},
					dataLabel: false,
					dataPointShape: false,
					background: '#FFFFFF',
					pixelRatio: _self.pixelRatio,
					categories: chartData.categories,
					series: chartData.series,
					animation: false,
					enableScroll: true, //开启图表拖拽功能
					xAxis: {
						data: [],
					    // type:'grid',
					    // gridType:'dash',
					    itemCount:4,//x轴单屏显示数据的数量，默认为5个
					    scrollShow:true,//新增是否显示滚动条，默认false
					    scrollAlign:'left',//滚动条初始位置
					    scrollBackgroundColor:'#F7F7FF',//默认为 #EFEBEF
					    scrollColor:'#DEE7F7',//默认为 #A6A6A6
					},
					yAxis: {
						//disabled:true
						gridType: 'dash',
						splitNumber: 5,
						min: 0,
						max: 25,
						format:(val)=>{return val}
						// format: (val) => {
						// 	return val.toFixed(0) + '件'
						// } //如不写此方法，Y轴刻度默认保留两位小数
					},
					width: _self.cWidth * _self.pixelRatio,
					height: _self.cHeight * _self.pixelRatio,
					dataPointShape: true,
					extra: {
						line: {
							type: 'curve' //曲线
						}
					},
				});
			},
			touchLineA(e) {
				canvaLineA.scrollStart(e);
			},
			moveLineA(e) {
				canvaLineA.scroll(e);
			},
			touchEndLineA(e) {
				canvaLineA.scrollEnd(e);
				//下面是toolTip事件，如果滚动后不需要显示，可不填写
				canvaLineA.showToolTip(e, {
					format: function(item, category) {
						return category + ' ' + item.name + ':' + item.data
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	/*样式的width和height一定要与定义的cWidth和cHeight相对应*/
	.qiun-charts {
		width: 710upx;
		height: 500upx;
		background-color: #FFFFFF;
	}
	.charts {
		width: 710upx;
		height: 450upx;
		background-color: #FFFFFF;
	}
	.bgimg {
		height: 222rpx;
		width: 100%;
		position: absolute;
		top: 0;
		z-index: -1;
	}
	.layer {
		.achieve {
			padding-left: 20px;
			padding-right: 92rpx;
			height: 148rpx;
			color: #FFFFFF;
			.count {
				font-size: 27rpx;
			}
			.me {
				font-size: 26rpx;
			}
		}
		.wxuser {
			.circle {
				border: 10rpx solid #FFFFFF;
				border-radius: 50%;
			}
			.head {
				width:118rpx;
				height:118rpx;
				border-radius:50%;
			}
			.nick {
				font-size: 25rpx;
				color: #000000;
			}
			.vip {
				font-size: 36rpx;
				color: #DDA81B;
				position: relative;
				top: 6rpx;
			}
		}
		.lefttext {
			color: #343434;
			font-size: 27rpx;
			margin: 30rpx 0;
		}
	}
</style>
