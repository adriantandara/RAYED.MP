declare global {
	interface PlayerMp {
		logged: boolean;
		registred: boolean;

		username: string;
		skin: string;

		loginTimeout: NodeJS.Timeout;

		sqlID: number;
		admin: number;
		money: number;
		bank: number;
	}

	interface Mp {

		game: any;
	}
}

export {};
