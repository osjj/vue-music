<template>
  <transition name="slide">
    <music-list :songs="songs" :title="singer.name" :bg-image="singer.avatar"></music-list>
  </transition>
</template>

<script type="text/escmascript">
import {mapGetters} from 'vuex'
import {ERR_OK}from 'api/config'
import {getSingerDetail} from 'api/singer'
import {createSong} from 'common/js/song'
import MusicList from 'components/music-list/music-list'
export default {
	name: 'singerDetail',
	computed: {
		...mapGetters([
			'singer'
		])
	},
	created() {
		this._getDetail(this.singer.id)
	},
	data() {
		return {
			songs: []
		}
	},
	methods: {
		_getDetail(id) {
			if (!this.singer.id) {
				this.$router.push({
					path: '/singer'
				})
			}
			getSingerDetail(id).then((res) => {
				if(res.code === ERR_OK) {
					this.songs = this._normalizeSinger(res.data.list)
					console.log(this.song)
				}
			})
		},
		_normalizeSinger(list) {
			let ret = []
			list.forEach((item) => {
				let {musicData} = item
				if (musicData.songid && musicData.albummid) {
					ret.push(createSong(musicData))
				}
			})
			return ret
		}
	},
	components: {
		MusicList
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  	.slide-enter-active, .slide-leave-active
   		transition: all 0.3s
 	.slide-enter, .slide-leave-to
    	transform: translate3d(100%, 0, 0)
</style>