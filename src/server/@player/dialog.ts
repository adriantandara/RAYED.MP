const SERVER_EVENT = {
    DIALOG_RESPONSE: "server::onDialogResponse",
    REQUEST_DIALOG: "onRequestDialog"
}

mp.events.addCommand("dialog", (player: PlayerMp, fullText: string, dialogType: any) => {
	player.call(SERVER_EVENT.REQUEST_DIALOG, [dialogType, 
        "test_dialog",
        "Caption",
        "informations",
        ["listitem1", "listitem2"],
        ["button1", "button2"],
    ]);
});

