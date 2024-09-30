chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "load") {
    const wrapper   = document.querySelector('#sidebarBeforeContent > .sidebarBoxWrapper');
    const container = document.querySelector('#travian_ultra_plus');
    const div       = document.createElement("div");

    div.id          = "travian_ultra_plus";
    const display = document.URL.includes("karte.php") ? "block" : "none";

    chrome.storage.local.get(['xCoordinate', 'yCoordinate'], function(result) {
      div.innerHTML = `
                  <div class='content sidebarBoxWrapper' id="openButtonContainer" style="display: flex; flex-direction: column; align-items: center;">
                    <div id="heroArea" class="boxTitle"></div>
                    <div class="buttonsWrapper">
                          <a class="layoutButton buttonFramed withIcon round market gold" href="/build.php?gid=17">
                                <svg viewBox="0 0 20.21 18" class="market"><g class="outline">
                        <path d="M17.12 7L17 3.43h1V2h-6V1h-1V0H9v1H8v1H2v1.43h1L2.92 6.9C1.89 7.47 0 8.71 0 10.14a3.58 3.58 0 1 0 7.15 0c0-1.47-2-2.74-3-3.29L4 3.43h5V15H8v1H6v1H5v1h10v-1h-1v-1h-2v-1h-1V3.43h5L15.9 7c-1 .54-3 1.81-3 3.29a3.67 3.67 0 0 0 3.75 3.5 3.75 3.75 0 0 0 3.57-3.57c-.01-1.49-2.07-2.66-3.1-3.22zm-3.58 3.2c0-1 1.59-1.85 2.46-2.24.32-.15.55-.23.55-.23s.26.1.63.27c.87.4 2.36 1.24 2.36 2.2 0 1.37-6 1.37-6 0zm-13 0C.53 9.21 2.11 8.35 3 8c.33-.15.55-.23.55-.23s.26.1.63.27c.88.4 2.37 1.24 2.37 2.2-.02 1.33-6.02 1.33-6.02-.04z"></path>
                      </g><g class="icon">
                        <path d="M17.12 7L17 3.43h1V2h-6V1h-1V0H9v1H8v1H2v1.43h1L2.92 6.9C1.89 7.47 0 8.71 0 10.14a3.58 3.58 0 1 0 7.15 0c0-1.47-2-2.74-3-3.29L4 3.43h5V15H8v1H6v1H5v1h10v-1h-1v-1h-2v-1h-1V3.43h5L15.9 7c-1 .54-3 1.81-3 3.29a3.67 3.67 0 0 0 3.75 3.5 3.75 3.75 0 0 0 3.57-3.57c-.01-1.49-2.07-2.66-3.1-3.22zm-3.58 3.2c0-1 1.59-1.85 2.46-2.24.32-.15.55-.23.55-.23s.26.1.63.27c.87.4 2.36 1.24 2.36 2.2 0 1.37-6 1.37-6 0zm-13 0C.53 9.21 2.11 8.35 3 8c.33-.15.55-.23.55-.23s.26.1.63.27c.88.4 2.37 1.24 2.37 2.2-.02 1.33-6.02 1.33-6.02-.04z"></path>
                      </g></svg>
                          </a>
                      <a class="layoutButton buttonFramed withIcon round barracks gold" href="build.php?gid=19">
                                <svg viewBox="0 0 18.46 20" class="barracks"><g class="outline">
                        <path d="M4.32 13.44l.88.56 3-2.51-1.88-1.42a7.16 7.16 0 0 0-2.81 1.25c-.21.48-1 2.74-1 2.74l-1.34.64 1.13-4.07.16-.63a5.27 5.27 0 0 1 10 3.29c-.17 1.14-.15 3 1.39 3.91l.39.32a3.79 3.79 0 0 1-2.05.71c-.82-.14-1.62-2.3-1.62-2.33a1.49 1.49 0 1 0-2.66 1 1.45 1.45 0 0 0 1.13.58A13.32 13.32 0 0 1 1.49 20zM0 1.14l3.93 4.51c1-.14 3.5-1 4.56-.76 4.63 1.2 6.51 5.46 5.41 10.51 1.37 1.17 0 0 3.12 3.15a24.7 24.7 0 0 0 1-3.15 13.83 13.83 0 0 0 .44-3.28L15.66 11l2.73-.34a12.59 12.59 0 0 0-1.8-5.36l-3.67 1.44 2.82-2.69A10.8 10.8 0 0 0 11.5.83l-2 3.43.75-3.86-.2-.06A10.61 10.61 0 0 0 6.14.07l.41 3.09L5.09.25A18.06 18.06 0 0 0 0 1.14z"></path>
                      </g><g class="icon">
                        <path d="M4.32 13.44l.88.56 3-2.51-1.88-1.42a7.16 7.16 0 0 0-2.81 1.25c-.21.48-1 2.74-1 2.74l-1.34.64 1.13-4.07.16-.63a5.27 5.27 0 0 1 10 3.29c-.17 1.14-.15 3 1.39 3.91l.39.32a3.79 3.79 0 0 1-2.05.71c-.82-.14-1.62-2.3-1.62-2.33a1.49 1.49 0 1 0-2.66 1 1.45 1.45 0 0 0 1.13.58A13.32 13.32 0 0 1 1.49 20zM0 1.14l3.93 4.51c1-.14 3.5-1 4.56-.76 4.63 1.2 6.51 5.46 5.41 10.51 1.37 1.17 0 0 3.12 3.15a24.7 24.7 0 0 0 1-3.15 13.83 13.83 0 0 0 .44-3.28L15.66 11l2.73-.34a12.59 12.59 0 0 0-1.8-5.36l-3.67 1.44 2.82-2.69A10.8 10.8 0 0 0 11.5.83l-2 3.43.75-3.86-.2-.06A10.61 10.61 0 0 0 6.14.07l.41 3.09L5.09.25A18.06 18.06 0 0 0 0 1.14z"></path>
                      </g></svg>
                          </a>
                      <a class="layoutButton buttonFramed withIcon round stable gold" href="build.php?gid=19">
                                <svg viewBox="0 0 19.07 20" class="stable"><g class="outline">
                        <path d="M0 13.31a.79.79 0 0 0 .38.69 2.06 2.06 0 0 0 2 1.66h.33a2 2 0 0 0 1.67-1.68A8.12 8.12 0 0 0 6.76 13c.88-.51 1.87-1.23 2-2 .48-1.78-1.69-2.77-1.59-2.89 2.19.76 2.29 2 2.09 4.17 0 .35-2.42 6.68-2.57 7.11 1.37.81 2.36.71 5.15.31 1.55-.58 3.58-2.36 4.82-3a24.9 24.9 0 0 0 1.15-2.92 10.38 10.38 0 0 0-.24-3.46v-.05a7.48 7.48 0 0 1 1.52.77c0-.05-1.72-2.45-2.08-3a11.18 11.18 0 0 0-.79-.95 8.33 8.33 0 0 0-2.33-1.51 16 16 0 0 1 1.64-.05c-.92-.51-1.08-.88-5.64-2.45a12.52 12.52 0 0 1-1.61-.53A5 5 0 0 0 6.63.29 1.82 1.82 0 0 0 5.6 0a17.54 17.54 0 0 1 .17 1.75c.05.8.08 1.53.08 1.53l-.15.16-.49-.28-1.63-.94a5.07 5.07 0 0 0 .78 2.55c-.34.28-.62.7-.87.65s-.93.72-.93.72c-.25.51.14 1.23.06 1.9A7.47 7.47 0 0 0 2 9.27a5.85 5.85 0 0 0-.39 1.44l-1 1.82a.8.8 0 0 0-.61.78zm7.47-9.49c.49.05 5.82 1.87 7.72 5.31a9 9 0 0 1 .81 6.92s-.66-4.38-1.8-6.22c-1.29-2.07-1.22-2-4.42-4.19-1.18-.82-2.21-1.8-2.31-1.82zM3.55 8c0-.48.23-1.37.71-1.37h.48c.33 0 .61.1.61.42a1.16 1.16 0 0 1-.54.85.93.93 0 0 1-.55.2c-.48-.04-.71.35-.71-.1z"></path>
                      </g><g class="icon">
                        <path d="M0 13.31a.79.79 0 0 0 .38.69 2.06 2.06 0 0 0 2 1.66h.33a2 2 0 0 0 1.67-1.68A8.12 8.12 0 0 0 6.76 13c.88-.51 1.87-1.23 2-2 .48-1.78-1.69-2.77-1.59-2.89 2.19.76 2.29 2 2.09 4.17 0 .35-2.42 6.68-2.57 7.11 1.37.81 2.36.71 5.15.31 1.55-.58 3.58-2.36 4.82-3a24.9 24.9 0 0 0 1.15-2.92 10.38 10.38 0 0 0-.24-3.46v-.05a7.48 7.48 0 0 1 1.52.77c0-.05-1.72-2.45-2.08-3a11.18 11.18 0 0 0-.79-.95 8.33 8.33 0 0 0-2.33-1.51 16 16 0 0 1 1.64-.05c-.92-.51-1.08-.88-5.64-2.45a12.52 12.52 0 0 1-1.61-.53A5 5 0 0 0 6.63.29 1.82 1.82 0 0 0 5.6 0a17.54 17.54 0 0 1 .17 1.75c.05.8.08 1.53.08 1.53l-.15.16-.49-.28-1.63-.94a5.07 5.07 0 0 0 .78 2.55c-.34.28-.62.7-.87.65s-.93.72-.93.72c-.25.51.14 1.23.06 1.9A7.47 7.47 0 0 0 2 9.27a5.85 5.85 0 0 0-.39 1.44l-1 1.82a.8.8 0 0 0-.61.78zm7.47-9.49c.49.05 5.82 1.87 7.72 5.31a9 9 0 0 1 .81 6.92s-.66-4.38-1.8-6.22c-1.29-2.07-1.22-2-4.42-4.19-1.18-.82-2.21-1.8-2.31-1.82zM3.55 8c0-.48.23-1.37.71-1.37h.48c.33 0 .61.1.61.42a1.16 1.16 0 0 1-.54.85.93.93 0 0 1-.55.2c-.48-.04-.71.35-.71-.1z"></path>
                      </g></svg>
                          </a>
                      <a class="layoutButton buttonFramed withIcon round workshop gold" href="build.php?gid=19">
                                <svg viewBox="0 0 20 18.8" class="workshop"><g class="outline">
                        <path d="M19.73 6l-.45-.22-2.77-.8.49-.43a1.45 1.45 0 0 0 0-2 1.3 1.3 0 0 0-1.9.06l-.48.6-.48-3-3.93.15.12 4.05L13 5l-1.75 2a14.68 14.68 0 0 0-4.32-1.53 3.58 3.58 0 0 0 .17-4.06C6.26.19 4.87-.42 2.71.33A12.12 12.12 0 0 1 4 1a3.11 3.11 0 0 1 1.12 1.29 3.82 3.82 0 0 1-.39 3A16.83 16.83 0 0 1 3 4.64 3.15 3.15 0 0 1 1.56 3.3a5.86 5.86 0 0 1-.69-2 4.42 4.42 0 0 0-.38 4.62 3.56 3.56 0 0 0 3.84 1.32 12 12 0 0 0 .46 6.93l-1.31 1.49a1.29 1.29 0 0 0 .12 1.81l.12.11a1.28 1.28 0 0 0 1.81-.12l.84-.95A12.12 12.12 0 0 0 9 18.8l1.66-1.13A16.33 16.33 0 0 1 8 14.62l1.3-1.45 2.32-2.6a9.7 9.7 0 0 1 .83 1 16.44 16.44 0 0 1 1.87 3.57L16 14.05a12.44 12.44 0 0 0-2-4.72 7.09 7.09 0 0 0-.59-.74l1.75-2 .8 2.87.24.46c.56.55 1.82.11 2.8-1s1.29-2.4.73-2.92zM7.82 10.72l-.6.67-.45.51a13.24 13.24 0 0 1-.53-4.66 13.15 13.15 0 0 1 3.29 1.58z"></path>
                      </g><g class="icon">
                        <path d="M19.73 6l-.45-.22-2.77-.8.49-.43a1.45 1.45 0 0 0 0-2 1.3 1.3 0 0 0-1.9.06l-.48.6-.48-3-3.93.15.12 4.05L13 5l-1.75 2a14.68 14.68 0 0 0-4.32-1.53 3.58 3.58 0 0 0 .17-4.06C6.26.19 4.87-.42 2.71.33A12.12 12.12 0 0 1 4 1a3.11 3.11 0 0 1 1.12 1.29 3.82 3.82 0 0 1-.39 3A16.83 16.83 0 0 1 3 4.64 3.15 3.15 0 0 1 1.56 3.3a5.86 5.86 0 0 1-.69-2 4.42 4.42 0 0 0-.38 4.62 3.56 3.56 0 0 0 3.84 1.32 12 12 0 0 0 .46 6.93l-1.31 1.49a1.29 1.29 0 0 0 .12 1.81l.12.11a1.28 1.28 0 0 0 1.81-.12l.84-.95A12.12 12.12 0 0 0 9 18.8l1.66-1.13A16.33 16.33 0 0 1 8 14.62l1.3-1.45 2.32-2.6a9.7 9.7 0 0 1 .83 1 16.44 16.44 0 0 1 1.87 3.57L16 14.05a12.44 12.44 0 0 0-2-4.72 7.09 7.09 0 0 0-.59-.74l1.75-2 .8 2.87.24.46c.56.55 1.82.11 2.8-1s1.29-2.4.73-2.92zM7.82 10.72l-.6.67-.45.51a13.24 13.24 0 0 1-.53-4.66 13.15 13.15 0 0 1 3.29 1.58z"></path>
                      </g></svg>
                          </a>
                      </div>
                    <button class="layoutButton buttonFramed round market" style="color: white; padding: 5px 20px; margin-top:20px;" id="openButton">Aç</button>
                    <div style="display: flex; visibility: hidden;">
                      <div id="tp-x">${result.xCoordinate}</div>
                      <div>|</div>
                      <div id="tp-y">${result.yCoordinate}</div>
                      </div>
                  </div>
                  <div id="contentContainer" class='content sidebarBoxWrapper' style="width:600px; display: ${display};">
                    <div style="display: flex; align-items: center; justify-content: end;">
                      <div id="closeButton" class="dialogCancelButton iconButton buttonFramed green withIcon rectangle cancel">
                              <svg viewBox="0 0 20 20"><g class="outline">
                            <path d="M0 17.01L7.01 10 .14 3.13 3.13.14 10 7.01 17.01 0 20 2.99 12.99 10l6.87 6.87-2.99 2.99L10 12.99 2.99 20 0 17.01z"></path>
                          </g><g class="icon">
                            <path d="M0 17.01L7.01 10 .14 3.13 3.13.14 10 7.01 17.01 0 20 2.99 12.99 10l6.87 6.87-2.99 2.99L10 12.99 2.99 20 0 17.01z"></path>
                          </g></svg>
                            </div>
                      </div>
                      <div 
                      id    = "content"
                      class = 'sidebarBox'
                      style = "width:100%; text-align:center;"
                    >
                      <button 
                        id    = "find"
                        class = "layoutButton buttonFramed round market"
                        style = "padding:10px; color:#fff; margin-bottom 20px;"
                      >Köyler</button>
                      <button 
                        id    = "findNature"
                        class = "layoutButton buttonFramed round market"
                        style = "padding:10px; color:#fff; margin-bottom 20px;"
                      >Vaha</button>
                      <div id='table' style="max-height: 300px; overflow:auto; margin-top:20px"></div>
                      </div>
                    </div>
                  </div>
              `;
      div.className = "sidebarBox";
      
      if (container) {
        container.innerHTML = div.innerHTML;
      } else {
        wrapper.appendChild(div);
      }
  
      getHeroInfo();
      findVillage(result.xCoordinate, result.yCoordinate, "nature");
  
      document.getElementById('find').addEventListener('click', () => {
        findVillage(result.xCoordinate, result.yCoordinate);
      });
  
      document.getElementById('openButton').addEventListener('click', () => {
        openModal();
      });
      document.getElementById('closeButton').addEventListener('click', () => {
        closeModal();
      });

      document.getElementById('findNature').addEventListener('click', () => {
        findVillage(result.xCoordinate, result.yCoordinate, "nature");
      });
    });
  }

  if (request.action === "profile") {
    getUserProfile();
  }
});

