<template>
	<view>
		<!--将海报跟二维码通过画布组合到一起，展示在image中，下载图片-->
		<canvas class="canvas-poster" id="canvasPoster" :style="{width:width+'px',height: height+'px'}" canvas-id="canvasPoster"></canvas>
		<image :src="poster" class="poster" @click="previewImg" alt="" v-if="poster"></image>
		<view class="uni-flex content posterdiv" v-if="poster">
			<view class="uni-flex purchase content" @click="saveImg">保存图片</view>
		</view>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	import imgformat from '@/utils/base64-arraybuffer.js' //图片数据格式转换
	export default {
		data() {
			return {
				params: {
					userId: '', //推荐人ID
					appId: 'wx8886f23ea6db4812',
					//scene直接传agentId的值
					scene: '', //https://developers.weixin.qq.com/miniprogram/dev/api-backend/open-api/qr-code/wxacode.getUnlimited.html
					page: 'pages/index/index',
					width: 280 //最小280,最大1280,单位px
				},
				shareInfo: {
				  bgImg: '../../../static/poster.jpg',
				  qrcode: ''
				},
				//画布的宽高
				width: 0,
				height: 0,
				systemInfo: {},
				poster: '' //生成的海报
			}
		},
		onLoad(options) {
			if(options.agentId) {
				this.params.userId = options.agentId;
				this.params.scene = options.agentId;
				let that = this;
				uni.getImageInfo({
				    src: options.poster,    //请求的网络图片路径
				    success: function (res) {
						//请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
						that.shareInfo.bgImg = res.path;
						uni.showLoading({
							title: '海报生成中...',
							mask: true,
							duration:3000
						});
						that.getQrcode();
				  }
				})
			}
		},
		methods: {
			//获取动态二维码（可携带参数）
			getQrcode() {
				let that = this;
				that.params.userId = that.agentId;
				interfaceurl.checkAuth(interfaceurl.qrcode, that.params).then((res) => {
					imgformat(res.data).then(
						function(data){ 
							that.shareInfo.qrcode = data;
							that.drawBefore();
						}
					)
				});
			},
			drawBefore() {
				let that = this;
				//画布的宽高赋值渲染是最大的坑点
				wx.getSystemInfo({
				    success (res) {
					    that.systemInfo = res;
						// 通过像素比计算出画布的实际大小（330x490）是展示的出来的大小
						that.width = 330 * res.pixelRatio
						that.height = 490 * res.pixelRatio
						var query = wx.createSelectorQuery()
						query.select('#canvasPoster').boundingClientRect((res) => {
							// 返回值包括画布的实际宽高
							that.drawImage(res);
						}).exec();
				    }
				})
			},
			//点击保存到相册
			saveImg() {
			    var that = this;
			    wx.saveImageToPhotosAlbum({
			      filePath: that.poster,
			      success(res) {
			        wx.showModal({
			          content: '图片已保存到相册，赶紧晒一下吧~',
			          showCancel: false,
			          confirmText: '好的',
			          confirmColor: '#333',
			          success: function (res) {
			            if (res.confirm) {
			              console.log('用户点击确定');
			            }
			          }, 
					  fail: function (res) {
						  console.log(res)
			          }
			        })
			      }
			    })
			},
			previewImg () {
			    if (this.poster) {
			      //预览图片，预览后可长按保存或者分享给朋友
			      wx.previewImage({
			        urls: [this.poster]
			      })
			    }
			 },
			drawImage (canvasAttrs) {
				let that = this;
			    let ctx = wx.createCanvasContext('canvasPoster', this)
			    let canvasW = that.width // 画布的真实宽度660canvasAttrs.width
			    let canvasH = that.height //画布的真实高度980canvasAttrs.height
			    // 头像和二维码大小都需要在规定大小的基础上放大像素比的比例后面都会 *this.systemInfo.pixelRatio
			    let headerW = 48 * this.systemInfo.pixelRatio
			    let headerX = (canvasW - headerW) / 2
			    let headerY = 40 * this.systemInfo.pixelRatio
			    let qrcodeW = 73 * this.systemInfo.pixelRatio
			    let qrcodeX = 216 * this.systemInfo.pixelRatio
			    let qrcodeY = 300 * this.systemInfo.pixelRatio
			    // 填充背景
			    ctx.drawImage(this.shareInfo.bgImg, 0, 0, canvasW, canvasH)
			    ctx.save()
				// 绘制二维码
				ctx.drawImage(this.shareInfo.qrcode, qrcodeX, qrcodeY, qrcodeW, qrcodeW)
				ctx.save()
				// 将前面绘制的各个图案一起画出来
			    ctx.draw()
			    setTimeout(() => {
			      //下面的13以及减26推测是因为在写样式的时候写了固定的zoom: 50%而没有用像素比缩放导致的黑边，所以在生成时进行了适当的缩小生成，这个大家可以自行尝试
			      wx.canvasToTempFilePath({
			        x: 13,
			        y: 13,
			        width: canvasW - 26,
			        height: canvasH - 26,
			        destWidth: canvasW - 26,
			        destHeight: canvasH - 26,
					canvasId: 'canvasPoster',
			        success: (res) => {
			          that.poster = res.tempFilePath
					  uni.hideLoading();
			        }
			      })
			    }, 200)
			}
		}
	}
</script>

<style lang="scss">
	.canvas-poster{
	  background-color: #fafafa;
	  zoom: 50%; // 将画布缩小到50%（最好通过像素比进行缩小，像素比是2的话就是50%，如果不全是以像素比为标准，在生成图片的时候可能会出现四周黑边）
	  position: absolute;
	  left: -10000px; // 将画布隐藏在可视区域外
	  background: #206949;
	}
	.poster {
		width: 100%;
		height: 100vh;
		position: absolute;
		z-index: -1;
	}
	.purchase {
		width:180rpx;
		height:70rpx;
		font-size: 27rpx;
		border:1px solid rgba(253,94,45,1);
		border-radius:10rpx;
		display: inline-flex;
		background:rgba(253,94,45,1);
		color: #FFFFFF;
		position: absolute;
		bottom: 100rpx;
	}
</style>
