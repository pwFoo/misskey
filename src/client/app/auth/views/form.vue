<template>
<div class="form">
	<header>
		<h1>%i18n:@share-access%</h1>
		<img :src="app.iconUrl"/>
	</header>
	<div class="app">
		<section>
			<h2>{{ app.name }}</h2>
			<p class="id">{{ app.id }}</p>
			<p class="description">{{ app.description }}</p>
		</section>
		<section>
			<h2>%i18n:@permission-ask%</h2>
			<ul>
				<template v-for="p in app.permission">
					<li v-if="p == 'account-read'">%i18n:@account-read%</li>
					<li v-if="p == 'account-write'">%i18n:@account-write%</li>
					<li v-if="p == 'note-write'">%i18n:@note-write%</li>
					<li v-if="p == 'like-write'">%i18n:@like-write%</li>
					<li v-if="p == 'following-write'">%i18n:@following-write%</li>
					<li v-if="p == 'drive-read'">%i18n:@drive-read%</li>
					<li v-if="p == 'drive-write'">%i18n:@drive-write%</li>
					<li v-if="p == 'notification-read'">%i18n:@notification-read%</li>
					<li v-if="p == 'notification-write'">%i18n:@notification-write%</li>
				</template>
			</ul>
		</section>
	</div>
	<div class="action">
		<button @click="cancel">%i18n:@cancel%</button>
		<button @click="accept">%i18n:@accept%</button>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	props: ['session'],
	computed: {
		app(): any {
			return this.session.app;
		}
	},
	methods: {
		cancel() {
			(this as any).api('auth/deny', {
				token: this.session.token
			}).then(() => {
				this.$emit('denied');
			});
		},

		accept() {
			(this as any).api('auth/accept', {
				token: this.session.token
			}).then(() => {
				this.$emit('accepted');
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.form

	> header
		> h1
			margin 0
			padding 32px 32px 20px 32px
			font-size 24px
			font-weight normal
			color #777

			i
				color #77aeca

				&:before
					content '「'

				&:after
					content '」'

			b
				color #666

		> img
			display block
			z-index 1
			width 84px
			height 84px
			margin 0 auto -38px auto
			border solid 5px #fff
			border-radius 100%
			box-shadow 0 2px 2px rgba(#000, 0.1)

	> .app
		padding 44px 16px 0 16px
		color #555
		background #eee
		box-shadow 0 2px 2px rgba(#000, 0.1) inset

		&:after
			content ''
			display block
			clear both

		> section
			float left
			width 50%
			padding 8px
			text-align left

			> h2
				margin 0
				font-size 16px
				color #777

	> .action
		padding 16px

		> button
			margin 0 8px
			padding 0

	@media (max-width 600px)
		> header
			> img
				box-shadow none

		> .app
			box-shadow none

	@media (max-width 500px)
		> header
			> h1
				font-size 16px

</style>
