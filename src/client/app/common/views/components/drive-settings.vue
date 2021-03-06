<template>
<ui-card>
	<div slot="title">%fa:cloud% %i18n:common.drive%</div>

	<section v-if="!fetching" class="juakhbxthdewydyreaphkepoxgxvfogn">
		<div class="meter"><div :style="meterStyle"></div></div>
		<p>%i18n:@max%: <b>{{ capacity | bytes }}</b> %i18n:@in-use%: <b>{{ usage | bytes }}</b></p>
	</section>

	<section>
		<header>%i18n:@stats%</header>
		<div ref="chart" style="margin-bottom: -16px; color: #000;"></div>
	</section>
</ui-card>
</template>

<script lang="ts">
import Vue from 'vue';
import * as tinycolor from 'tinycolor2';
import * as ApexCharts from 'apexcharts';

export default Vue.extend({
	data() {
		return {
			fetching: true,
			usage: null,
			capacity: null
		};
	},

	computed: {
		meterStyle(): any {
			return {
				width: `${this.usage / this.capacity * 100}%`,
				background: tinycolor({
					h: 180 - (this.usage / this.capacity * 180),
					s: 0.7,
					l: 0.5
				})
			};
		}
	},

	mounted() {
		(this as any).api('drive').then(info => {
			this.capacity = info.capacity;
			this.usage = info.usage;
			this.fetching = false;

			this.$nextTick(() => {
				this.renderChart();
			});
		});
	},

	methods: {
		renderChart() {
			(this as any).api('charts/user/drive', {
				userId: this.$store.state.i.id,
				span: 'day',
				limit: 21
			}).then(stats => {
				const addition = [];
				const deletion = [];

				const now = new Date();
				const y = now.getFullYear();
				const m = now.getMonth();
				const d = now.getDate();

				for (let i = 0; i < 21; i++) {
					const x = new Date(y, m, d - i);
					addition.push([
						x,
						stats.incSize[i]
					]);
					deletion.push([
						x,
						-stats.decSize[i]
					]);
				}

				const chart = new ApexCharts(this.$refs.chart, {
					chart: {
						type: 'bar',
						stacked: true,
						height: 150,
						zoom: {
							enabled: false
						}
					},
					plotOptions: {
						bar: {
							columnWidth: '90%',
							endingShape: 'rounded'
						}
					},
					grid: {
						clipMarkers: false,
						borderColor: 'rgba(0, 0, 0, 0.1)'
					},
					tooltip: {
						shared: true,
						intersect: false
					},
					dataLabels: {
						enabled: false
					},
					legend: {
						show: false
					},
					series: [{
						name: 'Additions',
						data: addition
					}, {
						name: 'Deletions',
						data: deletion
					}],
					xaxis: {
						type: 'datetime',
						labels: {
							style: {
								colors: tinycolor(getComputedStyle(document.documentElement).getPropertyValue('--text')).toRgbString()
							}
						},
						axisBorder: {
							color: 'rgba(0, 0, 0, 0.1)'
						},
						axisTicks: {
							color: 'rgba(0, 0, 0, 0.1)'
						},
						crosshairs: {
							width: 1,
							opacity: 1
						}
					},
					yaxis: {
						labels: {
							formatter: v => Vue.filter('bytes')(v, 0),
							style: {
								color: tinycolor(getComputedStyle(document.documentElement).getPropertyValue('--text')).toRgbString()
							}
						}
					}
				});

				chart.render();
			});
		}
	}
});
</script>

<style lang="stylus" scoped>
.juakhbxthdewydyreaphkepoxgxvfogn
	> .meter
		$size = 12px

		margin-bottom 16px
		background rgba(0, 0, 0, 0.1)
		border-radius ($size / 2)
		overflow hidden

		> div
			height $size
			border-radius ($size / 2)

	> p
		margin 0

</style>
