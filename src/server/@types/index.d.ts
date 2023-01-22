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
	interface PlayerDelay {
		[playerId: number]: {
			delay: number;
			delayExpire: Date;
		}
	}

	interface Mp {

		game: any;
	}
}

export {};
