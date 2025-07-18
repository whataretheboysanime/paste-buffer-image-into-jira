let domain, isExecute;

// Обработчик сообщений
chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
    try {        
        const [tab] = await chrome.tabs.query({ active: true });

        if(!tab) return;

        await chrome.storage.local.get(["domain"]).then((result) => {
            domain = result["domain"];
        });
        await chrome.storage.local.get(["is execute"]).then((result) => {
            isExecute = result["is execute"];
        });

        const data = {
            type: message,
            isExecute: Boolean(isExecute),
            domain: domain 
        };

        chrome.tabs.sendMessage(tab.id, data);
    } catch (error) {
        console.error('Ошибка в обработчике сообщений:', error);
    }
});