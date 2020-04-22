<script>
	import store from '@/store' //引入全局变量的token
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			let token = uni.getStorageSync('token');
			if (token) {
				let userInfo = uni.getStorageSync('userInfo');
				store.commit('updateToken', token);
				store.commit('setUserInfo', userInfo);
			}
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
	@import './common/uni.css';
	/*自定义公共样式*/
	@import './common/custom.css';
</style>
