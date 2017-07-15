<template>
  <div class="singer">
  	<listview :data="singerList" @select="selectSinger"></listview>
  	<router-view></router-view>
  </div>
</template>

<script type="text/ecmascript-6">
import {getSingerList} from 'api/singer'
import {ERR_OK} from 'api/config'
import Singer from 'common/js/singer'
import Listview from 'base/listview/listview'
import {mapMutations} from 'vuex'
const HOT_SINGER_LEN = 10
const HOT_NAME = '热门'
export default {
	name: 'singer',
	data() {
		return {
			singerList: []
		}
	},
	created() {
		this._getSingerList()
	},
	methods: {
		selectSinger(item) {
			this.$router.push({
				path: `/singer/${item.id}`
			})
			this.setSinger(item)
		},
		_getSingerList() {
			getSingerList().then((res) => {
				if (res.code === ERR_OK) {
					this.singerList = this._normalizeSinger(res.data.list)
					console.log(this._normalizeSinger(res.data.list))
				}
			})
		},
		_normalizeSinger(list) {
			let map = {
				hot: {
					title: HOT_NAME,
					items: []
				}
			}
			list.forEach((item, index) => {
				if (index < HOT_SINGER_LEN) {
					map.hot.items.push(new Singer({
						name: item.Fsinger_name,
						id: item.Fsinger_mid
					}))
				}
				let k = item.Findex
				if (!map[k]) {
					map[k] = {
						title: k,
						items: []
					}
				}
				map[k].items.push(new Singer({
					name: item.Fsinger_name,
					id: item.Fsinger_mid
				}))
			})
			// 处理成有序列表
			let ret = []
			let hot = []
			for (let key in map) {
				let val = map[key]
				if (val.title.match(/[a-zA-Z]/)) {
					ret.push(val)
				} else if (val.title === HOT_NAME) {
					hot.push(val)
				}
			}
			ret.sort((a, b) => {
				return a.title.charCodeAt(0) - b.title.charCodeAt(0)
			})
			return hot.concat(ret)
		},
		...mapMutations({
			setSinger: 'SET_SINGER'
		})
	},
	components: {
		Listview
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
	.singer
		position:fixed
		width:100%
		top:88px
		bottom:0px
</style>