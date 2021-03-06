<template>
<mk-window ref="window" is-modal width="800px" height="500px" @closed="destroyDom">
	<span slot="header">
		<span v-html="title" :class="$style.title"></span>
		<span :class="$style.count" v-if="multiple && files.length > 0">({{ files.length }}%i18n:@choose-file%)</span>
	</span>

	<mk-drive
		ref="browser"
		:class="$style.browser"
		:multiple="multiple"
		@selected="onSelected"
		@change-selection="onChangeSelection"
	/>
	<div :class="$style.footer">
		<button :class="$style.upload" title="%i18n:@upload%" @click="upload">%fa:upload%</button>
		<button :class="$style.cancel" @click="cancel">%i18n:@cancel%</button>
		<button :class="$style.ok" :disabled="multiple && files.length == 0" @click="ok">%i18n:@ok%</button>
	</div>
</mk-window>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	props: {
		multiple: {
			default: false
		},
		title: {
			default: '%fa:R file%%i18n:@choose-prompt%'
		}
	},
	data() {
		return {
			files: []
		};
	},
	methods: {
		onSelected(file) {
			this.files = [file];
			this.ok();
		},
		onChangeSelection(files) {
			this.files = files;
		},
		upload() {
			(this.$refs.browser as any).selectLocalFile();
		},
		ok() {
			this.$emit('selected', this.multiple ? this.files : this.files[0]);
			(this.$refs.window as any).close();
		},
		cancel() {
			(this.$refs.window as any).close();
		}
	}
});
</script>

<style lang="stylus" module>


.title
	> [data-fa]
		margin-right 4px

.count
	margin-left 8px
	opacity 0.7

.browser
	height calc(100% - 72px)

.footer
	height 72px
	background var(--primaryLighten95)

.upload
	display inline-block
	position absolute
	top 8px
	left 16px
	cursor pointer
	padding 0
	margin 8px 4px 0 0
	width 40px
	height 40px
	font-size 1em
	color var(--primaryAlpha05)
	background transparent
	outline none
	border solid 1px transparent
	border-radius 4px

	&:hover
		background transparent
		border-color var(--primaryAlpha03)

	&:active
		color var(--primaryAlpha06)
		background transparent
		border-color var(--primaryAlpha05)
		//box-shadow 0 2px 4px rgba(var(--primaryDarken50), 0.15) inset

	&:focus
		&:after
			content ""
			pointer-events none
			position absolute
			top -5px
			right -5px
			bottom -5px
			left -5px
			border 2px solid var(--primaryAlpha03)
			border-radius 8px

.ok
.cancel
	display block
	position absolute
	bottom 16px
	cursor pointer
	padding 0
	margin 0
	width 120px
	height 40px
	font-size 1em
	outline none
	border-radius 4px

	&:focus
		&:after
			content ""
			pointer-events none
			position absolute
			top -5px
			right -5px
			bottom -5px
			left -5px
			border 2px solid var(--primaryAlpha03)
			border-radius 8px

	&:disabled
		opacity 0.7
		cursor default

.ok
	right 16px
	color var(--primaryForeground)
	background linear-gradient(to bottom, var(--primaryLighten25) 0%, var(--primaryLighten10) 100%)
	border solid 1px var(--primaryLighten15)

	&:not(:disabled)
		font-weight bold

	&:hover:not(:disabled)
		background linear-gradient(to bottom, var(--primaryLighten8) 0%, var(--primaryDarken8) 100%)
		border-color var(--primary)

	&:active:not(:disabled)
		background var(--primary)
		border-color var(--primary)

.cancel
	right 148px
	color #888
	background linear-gradient(to bottom, #ffffff 0%, #f5f5f5 100%)
	border solid 1px #e2e2e2

	&:hover
		background linear-gradient(to bottom, #f9f9f9 0%, #ececec 100%)
		border-color #dcdcdc

	&:active
		background #ececec
		border-color #dcdcdc

</style>