function updateTable(payload, location) {
  if (location)
    document.querySelector(location).appendChild(payload);
  else
    document.querySelector('#travian_ultra_plus > .content > #content > #table').innerHTML = payload.innerHTML;
}

function closeModal() {
  const content = document.querySelector('#contentContainer');
  const openButton = document.querySelector('#openButtonContainer');

  content.style.position = '';
  content.style.zIndex = '';
  content.style.bottom = '';
  content.style.display = 'none';
  openButton.style.display = 'flex';
}

function openModal() {
  const content = document.querySelector('#contentContainer');
  const openButton = document.querySelector('#openButtonContainer');

  content.style.zIndex = '99';
  content.style.bottom = '0';
  content.style.display = 'block';
  openButton.style.display = 'none';
}


async function findVillage(myX, myY, type) {
  sendReq(myX, myY).then(res => {
    const tiles = res.tiles;

    const theadInnerHtml = `
        <tr>
          <th>Köy</th>
          <th>Halk</th>
          <th>Nüfus</th>
          <th>ittifak</th>
          <th>Mesafe</th>
        </tr>
      `;

    let tileList     = [];
    let elephantList = [];

    tiles?.forEach((tile) => {
      const attrs = extractAttrs(escapeHtml(tile.text), tile.did);

      if (attrs) {
        const distance = getDistance(myX, myY, tile.position.x, tile.position.y);

        const model = {
          name: attrs.name,
          tribe: attrs.tribe,
          population: attrs.population,
          clan: attrs.clan,
          distance: distance,
          x: tile.position.x,
          y: tile.position.y
        }
        const isNature = attrs.tribe?.includes("Doğa");

        if (type !== "nature" && !isNature) {
          tileList.push(model);
        } else if (type === "nature" && isNature) {
          (attrs.population?.includes("Fil") ? elephantList : tileList).push(model);
        }
      }
    })

    tileList.sort(function (a, b) {
      return a.distance - b.distance;
    });

    const list = elephantList.concat(tileList);
    const rowInnerHtml = [];

    list.forEach((tile) => {
      rowInnerHtml.push(`
          <td><a 
            target="_blank" 
            href="/karte.php?x=${tile.x}&y=${tile.y}"
            title = (${tile.x}|${tile.y})
          >
            ${tile.name}
            </a></td>
          <td>${tile.tribe || ""}</td>
          <td>${tile.population}</td>
          <td>${tile.clan || ""}</td>
          <td>${tile.distance.toFixed(1)}</td>
        `)
    });

    createTable(theadInnerHtml, rowInnerHtml);
  }

  ).catch(err =>
    console.log(err)
  )
};

