chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {    
    const paths = [
        "/dorf1.php", 
        "/karte.php", 
        "/dorf2.php"
    ];

    const url = new URL(tab.url);
    
    if (
        url.host.includes("travian.com")
        && changeInfo.status === 'complete'
        && paths.includes(url.pathname)
    ) {
        chrome.storage.local.get('toggleEnabled', function(data) {            
            if (data.toggleEnabled) {
                sendMessage("load");
            }
        });

        if (url.search.match(/\?x=\-*\d+&y=\-*\d+/) ) {
            sendMessage("profile");
        }

    }
});

function sendMessage(action) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action });
    });
}
