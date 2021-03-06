import $ from 'cafy';
import Meta from '../../../../models/meta';
import define from '../../define';

export const meta = {
	desc: {
		'ja-JP': 'インスタンスの設定を更新します。'
	},

	requireCredential: true,
	requireAdmin: true,

	params: {
		broadcasts: {
			validator: $.arr($.obj()).optional.nullable,
			desc: {
				'ja-JP': 'ブロードキャスト'
			}
		},

		disableRegistration: {
			validator: $.bool.optional.nullable,
			desc: {
				'ja-JP': '招待制か否か'
			}
		},

		disableLocalTimeline: {
			validator: $.bool.optional.nullable,
			desc: {
				'ja-JP': 'ローカルタイムライン(とソーシャルタイムライン)を無効にするか否か'
			}
		},

		hidedTags: {
			validator: $.arr($.str).optional.nullable,
			desc: {
				'ja-JP': '統計などで無視するハッシュタグ'
			}
		},

		bannerUrl: {
			validator: $.str.optional.nullable,
			desc: {
				'ja-JP': 'インスタンスのバナー画像URL'
			}
		},

		name: {
			validator: $.str.optional.nullable,
			desc: {
				'ja-JP': 'インスタンス名'
			}
		},

		description: {
			validator: $.str.optional.nullable,
			desc: {
				'ja-JP': 'インスタンスの紹介文'
			}
		},
	}
};

export default define(meta, (ps) => new Promise(async (res, rej) => {
	const set = {} as any;

	if (ps.broadcasts) {
		set.broadcasts = ps.broadcasts;
	}

	if (typeof ps.disableRegistration === 'boolean') {
		set.disableRegistration = ps.disableRegistration;
	}

	if (typeof ps.disableLocalTimeline === 'boolean') {
		set.disableLocalTimeline = ps.disableLocalTimeline;
	}

	if (Array.isArray(ps.hidedTags)) {
		set.hidedTags = ps.hidedTags;
	}

	if (ps.bannerUrl !== undefined) {
		set.bannerUrl = ps.bannerUrl;
	}

	if (ps.name !== undefined) {
		set.name = ps.name;
	}

	if (ps.description !== undefined) {
		set.description = ps.description;
	}

	await Meta.update({}, {
		$set: set
	}, { upsert: true });

	res();
}));