async function sendReq(myX, myY) {
  const currentUrl = document.location.href;
  const url = new URL(currentUrl);

  const zoom = 3;
  const x = url.searchParams.get('x') || myX;
  const y = url.searchParams.get('y') || myY;

  const obj = {
    data: {
      x: parseInt(x),
      y: parseInt(y),
      zoomLevel: parseInt(zoom),
      ignorePositions: []
    }
  };

  const response = await fetch(`/api/v1/map/position`, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,tr;q=0.8",
      "content-type": "application/json; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      "x-version": "2531.7",
    },
    "referrer": `${document.location.host}/karte.php?zoom=${zoom}&x=${x}&y=${y}`,
    "body": JSON.stringify(obj),
    "method": "POST",
    "credentials": "include"
  });

  const data = await response.json();

  return data;
}

function extractAttrs(str, did) {
  const nameMatch = str.match(/{k\.spieler}\s*(\w+)/);
  const populationMatch = str.match(/{k\.einwohner}\s*(\d+)/);
  const clanMatch = str.match(/{k\.allianz}\s*(\w+)/);
  const tribeMatch = str.match(/k\.volk}\s*{(\w+).(\w+)}/);

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
    "v6": "Mısırlı",
    "v7": "Hun",
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
      name: "Boş Vaha",
      tribe: "Doğa",
      population: Object.keys(unitValues).map(x => unitValues[x] + " " + x).join("<br>")
    };
  }

  if (nameMatch && populationMatch) {
    const name = nameMatch[1];
    const population = populationMatch[1];
    const clan = clanMatch?.[1] || "";
    const tribeKey = tribeMatch?.[2] || "";

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

  return Math.sqrt(dx * dx + dy * dy);
}

