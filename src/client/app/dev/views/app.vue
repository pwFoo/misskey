<template>
<mk-ui>
	<p v-if="fetching">%i18n:common.loading%</p>
	<b-card v-if="!fetching" :header="app.name">
		<b-form-group label="App Secret">
			<b-input :value="app.secret" readonly/>
		</b-form-group>
	</b-card>
</mk-ui>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
	data() {
		return {
			fetching: true,
			app: null
		};
	},
	watch: {
		$route: 'fetch'
	},
	mounted() {
		this.fetch();
	},
	methods: {
		fetch() {
			this.fetching = true;
			(this as any).api('app/show', {
				appId: this.$route.params.id
			}).then(app => {
				this.app = app;
				this.fetching = false;
			});
		}
	}
});
</script>
