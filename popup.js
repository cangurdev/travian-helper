document.addEventListener('DOMContentLoaded', () => {
  const toggleSwitch = document.getElementById('toggle-switch');
    
  chrome.storage.local.get(['toggleEnabled', 'xCoordinate', 'yCoordinate'], function(result) {
      if (result.toggleEnabled !== undefined) {
          toggleSwitch.checked = result.toggleEnabled;
      }
      if (result.toggleEnabled === true) {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          chrome.tabs.sendMessage(tabs[0].id, { action: "load" });
        });
      }

      document.getElementById('x-coordinate').value = result.xCoordinate || '';
      document.getElementById('y-coordinate').value = result.yCoordinate || '';
  });
 toggleSwitch.addEventListener('change', function(event) {    
    const isEnabled = event.target.checked;
    
    chrome.storage.local.set({ toggleEnabled: isEnabled }, function() {
        console.log('Toggle state saved:', isEnabled);
    });
  });

  document.getElementById('save-button').addEventListener('click', () => {
    const xCoordinate = document.getElementById('x-coordinate').value;
    const yCoordinate = document.getElementById('y-coordinate').value;
    
    chrome.storage.local.set({
      xCoordinate: xCoordinate,
      yCoordinate: yCoordinate
    }, () => {
      console.log('Settings saved');
    });
    });
});