function escapeHtml(html) {
  return html.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function decodeHtmlEntities(encodedString) {
  const parser = new DOMParser();
  const dom = parser.parseFromString(encodedString, 'text/html');

  return dom.documentElement.textContent;
}

function createTable(theadInnerHtml, rowInnerHtml, location) {
  const resultDiv = document.createElement("div");
  const table = document.createElement("table");
  const thead = document.createElement("thead");
  const tbody = document.createElement("tbody");

  thead.innerHTML = theadInnerHtml;

  rowInnerHtml.forEach((row) => {
    const trow = document.createElement("tr");

    trow.innerHTML = row;
    tbody.appendChild(trow);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  resultDiv.appendChild(table);

  updateTable(resultDiv, location);
}

async function getHeroInfo() {
  const response = await fetch(`/api/v1/hero/dataForHUD`, {
    "headers": {
      "accept": "application/json",
      "content-type": "application/json",
      "x-requested-with": "XMLHttpRequest",
      "x-version": "2546.3"
    },
    "referrer": `${document.location.host}/karte.php?zoom=1&x=-61&y=24`,
    "method": "GET",
    "credentials": "include"
  });

  const data       = await response.json();
  const health     = data.health;
  const experience = data.tooltipForExperience.split("Kahramanın")[1].split("tecrübeye")[0].trim();
  
  document.querySelector("#heroArea").innerHTML = `Deneyim: ${experience} | Sağlık: ${health}`;
}

async function getUserProfile() {
  const url = document.querySelector(".player > a")?.href;
  
  if (!url)
      return;

  fetch(url)
  .then(response => response.text())
  .then(html => {
    // Create a DOMParser instance to parse the HTML string
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Select the <script> tag that contains the desired data
    const scriptTag = [...doc.querySelectorAll('script')].find(script => script.textContent.includes('Travian.React.PlayerProfile.render'));

    if (scriptTag) {
      // Extract the content of the script
      const scriptContent = scriptTag.textContent;

      // Use regex to extract the JSON string for `viewData`
      const viewDataMatch = scriptContent.match(/viewData:\s*({[\s\S]*}),\s*playerId/);

      if (viewDataMatch && viewDataMatch[1]) {
        const viewDataString = viewDataMatch[1];

        try {
          // Parse the JSON string
          const viewData = JSON.parse(viewDataString);

          // Example: Accessing some data
          const villages = viewData.data.player.villages;
          document.querySelector("#tileDetails")
          const myX = document.getElementById('tp-x');
          const myY = document.getElementById('tp-y');

          const rowInnerHtml = villages.map( village => `
                <td>${village.name}</td>
                <td>${village.population}</td>
                <td><a 
                  target="_blank" 
                  href="/karte.php?x=${village.x}&y=${village.y}"
                  title = (${village.x}|${village.y})
                >
                  (${village.x}|${village.y}) |
                  ${getDistance(myX, myY,village.x,village.y).toFixed(1)}
                  </a></td>
            `)
          const theadInnerHtml = `
                  <tr>
                    <th>Köy</th>
                    <th>Nüfus</th>
                    <th>Koordinat</th>
                  </tr>
                `;
        
          createTable(theadInnerHtml, rowInnerHtml, "#tileDetails");

        } catch (error) {
          console.error("Failed to parse viewData JSON:", error);
        }
      }
    } else {
      console.error("Script tag with Travian.React.PlayerProfile.render not found.");
    }
  })
  .catch(error => console.error('Error fetching or parsing the page:', error)); 
}
