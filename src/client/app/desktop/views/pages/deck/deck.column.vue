<template>
<div class="dnpfarvgbnfmyzbdquhhzyxcmstpdqzs" :class="{ naked, narrow, active, isStacked, draghover, dragging, dropready }"
		@dragover.prevent.stop="onDragover"
		@dragleave="onDragleave"
		@drop.prevent.stop="onDrop"
		v-hotkey="keymap">
	<header :class="{ indicate: count > 0 }"
			draggable="true"
			@click="goTop"
			@dragstart="onDragstart"
			@dragend="onDragend"
			@contextmenu.prevent.stop="onContextmenu">
		<button class="toggleActive" @click="toggleActive" v-if="isStacked">
			<template v-if="active">%fa:angle-up%</template>
			<template v-else>%fa:angle-down%</template>
		</button>
		<slot name="header"></slot>
		<span class="count" v-if="count > 0">({{ count }})</span>
		<button v-if="!isTemporaryColumn" class="menu" ref="menu" @click.stop="showMenu">%fa:caret-down%</button>
		<button v-else class="close" @click.stop="close">%fa:times%</button>
	</header>
	<div ref="body" v-show="active">
		<slot></slot>
	</div>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import Menu from '../../../../common/views/components/menu.vue';
import contextmenu from '../../../api/contextmenu';
import { countIf } from '../../../../../../prelude/array';

export default Vue.extend({
	props: {
		column: {
			type: Object,
			required: false,
			default: null
		},
		isStacked: {
			type: Boolean,
			required: false,
			default: false
		},
		name: {
			type: String,
			required: false
		},
		menu: {
			type: Array,
			required: false,
			default: null
		},
		naked: {
			type: Boolean,
			required: false,
			default: false
		},
		narrow: {
			type: Boolean,
			required: false,
			default: false
		}
	},

	computed: {
		isTemporaryColumn(): boolean {
			return this.column == null;
		},

		keymap(): any {
			return {
				'shift+up': () => this.$parent.$emit('parentFocus', 'up'),
				'shift+down': () => this.$parent.$emit('parentFocus', 'down'),
				'shift+left': () => this.$parent.$emit('parentFocus', 'left'),
				'shift+right': () => this.$parent.$emit('parentFocus', 'right'),
			};
		}
	},

	inject: {
		getColumnVm: { from: 'getColumnVm' }
	},

	data() {
		return {
			count: 0,
			active: true,
			dragging: false,
			draghover: false,
			dropready: false
		};
	},

	watch: {
		active(v) {
			if (v && this.isScrollTop()) {
				this.$emit('top');
			}
		},
		dragging(v) {
			this.$root.$emit(v ? 'deck.column.dragStart' : 'deck.column.dragEnd');
		}
	},

	provide() {
		return {
			column: this,
			isScrollTop: this.isScrollTop,
			count: v => this.count = v
		};
	},

	mounted() {
		this.$refs.body.addEventListener('scroll', this.onScroll, { passive: true });

		if (!this.isTemporaryColumn) {
			this.$root.$on('deck.column.dragStart', this.onOtherDragStart);
			this.$root.$on('deck.column.dragEnd', this.onOtherDragEnd);
		}
	},

	beforeDestroy() {
		this.$refs.body.removeEventListener('scroll', this.onScroll);

		if (!this.isTemporaryColumn) {
			this.$root.$off('deck.column.dragStart', this.onOtherDragStart);
			this.$root.$off('deck.column.dragEnd', this.onOtherDragEnd);
		}
	},

	methods: {
		onOtherDragStart() {
			this.dropready = true;
		},

		onOtherDragEnd() {
			this.dropready = false;
		},

		toggleActive() {
			if (!this.isStacked) return;
			const vms = this.$store.state.settings.deck.layout.find(ids => ids.indexOf(this.column.id) != -1).map(id => this.getColumnVm(id));
			if (this.active && countIf(vm => vm.$el.classList.contains('active'), vms) == 1) return;
			this.active = !this.active;
		},

		isScrollTop() {
			return this.active && this.$refs.body.scrollTop == 0;
		},

		onScroll() {
			if (this.isScrollTop()) {
				this.$emit('top');
			}

			if (this.$store.state.settings.fetchOnScroll !== false) {
				const current = this.$refs.body.scrollTop + this.$refs.body.clientHeight;
				if (current > this.$refs.body.scrollHeight - 1) this.$emit('bottom');
			}
		},

		getMenu() {
			const items = [{
				icon: '%fa:pencil-alt%',
				text: '%i18n:common.deck.rename%',
				action: () => {
					(this as any).apis.input({
						title: '%i18n:common.deck.rename%',
						default: this.name,
						allowEmpty: false
					}).then(name => {
						this.$store.dispatch('settings/renameDeckColumn', { id: this.column.id, name });
					});
				}
			}, null, {
				icon: '%fa:arrow-left%',
				text: '%i18n:common.deck.swap-left%',
				action: () => {
					this.$store.dispatch('settings/swapLeftDeckColumn', this.column.id);
				}
			}, {
				icon: '%fa:arrow-right%',
				text: '%i18n:common.deck.swap-right%',
				action: () => {
					this.$store.dispatch('settings/swapRightDeckColumn', this.column.id);
				}
			}, this.isStacked ? {
				icon: '%fa:arrow-up%',
				text: '%i18n:common.deck.swap-up%',
				action: () => {
					this.$store.dispatch('settings/swapUpDeckColumn', this.column.id);
				}
			} : undefined, this.isStacked ? {
				icon: '%fa:arrow-down%',
				text: '%i18n:common.deck.swap-down%',
				action: () => {
					this.$store.dispatch('settings/swapDownDeckColumn', this.column.id);
				}
			} : undefined, null, {
				icon: '%fa:window-restore R%',
				text: '%i18n:common.deck.stack-left%',
				action: () => {
					this.$store.dispatch('settings/stackLeftDeckColumn', this.column.id);
				}
			}, this.isStacked ? {
				icon: '%fa:window-maximize R%',
				text: '%i18n:common.deck.pop-right%',
				action: () => {
					this.$store.dispatch('settings/popRightDeckColumn', this.column.id);
				}
			} : undefined, null, {
				icon: '%fa:trash-alt R%',
				text: '%i18n:common.deck.remove%',
				action: () => {
					this.$store.dispatch('settings/removeDeckColumn', this.column.id);
				}
			}];

			if (this.menu) {
				items.unshift(null);
				this.menu.reverse().forEach(i => items.unshift(i));
			}

			return items;
		},

		onContextmenu(e) {
			if (this.isTemporaryColumn) return;
			contextmenu((this as any).os)(e, this.getMenu());
		},

		showMenu() {
			this.os.new(Menu, {
				source: this.$refs.menu,
				compact: false,
				items: this.getMenu()
			});
		},

		close() {
			this.$store.commit('device/set', {
				key: 'deckTemporaryColumn',
				value: null
			});
		},

		goTop() {
			this.$refs.body.scrollTo({
				top: 0,
				behavior: 'smooth'
			});
		},

		onDragstart(e) {
			// テンポラリカラムはドラッグさせない
			if (this.isTemporaryColumn) {
				e.preventDefault();
				return;
			}

			e.dataTransfer.effectAllowed = 'move';
			e.dataTransfer.setData('mk-deck-column', this.column.id);
			this.dragging = true;
		},

		onDragend(e) {
			this.dragging = false;
		},

		onDragover(e) {
			// テンポラリカラムにはドロップさせない
			if (this.isTemporaryColumn) {
				e.dataTransfer.dropEffect = 'none';
				return;
			}

			// 自分自身がドラッグされている場合
			if (this.dragging) {
				// 自分自身にはドロップさせない
				e.dataTransfer.dropEffect = 'none';
				return;
			}

			const isDeckColumn = e.dataTransfer.types[0] == 'mk-deck-column';

			e.dataTransfer.dropEffect = isDeckColumn ? 'move' : 'none';

			if (!this.dragging && isDeckColumn) this.draghover = true;
		},

		onDragleave() {
			this.draghover = false;
		},

		onDrop(e) {
			this.draghover = false;
			this.$root.$emit('deck.column.dragEnd');

			const id = e.dataTransfer.getData('mk-deck-column');
			if (id != null && id != '') {
				this.$store.dispatch('settings/swapDeckColumn', {
					a: this.column.id,
					b: id
				});
			}
		}
	}
});
</script>

