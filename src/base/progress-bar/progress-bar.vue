<template>
  <div class="progress-bar" ref="progressBar" @click="progressChange">
    <div class="bar-inner">
      <div class="progress" ref="progress"></div>
      <div class="progress-btn-wrapper" ref="progressBtn"
           @touchstart.prevent="progressTouchStart"
           @touchmove.prevent="progressTouchMove"
           @touchend="progressTouchEnd"
      >
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import {prefixStyle} from 'common/js/dom'
const transform = prefixStyle('transform')
const progressBtnWidth = 16
  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      }
    },
    created() {
      this.touch = {}
    },
    methods: {
      _set(offset) {
        this.$refs.progress.style.width = `${offset}px`
        this.$refs.progressBtn.style[transform] = `translate3d(${offset}px,0,0)`
      },
      progressTouchStart(e) {
        this.touch.initiated = true
        this.touch.startX = e.touches[0].pageX
        this.touch.left = this.$refs.progress.clientWidth
      },
      progressTouchMove(e) {
        if (!this.touch.initiated) {
          return
        }
        const deltaX = e.touches[0].pageX - this.touch.startX
        const offsetWidth = Math.min(this.$refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
        this._set(offsetWidth)
      },
      progressTouchEnd() {
        this.touch.initiated = false
        this._triggerPercent()
      },
      progressChange(e) {
        console.log(2121)
         const rect = this.$refs.progressBar.getBoundingClientRect()
         const offsetWidth = e.pageX - rect.left
         this._set(offsetWidth)
         this._triggerPercent()
      },
      _triggerPercent() {
        let percent = this.$refs.progress.clientWidth / (this.$refs.progressBar.clientWidth - progressBtnWidth)
        this.$emit('percentChange', percent)
      }
    },
    watch: {
      percent(newVal) {
        if (newVal >= 0 && !this.touch.initiated) {
          let offsetWidth = (this.$refs.progressBar.clientWidth - progressBtnWidth) * newVal
          this._set(offsetWidth)
        }
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>