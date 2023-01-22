if(mp.storage.data.timeStamp === undefined) mp.storage.data.timeStamp = false;
if(mp.storage.data.pageSize === undefined) mp.storage.data.pageSize = 15;
if(mp.storage.data.fontSize === undefined) mp.storage.data.fontSize = 10;

mp.gui.chat.show(false);
const chat = mp.browsers.new("package://@ui/chat/index.html");
chat.markAsChat();
chat.execute(`trigger('chatActive', false);`);
mp.keys.bind(0x54, true, function() {
    try {
        chat.execute(`trigger('showChat', true);`);
        
        mp.gui.cursor.show(true, true);
    } catch(e: any) {
        mp.console.logInfo(e, true, true);
    }
});
mp.events.add("showLoginChat", () => {
    chat.execute(`trigger('chatActive', true);`);
});
mp.events.add('hideChat', () => {
    mp.gui.cursor.show(false, false);
});
mp.events.add('updateChatTimestamp', x => mp.storage.data.timeStamp=x);
mp.events.add('updateChatFontsize', x => mp.storage.data.pageSize=x);
mp.events.add('updateChatPagesize', x => mp.storage.data.fontSize=x);
chat.execute(`trigger('chatData', {timestamp: ${mp.storage.data.timeStamp}, pagesize: ${mp.storage.data.pageSize}, fontsize: ${mp.storage.data.fontSize}});`);