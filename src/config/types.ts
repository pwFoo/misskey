/**
 * ユーザーが設定する必要のある情報
 */
export type Source = {
	/**
	 * メンテナ情報
	 */
	maintainer: {
		/**
		 * メンテナの名前
		 */
		name: string;
		/**
		 * メンテナの連絡先(URLかmailto形式のURL)
		 */
		url: string;
		email?: string;
		repository_url?: string;
		feedback_url?: string;
	};
	languages?: string[];
	welcome_bg_url?: string;
	url: string;
	port: number;
	https?: { [x: string]: string };
	disableHsts?: boolean;
	mongodb: {
		host: string;
		port: number;
		db: string;
		user: string;
		pass: string;
	};
	redis: {
		host: string;
		port: number;
		pass: string;
	};
	elasticsearch: {
		host: string;
		port: number;
		pass: string;
	};
	recaptcha?: {
		site_key: string;
		secret_key: string;
	};

	localDriveCapacityMb: number;
	remoteDriveCapacityMb: number;
	preventCacheRemoteFiles: boolean;

	drive?: {
		storage: string;
		bucket?: string;
		prefix?: string;
		baseUrl?: string;
		config?: any;
	};

	/**
	 * ゴーストアカウントのID
	 */
	ghost?: string;

	proxy?: string;

	summalyProxy?: string;

	accesslog?: string;
	twitter?: {
		consumer_key: string;
		consumer_secret: string;
	};
	github?: {
		client_id: string;
		client_secret: string;
	};
	github_bot?: {
		hook_secret: string;
		username: string;
	};
	reversi_ai?: {
		id: string;
		i: string;
	};
	line_bot?: {
		channel_secret: string;
		channel_access_token: string;
	};
	analysis?: {
		mecab_command?: string;
	};

	/**
	 * Service Worker
	 */
	sw?: {
		public_key: string;
		private_key: string;
	};

	clusterLimit?: number;

	user_recommendation?: {
		external: boolean;
		engine: string;
		timeout: number;
	};

	maxNoteTextLength?: number;
};

/**
 * Misskeyが自動的に(ユーザーが設定した情報から推論して)設定する情報
 */
export type Mixin = {
	host: string;
	hostname: string;
	scheme: string;
	ws_scheme: string;
	api_url: string;
	ws_url: string;
	auth_url: string;
	docs_url: string;
	stats_url: string;
	status_url: string;
	dev_url: string;
	drive_url: string;
	user_agent: string;
};

export type Config = Source & Mixin;
