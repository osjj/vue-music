<template>
	<scroll :data="data"
          class="listview" 
          ref="scroll" 
          :probe-type="probeType" 
          @scroll="scroll"
          :listenScroll:="listenScroll">
		<ul>
			<li v-for="group in data" class="list-group" ref="listGroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li v-for="item in group.items" class="list-group-item" @click="selectItem(item)">
						<img class="avatar" v-lazy="item.avatar">
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
    <div class="list-shortcut" @touchstart.stop.prevent="onShortcutTouchStart" @touchmove.stop.prevent="onShortcutTouchMove">
      <ul>
        <li class="item" v-for="(item, index) in shortcutList" :data-index="index" :class="{current:currentIndex === index}">{{item}}</li>
      </ul>
    </div>
    <div class="list-fixed" ref="fixed" v-show="fixedTitle">
      <h2 class="fixed-title">{{fixedTitle}}</h2>
    </div>
    <div class="loading-container" v-show="!data.length">
      <loading></loading>
    </div>
	</scroll>
</template>
<script type="text/ecmascript-6">
	import Scroll from 'base/scroll/scroll'
  import {getData} from 'common/js/dom.js'
   import Loading from 'base/loading/loading'
	export default {
		name: 'listview',
		props: {
			data: {
				type: Array,
				default: null
			}
		},
    created() {
      this.touch = {}
      this.probeType = 3
      this.listHeight = []
      this.listenScroll = true
    },
    data() {
      return {
        scrollY: -1,
        currentIndex: 0,
        diff: -1
      }
    },
		components: {
			Scroll,
      Loading
		},
    computed: {
      shortcutList() {
        return this.data.map((item) => {
          return item.title.substring(0, 1)
        })
      },
      fixedTitle() {
        if (this.scrollY > 0) {
          return ''
        }
        return this.data[this.currentIndex] ? this.data[this.currentIndex].title : ''
      }
    },
    methods: {
      onShortcutTouchStart(e) {
        let anchorIndex = getData(e.target, 'index')
        let firstTouch = e.touches[0]
        this.touch.pagey1 = firstTouch.pageY
        this.touch.index = anchorIndex
        this._scrollTo(anchorIndex)
      },
      onShortcutTouchMove(e) {
        let firstTouch = e.touches[0]
        this.touch.pagey2 = firstTouch.pageY
        let diffs = (this.touch.pagey2 - this.touch.pagey1) / 18 | 0
        let anchorIndex = parseInt(this.touch.index) + diffs
        this._scrollTo(anchorIndex)
      },
      scroll(pos) {
        this.scrollY = pos.y
        // console.log(this.scrollY)
      },
      selectItem(item) {
        this.$emit('select', item)
      },
      _scrollTo(index) {
        if (!index && index !== 0) {
          return
        }
        if (index < 0) {
          index = 0
        } else if (index > this.listHeight.length - 2) {
          index = this.listHeight.length - 2
        }
        this.scrollY = -this.listHeight[index]
        this.$refs.scroll.scrollToElement(this.$refs.listGroup[index], 0)
      },
      _calculateHeight() {
        this.listHeight = []
        let height = 0
        this.listHeight.push(height)
        const list = this.$refs.listGroup
        for (let i = 0; i < list.length; i++) {
          let item = list[i]
          height += item.clientHeight
          this.listHeight.push(height)
      }
    }
  },
    watch: {
      data() {
        setTimeout(() => {
          this._calculateHeight()
        }, 20)
      },
      scrollY(scrollY) {
        let lightHeight = this.listHeight
        if (scrollY > 0) {
          this.currentIndex = 0
          return
        }
        for (let i = 0; i < lightHeight.length - 1; i++) {
          if ((-scrollY) >= lightHeight[i] && (-scrollY) < lightHeight[i + 1]) {
            this.currentIndex = i
            this.diff = lightHeight[i + 1] + scrollY
            return
          }
        }
        this.currentIndex = lightHeight.length - 2
      },
      diff(newVal) {
        let fixedTop = (newVal > 0 && newVal < 30) ? newVal - 30 : 0
        if (this.fixedTop === fixedTop) {
          return
        }
        this.fixedTop = fixedTop
        this.$refs.fixed.style.transform = `translate3d(0,${fixedTop}px,0)`
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>