document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggle-switch');
    
  chrome.storage.local.get(['toggleEnabled'], function(result) {
      if (result.toggleEnabled !== undefined) {
          toggleSwitch.checked = result.toggleEnabled;
      }
      if (result.toggleEnabled === true) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "load" });
        });
      }
  });

 toggleSwitch.addEventListener('change', function(event) {    
    const isEnabled = event.target.checked;
    
    chrome.storage.local.set({ toggleEnabled: isEnabled }, function() {
        console.log('Toggle state saved:', isEnabled);
    });
  });
});