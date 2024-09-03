chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {    
    const paths = [
        "/dorf1.php", 
        "/karte.php", 
        "/dorf2.php"
    ];

    const url = new URL(tab.url);
        
    if (
        url.host === "ts8.x1.europe.travian.com" 
        && changeInfo.status === 'complete'
        && paths.includes(url.pathname)
    ) {
        chrome.storage.local.get('toggleEnabled', function(data) {            
            if (data.toggleEnabled) {
                load();
            }
        });
    }
});

function load() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "load" });
    });
}
