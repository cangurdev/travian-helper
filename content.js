chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "load") {
        const wrapper = document.querySelector('#sidebarAfterContent > .sidebarBoxWrapper');
        const div = document.createElement("div");
        div.id = "travina_ultra_plus";
        div.style.width = "400px";
        div.innerHTML = `
                <div class='content'>
                    <h3>Kardeşim Hoş Geldin</h3>
                    <div id='table' style="max-height: 300px; overflow:auto"></div>
                </div>
            `;
        div.className = "sidebarBox";

        wrapper.appendChild(div);
    }

    if (request.action === "updateTable") {
        document.querySelector('#travina_ultra_plus > .content >#table').innerHTML = request.payload;
    }
});