<style lang="stylus" scoped>
.dnpfarvgbnfmyzbdquhhzyxcmstpdqzs
	$header-height = 42px

	width 330px
	min-width 330px
	height 100%
	background var(--face)
	border-radius var(--round)
	box-shadow var(--shadow)
	overflow hidden

	&.draghover
		box-shadow 0 0 0 2px var(--primaryAlpha08)

		&:after
			content ""
			display block
			position absolute
			z-index 1000
			top 0
			left 0
			width 100%
			height 100%
			background var(--primaryAlpha02)

	&.dragging
		box-shadow 0 0 0 2px var(--primaryAlpha04)

	&.dropready
		*
			pointer-events none

	&:not(.active)
		flex-basis $header-height
		min-height $header-height

	&:not(.isStacked).narrow
		width 285px
		min-width 285px

	&.naked
		background var(--deckAcrylicColumnBg)

		> header
			background transparent
			box-shadow none

			> button
				color var(--text)

	> header
		display flex
		z-index 2
		line-height $header-height
		padding 0 16px
		font-size 14px
		color var(--faceHeaderText)
		background var(--faceHeader)
		box-shadow 0 1px rgba(#000, 0.15)
		cursor pointer

		&, *
			user-select none

		*:not(button)
			pointer-events none

		&.indicate
			box-shadow 0 3px 0 0 var(--primary)

		> span
			[data-fa]
				margin-right 8px

		> .count
			margin-left 4px
			opacity 0.5

		> .toggleActive
		> .menu
		> .close
			padding 0
			width $header-height
			line-height $header-height
			font-size 16px
			color var(--faceTextButton)

			&:hover
				color var(--faceTextButtonHover)

			&:active
				color var(--faceTextButtonActive)

		> .toggleActive
			margin-left -16px

		> .menu
		> .close
			margin-left auto
			margin-right -16px

	> div
		height "calc(100% - %s)" % $header-height
		overflow auto
		overflow-x hidden

</style>
