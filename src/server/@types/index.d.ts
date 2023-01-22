declare global {
	interface PlayerMp {
		logged: boolean;
		registred: boolean;

		username: string;
		loginTimeout: NodeJS.Timeout;
		sqlID: number;
		admin: number;
	}
}

export {};
