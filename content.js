chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "load") {
    const wrapper = document.querySelector('#sidebarBeforeContent > .sidebarBoxWrapper');
    const div     = document.createElement("div");

    div.id = "travina_ultra_plus";
    div.className = "sidebar";
    div.style.width = "600px";

    div.innerHTML = `
                <div class='content sidebarBoxWrapper' style= "margin-top: 220px">
                  <div 
                    id    = "content"
                    class = 'sidebarBox'
                    style = "width:100%; text-align:center"
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
            `;
    div.className = "sidebarBox";

    wrapper.appendChild(div);

    findVillage();

    document.getElementById('find').addEventListener('click', () => {
      findVillage();
    });

    document.getElementById('raid').addEventListener('click', () => {
      getRaidBounties();
    });
  }
});

function updateTable(payload) {
  document.querySelector('#travina_ultra_plus > .content > #content > #table').innerHTML = payload;
}

async function findVillage() {
  const resultDiv = document.createElement("div");

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
          name      : attrs.name,
          tribe     : attrs.tribe,
          population: attrs.population,
          clan      : attrs.clan,
          distance  : distance,
          x         : tile.position.x,
          y         : tile.position.y
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
            href="https://ts8.x1.europe.travian.com/karte.php?x=${tile.x}&y=${tile.y}"
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

async function getRaidBounties(){
  const farmListId = await getProfile();

  fetch("https://ts8.x1.europe.travian.com/api/v1/graphql", {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,tr;q=0.8",
      "content-type": "application/json; charset=UTF-8",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Brave\";v=\"128\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest",
      "x-version": "2546.3"
    },
    "referrer": "https://ts8.x1.europe.travian.com/build.php?id=39&gid=16&tt=99",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": `{\"query\":\"query($id: Int!, $onlyExpanded: Boolean){bootstrapData{timestamp}weekendWarrior{isNightTruce}farmList(id: $id){id name slotsAmount runningRaidsAmount isExpanded sortIndex lastStartedTime sortField sortDirection useShip ownerVillage{id troops{ownTroopsAtTown{units{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}}}}defaultTroop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}slotStates: slots{id isActive}slots(onlyExpanded: $onlyExpanded){id target{id mapId x y name type population}troop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}distance isActive isRunning runningAttacks nextAttackAt lastRaid{reportId authKey time booty{resourceType{id code}amount}bootyMax icon}totalBooty{booty raids}}}}\",\"variables\":{\"id\":${farmListId},\"onlyExpanded\":false}}`,
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  }).then( res => res.json())
    .then( response => {
      const sources = [0, 0, 0, 0];

      response.data.farmList.slots.forEach( slot => {
        sources.forEach( (source, i) => 
          sources[i] = source + slot.lastRaid.booty[i].amount
        )
      });

      const theadInnerHtml = `
          <tr>
            <th>Odun</th>
            <th>Tuğla</th>
            <th>Demir</th>
            <th>Tahıl</th>
          </tr>
        `;

      const rowInnerHtml = [`
            <td>${sources[0]}</td>
            <td>${sources[1]}</td>
            <td>${sources[2]}</td>
            <td>${sources[3]}</td>
          `];

      createTable(theadInnerHtml, rowInnerHtml);
    });
}

function createTable(theadInnerHtml, rowInnerHtml) {
  const resultDiv = document.createElement("div");
  const table     = document.createElement("table");
  const thead     = document.createElement("thead");
  const tbody     = document.createElement("tbody");

  thead.innerHTML = theadInnerHtml;

  rowInnerHtml.forEach( (row) => {
    const trow = document.createElement("tr");
    
    trow.innerHTML = row;
    tbody.appendChild(trow);
  });

  table.appendChild(thead);
  table.appendChild(tbody);

  resultDiv.appendChild(table);

  updateTable(resultDiv.innerHTML);
}

async function getProfile() {
  const response = await fetch("https://ts8.x1.europe.travian.com/api/v1/graphql", {
    "headers": {
      "accept": "application/json, text/javascript, */*; q=0.01",
      "accept-language": "en-US,en;q=0.9,tr;q=0.8",
      "content-type": "application/json; charset=UTF-8",
      "priority": "u=1, i",
      "sec-ch-ua": "\"Chromium\";v=\"128\", \"Not;A=Brand\";v=\"24\", \"Brave\";v=\"128\"",
      "sec-ch-ua-mobile": "?0",
      "sec-ch-ua-platform": "\"macOS\"",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
      "sec-gpc": "1",
      "x-requested-with": "XMLHttpRequest",
      "x-version": "2546.3"
    },
    "referrer": "https://ts8.x1.europe.travian.com/build.php?id=39&gid=16",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"query\":\"query($onlyExpanded: Boolean){bootstrapData{timestamp}weekendWarrior{isNightTruce}ownPlayer{isSitter isInVacationMode beginnersProtection accessRights{sendRaids}banInfo{type}village{id tribeId}villages{id name hasRallyPoint hasHarbour tribeId}abandonedFarmLists{id name slotsAmount runningRaidsAmount isExpanded sortIndex lastStartedTime sortField sortDirection useShip ownerVillage{id}defaultTroop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}slotStates: slots{id isActive}slots(onlyExpanded: $onlyExpanded){id target{id mapId x y name type population}troop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}distance isActive isRunning runningAttacks nextAttackAt lastRaid{reportId authKey time booty{resourceType{id code}amount}bootyMax icon}totalBooty{booty raids}}}farmLists{id name slotsAmount runningRaidsAmount isExpanded sortIndex lastStartedTime sortField sortDirection useShip ownerVillage{id troops{ownTroopsAtTown{units{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}}}}defaultTroop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}slotStates: slots{id isActive}slots(onlyExpanded: $onlyExpanded){id target{id mapId x y name type population}troop{t1 t2 t3 t4 t5 t6 t7 t8 t9 t10}distance isActive isRunning runningAttacks nextAttackAt lastRaid{reportId authKey time booty{resourceType{id code}amount}bootyMax icon}totalBooty{booty raids}}}deactivatedFarmListTargets{id mapId x y name type}}}\",\"variables\":{\"onlyExpanded\":true}}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
  })

  const data = await response.json();

  return data.data.ownPlayer.farmLists[0].id;
}
