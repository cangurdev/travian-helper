chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "load") {
    const wrapper   = document.querySelector('#sidebarBeforeContent > .sidebarBoxWrapper');
    const container = document.querySelector('#travian_ultra_plus');
    const div       = document.createElement("div");

    div.id          = "travian_ultra_plus";

    div.innerHTML = `
                <div class='content sidebarBoxWrapper' id="openButtonContainer">
                  <button id="openButton">Aç</button>
                </div>
                <div id="contentContainer" class='content sidebarBoxWrapper' style="width:600px; display: none;">
                  <div style="display: flex; align-items: center; justify-content: space-between;">
                    <div id="heroArea" class="boxTitle"></div>
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
                      id    = "raid"
                      class = "layoutButton buttonFramed round market"
                      style = "padding:10px; color:#fff; margin-bottom 20px;"
                    >Yağma</button>
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
    findVillage();    

    document.getElementById('find').addEventListener('click', () => {
      findVillage();
    });

    document.getElementById('openButton').addEventListener('click', () => {
      openModal();
    });
    document.getElementById('closeButton').addEventListener('click', () => {
      closeModal();
    });

    document.getElementById('raid').addEventListener('click', () => {
      getRaidBounties();
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
  openButton.style.display = 'block';
}

function openModal() {
  const content = document.querySelector('#contentContainer');
  const openButton = document.querySelector('#openButtonContainer');

  content.style.position = 'absolute';
  content.style.zIndex = '99';
  content.style.bottom = '0';
  content.style.display = 'block';
  openButton.style.display = 'none';
}


async function findVillage() {
  const myX = -64;
  const myY = 29;

  sendReq().then(res => {
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

    let tileList = [];
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

        if (attrs.population?.includes("Fil")) {
          elephantList.push(model);
        } else {
          tileList.push(model);
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
          <td>${tile.distance.toFixed(1)}<br>${getTime(tile.distance)}</td>
        `)
    });

    createTable(theadInnerHtml, rowInnerHtml);
  }

  ).catch(err =>
    console.log(err)
  )
};

async function sendReq() {
  const currentUrl = document.location.href;
  const url = new URL(currentUrl);

  const myX = -64;
  const myY = 29;

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

function getTime(distance) {
  const time = distance / 19;
  const hours = Math.floor(time);
  const minutes = Math.floor(((time - hours) * 60));
  const seconds = Math.round((((time - hours) * 60) - minutes) * 60);

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(seconds).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

async function getRaidBounties() {
  const farmListIds = await getProfile();
  
  const results = await Promise.all(
    farmListIds.map( id => 
      fetch(`/api/v1/graphql`, {
        "headers": {
          "accept": "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9,tr;q=0.8",
          "content-type": "application/json; charset=UTF-8",
          "x-requested-with": "XMLHttpRequest",
          "x-version": "2546.3"
        },
        "referrer": `${document.location.host}/build.php?id=39&gid=16&tt=99`,
        "body": `{\"query\":\"query($id: Int!, $onlyExpanded: Boolean){bootstrapData{timestamp}weekendWarrior{isNightTruce}farmList(id: $id){id name slotsAmount runningRaidsAmount isExpanded sortIndex lastStartedTime sortField sortDirection useShip ownerVillage{id troops{ownTroopsAtTown{units{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}}}}defaultTroop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}slotStates: slots{id isActive}slots(onlyExpanded: $onlyExpanded){id target{id mapId x y name type population}troop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}distance isActive isRunning runningAttacks nextAttackAt lastRaid{reportId authKey time booty{resourceType{id code}amount}bootyMax icon}totalBooty{booty raids}}}}\",\"variables\":{\"id\":${id},\"onlyExpanded\":false}}`,
        "method": "POST",
        "credentials": "include"
      })
      .then(res => res.json())
      .then(response => {
        const sources = [0, 0, 0, 0];

        response.data.farmList.slots.forEach(slot => {
          sources.forEach((source, i) =>
            sources[i] = source + slot.lastRaid?.booty[i].amount || 0
          )
        });

        return {
          name: response.data.farmList.name,
          sources
        };
      })
  ));

  const rowInnerHtml = [];

  for (let i = 0; i < farmListIds.length; i++) {
    rowInnerHtml.push(`
        <td>${results[i].name}</td>
        <td>${results[i].sources[0]}</td>
        <td>${results[i].sources[1]}</td>
        <td>${results[i].sources[2]}</td>
        <td>${results[i].sources[3]}</td>
      `);
  }
  
  const theadInnerHtml = `
          <tr>
            <th>Liste</th>
            <th>Odun</th>
            <th>Tuğla</th>
            <th>Demir</th>
            <th>Tahıl</th>
          </tr>
        `;

  createTable(theadInnerHtml, rowInnerHtml);
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

async function getProfile() {
  const response = await fetch(`/api/v1/graphql`, {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,tr;q=0.8",
      "content-type": "application/json; charset=UTF-8",
      "x-requested-with": "XMLHttpRequest",
      "x-version": "2546.3"
    },
    "referrer": `${document.location.host}/build.php?id=39&gid=16`,
    "body": "{\"query\":\"query($onlyExpanded: Boolean){bootstrapData{timestamp}weekendWarrior{isNightTruce}ownPlayer{isSitter isInVacationMode beginnersProtection accessRights{sendRaids}banInfo{type}village{id tribeId}villages{id name hasRallyPoint hasHarbour tribeId}abandonedFarmLists{id name slotsAmount runningRaidsAmount isExpanded sortIndex lastStartedTime sortField sortDirection useShip ownerVillage{id}defaultTroop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}slotStates: slots{id isActive}slots(onlyExpanded: $onlyExpanded){id target{id mapId x y name type population}troop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}distance isActive isRunning runningAttacks nextAttackAt lastRaid{reportId authKey time booty{resourceType{id code}amount}bootyMax icon}totalBooty{booty raids}}}farmLists{id name slotsAmount runningRaidsAmount isExpanded sortIndex lastStartedTime sortField sortDirection useShip ownerVillage{id troops{ownTroopsAtTown{units{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}}}}defaultTroop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}slotStates: slots{id isActive}slots(onlyExpanded: $onlyExpanded){id target{id mapId x y name type population}troop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}distance isActive isRunning runningAttacks nextAttackAt lastRaid{reportId authKey time booty{resourceType{id code}amount}bootyMax icon}totalBooty{booty raids}}}deactivatedFarmListTargets{id mapId x y name type}}}\",\"variables\":{\"onlyExpanded\":true}}",
    "method": "POST",
    "credentials": "include"
  })

  const data = await response.json();

  return data.data.ownPlayer.farmLists.map(farm => farm.id);
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
          const myX = -64;
          const myY = 29;

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
