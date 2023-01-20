declare global {
	interface PlayerMp {
		logged: boolean;
		registred: boolean;

		username: string;
		
		sqlID: number;
	}
}

export {};
