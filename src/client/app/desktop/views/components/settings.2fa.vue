<template>
<div class="2fa">
	<p style="margin-top:0;">%i18n:@intro%<a href="%i18n:@url%" target="_blank">%i18n:@detail%</a></p>
	<ui-info warn>%i18n:@caution%</ui-info>
	<p v-if="!data && !$store.state.i.twoFactorEnabled"><ui-button @click="register">%i18n:@register%</ui-button></p>
	<template v-if="$store.state.i.twoFactorEnabled">
		<p>%i18n:@already-registered%</p>
		<ui-button @click="unregister">%i18n:@unregister%</ui-button>
	</template>
	<div v-if="data">
		<ol>
			<li>%i18n:@authenticator% <a href="https://support.google.com/accounts/answer/1066447" target="_blank">%i18n:@howtoinstall%</a></li>
			<li>%i18n:@scan%<br><img :src="data.qr"></li>
			<li>%i18n:@done%<br>
				<input type="number" v-model="token" class="ui">
				<ui-button primary @click="submit">%i18n:@submit%</ui-button>
			</li>
		</ol>
		<div class="ui info"><p>%fa:info-circle%%i18n:@info%</p></div>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';

export default Vue.extend({
	data() {
		return {
			data: null,
			token: null
		};
	},
	methods: {
		register() {
			(this as any).apis.input({
				title: '%i18n:@enter-password%',
				type: 'password'
			}).then(password => {
				(this as any).api('i/2fa/register', {
					password: password
				}).then(data => {
					this.data = data;
				});
			});
		},

		unregister() {
			(this as any).apis.input({
				title: '%i18n:@enter-password%',
				type: 'password'
			}).then(password => {
				(this as any).api('i/2fa/unregister', {
					password: password
				}).then(() => {
					(this as any).apis.notify('%i18n:@unregistered%');
					this.$store.state.i.twoFactorEnabled = false;
				});
			});
		},

		submit() {
			(this as any).api('i/2fa/done', {
				token: this.token
			}).then(() => {
				(this as any).apis.notify('%i18n:@success%');
				this.$store.state.i.twoFactorEnabled = true;
			}).catch(() => {
				(this as any).apis.notify('%i18n:@failed%');
			});
		}
	}
});
</script>
