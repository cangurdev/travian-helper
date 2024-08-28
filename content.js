chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "load") {
        const wrapper = document.querySelector('#sidebarBeforeContent > .sidebarBoxWrapper');
        const div = document.createElement("div");
        div.id = "travina_ultra_plus";
        div.style.width = "600px";
        div.innerHTML = `
                <div class='content'>
                    <h3>Kardeşim Hoş Geldin</h3>
                    <button id="findElephant">Fil Bul</button>
                    <div id='table' style="max-height: 300px; overflow:auto"></div>
                </div>
            `;
        div.className = "sidebarBox";

        wrapper.appendChild(div);
        
        findVillage();

        document.getElementById('findElephant').addEventListener('click', () => {
            findElephant();
        });
    }
});

function updateTable(payload) {
    document.querySelector('#travina_ultra_plus > .content >#table').innerHTML = payload;
}

async function findVillage() {
    const resultDiv = document.createElement("div");
    
    const myX = -64;
    const myY = 29;
  
    sendReq().then( res => {
      const tiles = res.tiles;
      
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      
      thead.innerHTML = `
        <tr>
          <th>Köy</th>
          <th>Halk</th>
          <th>Nüfus</th>
          <th>ittifak</th>
          <th>Mesafe</th>
        </tr>
      `;
  
      let tileList = [];
  
      tiles?.forEach((tile) => {
        const attrs = extractAttrs(escapeHtml(tile.text), tile.did);
  
        if (attrs) {
          const distance = getDistance(myX, myY, tile.position.x, tile.position.y);
  
          tileList.push({
            name      : attrs.name,
            tribe     : attrs.tribe,
            population: attrs.population,
            clan      : attrs.clan,
            distance  : distance,
            x         : tile.position.x,
            y         : tile.position.y
          });
        }
      })
  
      tileList.sort(function(a, b) {
        return a.distance - b.distance;
      });
  
      tileList.forEach((tile) => {
        const row = document.createElement("tr");
  
        row.innerHTML = `
          <td><a 
            target="_blank" 
            href="https://ts8.x1.europe.travian.com/karte.php?x=${tile.x}&y=${tile.y}"
            title = (${tile.x}|${tile.y})
          >
            ${tile.name}
            </a></td>
          <td>${tile.tribe || ""}</td>
          <td>${tile.population}</td>
          <td>${tile.clan || ""}</td>
          <td>${tile.distance}</td>
        `;
        
        tbody.appendChild(row);
      });
      
      table.appendChild(thead);
      table.appendChild(tbody);
      
      resultDiv.appendChild(table);
  
      updateTable(resultDiv.innerHTML);
    }
      
    ).catch(err => 
        console.log(err)
    )
};
  
function findElephant() {
    const resultDiv = document.createElement("div");
    const myX       = -64;
    const myY       = 29;
  
    sendReq().then( res => {
      const tiles = res.tiles;
      const table = document.createElement("table");
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      
      thead.innerHTML = `
        <tr>
          <th>Koordinat</th>
          <th>Nüfus</th>
          <th>Mesafe</th>
        </tr>
      `;
   
      tiles?.forEach( tile => {
        const attrs = extractAttrs(escapeHtml(tile.text), tile.did);

        if (attrs?.population.includes("Fil")) {
          const distance = getDistance(myX, myY, tile.position.x, tile.position.y);
            
          const row = document.createElement("tr");

          row.innerHTML = `
            <td><a target="_blank" href="https://ts8.x1.europe.travian.com/karte.php?x=${tile.position.x}&y=${tile.position.y}"> ${tile.position.x}|${tile.position.y} </a></td>
            <td>${attrs.population}</td>
            <td>${distance}</td>
          `;
          
          tbody.appendChild(row);
        }
      });
      
      table.appendChild(thead);
      table.appendChild(tbody);
      
      resultDiv.appendChild(table);
      updateTable(resultDiv.innerHTML);
    }
      
    ).catch(err => 
        console.log(err)
    )
};
  
  async function sendReq() {
    const currentUrl = document.location.href;
    const url        = new URL(currentUrl);
  
    const myX = -64;
    const myY = 29;
  
    const zoom = 3;
    const x    = url.searchParams.get('x') || myX;
    const y    = url.searchParams.get('y') || myY;
  
    const obj = {
      data: {
        x              : parseInt(x),
        y              : parseInt(y),
        zoomLevel      : parseInt(zoom),
        ignorePositions: []
      }
    };
  
    const response = await fetch("https://ts8.x1.europe.travian.com/api/v1/map/position", {
      "headers": {
        "accept": "application/json, text/javascript, */*; q=0.01",
        "accept-language": "en-US,en;q=0.9,tr;q=0.8",
        "content-type": "application/json; charset=UTF-8",
        "priority": "u=1, i",
        "sec-ch-ua": "\"Not)A;Brand\";v=\"99\", \"Brave\";v=\"127\", \"Chromium\";v=\"127\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest",
        "x-version": "2531.7"
      },
      "referrer": `https://ts8.x1.europe.travian.com/karte.php?zoom=${zoom}&x=${x}&y=${y}`,
      "referrerPolicy": "strict-origin-when-cross-origin",
      "body": JSON.stringify(obj),
      "method": "POST",
      "mode": "cors",
      "credentials": "include"
    });
  
    const data = await response.json();
  
    return data;
  }
  
  function extractAttrs(str, did) {
    const nameMatch       = str.match(/{k\.spieler}\s*(\w+)/);
    const populationMatch = str.match(/{k\.einwohner}\s*(\d+)/);
    const clanMatch       = str.match(/{k\.allianz}\s*(\w+)/);
    const tribeMatch      = str.match(/k\.volk}\s*{(\w+).(\w+)}/);

    const animals = {
      u31: "Sıçan",
      u32: "Örümcek",
      u33: "Yılan",
      u34: "Yarasa",
      u35: "Yaban Domuzu",
      u36: "Kurt",
      u37: "Ayı",
      u38: "Timsah",
      u39: "Kaplan",
      u40: "Fil",
    };
  
    const tribes = {
      "v1": "Romalı",
      "v2": "Cermen",
      "v3": "Galyalı",
      "v4": "Doğa",
      "v5": "Natar",
    }

    if (did === -1) {
      const regex = /<i class="unit (u\d+)"><\/i><span class="value ">(\d+)<\/span>/g;
      let match;
      const unitValues = {};
      str = decodeHtmlEntities(str)
  
      while ((match = regex.exec(str)) !== null) {
        const unit = match[1];
        const value = parseInt(match[2]);
      
        if (unitValues[unit]) {
          unitValues[animals[unit]] += value;
        } else {
          unitValues[animals[unit]] = value;
        }
      }
    
      return {
        name      : "Boş Vaha",
        population: Object.keys(unitValues).map(x => unitValues[x] + " " + x).join("<br>")
      };
    }
  
    if (nameMatch && populationMatch) {
      const name       = nameMatch[1];
      const population = populationMatch[1];
      const clan       = clanMatch?.[1] || "";
      const tribeKey   = tribeMatch?.[2] || "";
  
      return {
        name,
        population,
        clan,
        tribe: tribes[tribeKey] || ""
      }
    } else {
      return null;
    }
  }
  
  function getDistance(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
  
    return Math.sqrt(dx * dx + dy * dy).toFixed(1);
  }
  
  function escapeHtml(html) {
    return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }
  
  function decodeHtmlEntities(encodedString) {
    const parser  = new DOMParser();
    const dom     = parser.parseFromString(encodedString, 'text/html');
  
    return dom.documentElement.textContent;
  }
