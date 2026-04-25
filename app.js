// assumes global sportData already exists

const sportListEl = document.getElementById("sportList");
const cardsContainer = document.getElementById("cardsContainer");
const detailsContainer = document.getElementById("detailsContainer");
const breadcrumbEl = document.getElementById("breadcrumb");
const searchInput = document.getElementById("searchInput");

let currentSport = null;
let currentItems = [];
let currentSelectedKey = null;

function init() {
  buildSportList();
  const firstSport = Object.keys(sportData)[0];
  if (firstSport) {
    selectSport(firstSport);
  }
  searchInput.addEventListener("input", handleSearch);
}

function buildSportList() {
  const sports = Object.keys(sportData);
  sports.forEach((sport) => {
    const li = document.createElement("li");
    li.textContent = sport.replace(/_/g, " ");
    li.addEventListener("click", () => selectSport(sport));
    li.dataset.sport = sport;
    sportListEl.appendChild(li);
  });
}

function selectSport(sportKey) {
  currentSport = sportKey;
  currentSelectedKey = null;
  highlightActiveSport();
  const entries = sportData[sportKey] || {};
  currentItems = Object.entries(entries);
  breadcrumbEl.textContent = sportKey.replace(/_/g, " ");
  renderCards(currentItems);
  clearDetails();
}

function highlightActiveSport() {
  [...sportListEl.children].forEach((li) => {
    li.classList.toggle("active", li.dataset.sport === currentSport);
  });
}

function renderCards(items) {
  cardsContainer.innerHTML = "";
  items.forEach(([key, obj]) => {
    const card = document.createElement("div");
    card.className = "card";
    card.addEventListener("click", () => showDetails(key, obj));

    const img = document.createElement("img");
    img.src = obj.logo || obj.photo || "";
    img.alt = key;

    const title = document.createElement("div");
    title.className = "card-title";
    title.textContent = key;

    const subtitle = document.createElement("div");
    subtitle.className = "card-subtitle";
    subtitle.textContent =
      obj.team ||
      obj.country ||
      obj.nationality ||
      obj.manufacturer ||
      obj.region ||
      "";

    const fact = document.createElement("div");
    fact.className = "card-fact";
    fact.textContent = obj.fact || "";

    card.appendChild(img);
    card.appendChild(title);
    if (subtitle.textContent) card.appendChild(subtitle);
    if (fact.textContent) card.appendChild(fact);

    cardsContainer.appendChild(card);
  });
}

function showDetails(key, obj) {
  currentSelectedKey = key;
  detailsContainer.classList.remove("hidden");
  detailsContainer.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = key;

  const img = document.createElement("img");
  img.src = obj.logo || obj.photo || "";
  img.alt = key;

  const meta = document.createElement("p");
  meta.innerHTML = buildMetaLine(obj);

  const info = document.createElement("p");
  info.textContent = obj.info || "";

  detailsContainer.appendChild(title);
  if (img.src) detailsContainer.appendChild(img);
  if (meta.textContent) detailsContainer.appendChild(meta);
  detailsContainer.appendChild(info);

  breadcrumbEl.textContent =
    currentSport.replace(/_/g, " ") + " › " + key;
}

function buildMetaLine(obj) {
  const parts = [];
  if (obj.country) parts.push(obj.country);
  if (obj.nationality) parts.push(obj.nationality);
  if (obj.team) parts.push(obj.team);
  if (obj.manufacturer) parts.push(obj.manufacturer);
  if (obj.stadium) parts.push(obj.stadium);
  if (obj.championships) parts.push(`Championships: ${obj.championships}`);
  if (obj.majors) parts.push(`Majors: ${obj.majors}`);
  if (obj.olympic_medals) parts.push(`Olympic medals: ${obj.olympic_medals}`);
  if (obj.grand_slams) parts.push(`Grand Slams: ${obj.grand_slams}`);
  return parts.join(" • ");
}

function clearDetails() {
  detailsContainer.classList.add("hidden");
  detailsContainer.innerHTML = "";
  breadcrumbEl.textContent = currentSport.replace(/_/g, " ");
}

function handleSearch(e) {
  const q = e.target.value.toLowerCase().trim();
  if (!currentSport) return;
  const entries = sportData[currentSport] || {};
  const filtered = Object.entries(entries).filter(([key, obj]) => {
    const haystack =
      key +
      " " +
      JSON.stringify(obj).toLowerCase();
    return haystack.toLowerCase().includes(q);
  });
  renderCards(filtered);
  clearDetails();
}

document.addEventListener("DOMContentLoaded", init);
