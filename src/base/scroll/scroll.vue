<template>
  <div ref="wrapper">
  	<slot></slot>
  </div>
</template>

<script  type="text/ecmascript-6">
	import BScroll from 'better-scroll'
	export default {
		name: 'scroll',
		props: {
			probeType: {
				type: Number,
				default: 1
			},
			click: {
				type: Boolean,
				default: true
			},
			listenScroll: {
				type: Boolean,
				default: true
			},
			data: {
				type: Array,
				default: null
			}
		},
		mounted() {
			setTimeout(() => {
				this._scroll()
			}, 20)
		},
		methods: {
			_scroll() {
				if (!this.$refs.wrapper) {
					return
				}
				this.scroll = new BScroll(this.$refs.wrapper, {
					probeType: this.probeType,
					click: this.click
				})
				if (this.listenScroll) {
					let that = this
					this.scroll.on('scroll', (pos) => {
						that.$emit('scroll', pos)
					})
				}
			},
			refresh() {
				this.scroll && this.scroll.refresh()
				console.log(22)
			},
			disable() {
				this.scroll && this.scroll.disable()
			},
			enable() {
				this.scroll && this.scroll.enable()
			},
			scrollToElement() {
				this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
			},
			scrollTo() {
				this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
			}
		},
		watch: {
			data() {
				setTimeout(() => {
					this.refresh()
				}, 20)
			}
		}
	}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" rel="stylesheet/stylus" scoped>
</style>