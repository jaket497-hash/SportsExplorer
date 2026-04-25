const sportSelect = document.getElementById("sportSelect");
const teamSelect = document.getElementById("teamSelect");
const detailsContainer = document.getElementById("detailsContainer");
const searchInput = document.getElementById("searchInput");

function init() {
  loadSports();
  sportSelect.addEventListener("change", handleSportChange);
  teamSelect.addEventListener("change", handleTeamChange);
  searchInput.addEventListener("input", handleSearch);
}

function loadSports() {
  const sports = Object.keys(sportData);
  sports.forEach(sport => {
    const opt = document.createElement("option");
    opt.value = sport;
    opt.textContent = sport.replace(/_/g, " ");
    sportSelect.appendChild(opt);
  });
}

function handleSportChange() {
  const sport = sportSelect.value;
  teamSelect.innerHTML = `<option value="">Select a team/player...</option>`;
  detailsContainer.classList.add("hidden");

  if (!sport) {
    teamSelect.disabled = true;
    return;
  }

  const entries = Object.keys(sportData[sport]);
  entries.forEach(name => {
    const opt = document.createElement("option");
    opt.value = name;
    opt.textContent = name;
    teamSelect.appendChild(opt);
  });

  teamSelect.disabled = false;
}

function handleTeamChange() {
  const sport = sportSelect.value;
  const team = teamSelect.value;

  if (!team) {
    detailsContainer.classList.add("hidden");
    return;
  }

  const data = sportData[sport][team];
  showDetails(team, data);
}

function showDetails(name, obj) {
  detailsContainer.classList.remove("hidden");
  detailsContainer.innerHTML = `
    <h2>${name}</h2>
    <img src="${obj.logo || obj.photo || ""}" alt="${name}">
    <p><strong>Info:</strong> ${obj.info || ""}</p>
    <p><strong>Fact:</strong> ${obj.fact || ""}</p>
  `;
}

function handleSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  const sport = sportSelect.value;

  if (!sport) return;

  const entries = Object.entries(sportData[sport]);
  const match = entries.find(([name, obj]) =>
    name.toLowerCase().includes(q) ||
    JSON.stringify(obj).toLowerCase().includes(q)
  );

  if (match) {
    const [name, obj] = match;
    teamSelect.value = name;
    showDetails(name, obj);
  }
}

document.addEventListener("DOMContentLoaded", init);
