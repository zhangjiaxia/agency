<template>
	<view>
		<block v-if="show">
		  <view class="dialog_mask">
		    <view class='dialog_container'>
		      <view class="dialog__title" v-if="title" :style="{color: titleColor}">{{title}}</view>
		      <view class="dialog__content" v-if="title">
		        <view class='log_wrap' v-if="logImage && logName">
		          <!-- <view class='log_wrap--log' :style="{'background-image':'url('+logImage+')'}"></view> -->
				  <image class='log_wrap--log' :src="logImage"></image>
		          <view class='log_wrap--text'>{{logName}}</view>
		        </view>
		        <view class="dialog__content--text" v-if="content" :style="{color: contentColor}">{{content}}</view>
		      </view>
		      <view class="dialog__btns">
		        <!-- <view class="dialog__btns--cancel" @tap="cancel">拒绝</view> -->
		        <button class="getUserInfo_btn" open-type="getUserInfo" lang="zh_CN" @getuserinfo="getInfo">允许</button>
		      </view>
		    </view>
		  </view>
		</block>
	</view>
</template>

<script>
	import interfaceurl from '@/utils/interface.js'
	export default {
		props: {
			show: {
			  type: Boolean
			},
			title: {
			  type: String
			},
			titleColor: {
			  type: String,
			  value: '#000000'
			},
			logImage: {
			  type: String
			},
			logName: {
			  type: String
			},
			content: {
			  type: String
			},
			contentColor: {
			  type: String,
			  value: '#888888'
			}
		},
		data() {
			return {
				 
			};
		},
		mounted() {
			
		},
		methods: {
			getInfo(res) {
				console.log('授权',res)
				if (res.detail.encryptedData) {
					interfaceurl.login(res.detail);
				} else {
					uni.showModal({
					    showCancel: false,
					    content: '您取消了授权，请允许授权，以便提供更好的服务'
					});
				}
			},
			cancel(){
				this.$emit('isShow', false)
			}
		}
	}
</script>

<style>
.dialog_mask {
  height: 100%;
  width: 100%;
  display: flex;
  z-index: 666;
  position: fixed;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  top: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.6);
}

.dialog_container {
  width: 620rpx;
  border-radius: 4px;
  background: #fff;
  background-color: #fff;
  display: flex;
  overflow: hidden;
  flex-flow: column nowrap;
  align-items: center;
  padding-top: 50rpx;
}

.dialog__title {
  font-size: 36rpx;
  margin-bottom: 18px;
  padding: 0 36rpx;
}

.dialog__content--text {
  color: #888;
  font-size: 30rpx;
  padding: 0 36rpx 30rpx;
  text-align: center;
}

.log_wrap {
  padding-bottom: 40rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}

.log_wrap--log {
  width: 85rpx;
  height: 85rpx;
  border-radius: 50%;

  background-size: cover;
}

.log_wrap--text {
  margin-left: 15rpx;
  font-size: 32rpx;
}

.dialog__btns {
  width: 100%;
  height: 100rpx;
  border-top: 1px solid #e5e5e5;
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  font-size: 30rpx;
}

.dialog__btns--cancel {
  flex: 1;
  height: 100rpx;
  display: flex;
  align-items: center;
  color: #ccc;
  justify-content: center;
}
.getUserInfo_btn {
  flex: 1;
  padding: 0;
  margin: 0;
  height: 100rpx;
  line-height: 100rpx; 
  border-radius: none;
  border: 1px solid #0099ee;
  color: #fff;
  background-color:#0099ee;
  display: flex;
  font-size: 30rpx;
  align-items: center;
  justify-content: center;
}
</style>
