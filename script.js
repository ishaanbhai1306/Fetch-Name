/* ══════════════════════════════════════════════════════════
   PITCHBOARD — Premier League Team Explorer
   API: API-Football (v3.football.api-sports.io)
   League 39 = Premier League | Season 2023
══════════════════════════════════════════════════════════ */

/* ─── CONSTANTS ─────────────────────────────────────────── */
const API_BASE   = "https://v3.football.api-sports.io";
const LEAGUE_ID  = 39;   // Premier League
const SEASON     = 2023;
const PAGE_SIZE  = 9;    // teams per page

const STORAGE_KEYS = {
  API_KEY    : "pitchboard_api_key",
  FAVOURITES : "pitchboard_favourites",
  THEME      : "pitchboard_theme",
};

/* ─── DEMO DATA (fallback when no API key) ──────────────── */
const DEMO_TEAMS = [
  { id:42,  name:"Arsenal",              logo:"https://media.api-sports.io/football/teams/42.png",  country:"England", founded:1886, national:false, code:"ARS", venue:"Emirates Stadium",    city:"London",     address:"75 Drayton Park, Holloway",      capacity:60704, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/494.png" },
  { id:50,  name:"Manchester City",      logo:"https://media.api-sports.io/football/teams/50.png",  country:"England", founded:1880, national:false, code:"MCI", venue:"Etihad Stadium",      city:"Manchester", address:"SportCity",                      capacity:53400, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/508.png" },
  { id:40,  name:"Liverpool",            logo:"https://media.api-sports.io/football/teams/40.png",  country:"England", founded:1892, national:false, code:"LIV", venue:"Anfield",             city:"Liverpool",  address:"Anfield Road",                   capacity:53394, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/498.png" },
  { id:33,  name:"Manchester United",    logo:"https://media.api-sports.io/football/teams/33.png",  country:"England", founded:1878, national:false, code:"MUN", venue:"Old Trafford",        city:"Manchester", address:"Sir Matt Busby Way",              capacity:76212, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/491.png" },
  { id:49,  name:"Chelsea",              logo:"https://media.api-sports.io/football/teams/49.png",  country:"England", founded:1905, national:false, code:"CHE", venue:"Stamford Bridge",     city:"London",     address:"Fulham Road",                    capacity:40853, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/497.png" },
  { id:47,  name:"Tottenham Hotspur",    logo:"https://media.api-sports.io/football/teams/47.png",  country:"England", founded:1882, national:false, code:"TOT", venue:"Tottenham Hotspur Stadium", city:"London",address:"782 High Road",              capacity:62850, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/596.png" },
  { id:66,  name:"Aston Villa",          logo:"https://media.api-sports.io/football/teams/66.png",  country:"England", founded:1874, national:false, code:"AVL", venue:"Villa Park",          city:"Birmingham", address:"Trinity Road",                   capacity:42749, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/494.png" },
  { id:34,  name:"Newcastle United",     logo:"https://media.api-sports.io/football/teams/34.png",  country:"England", founded:1892, national:false, code:"NEW", venue:"St. James' Park",     city:"Newcastle",  address:"St. James' Park",                capacity:52305, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/503.png" },
  { id:51,  name:"Brighton",             logo:"https://media.api-sports.io/football/teams/51.png",  country:"England", founded:1901, national:false, code:"BHA", venue:"Amex Stadium",        city:"Brighton",   address:"Village Way",                    capacity:31876, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/517.png" },
  { id:35,  name:"Brentford",            logo:"https://media.api-sports.io/football/teams/35.png",  country:"England", founded:1889, national:false, code:"BRE", venue:"Gtech Community Stadium", city:"Brentford",address:"Lionel Road South",          capacity:17250, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/491.png" },
  { id:48,  name:"West Ham United",      logo:"https://media.api-sports.io/football/teams/48.png",  country:"England", founded:1895, national:false, code:"WHU", venue:"London Stadium",      city:"London",     address:"Queen Elizabeth Olympic Park",   capacity:62500, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/507.png" },
  { id:52,  name:"Crystal Palace",       logo:"https://media.api-sports.io/football/teams/52.png",  country:"England", founded:1905, national:false, code:"CRY", venue:"Selhurst Park",       city:"London",     address:"Holmesdale Road",                capacity:25486, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/497.png" },
  { id:45,  name:"Everton",              logo:"https://media.api-sports.io/football/teams/45.png",  country:"England", founded:1878, national:false, code:"EVE", venue:"Goodison Park",       city:"Liverpool",  address:"Goodison Road",                  capacity:39414, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/498.png" },
  { id:63,  name:"Fulham",               logo:"https://media.api-sports.io/football/teams/63.png",  country:"England", founded:1879, national:false, code:"FUL", venue:"Craven Cottage",      city:"London",     address:"Stevenage Road",                 capacity:25700, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/491.png" },
  { id:65,  name:"Wolverhampton",        logo:"https://media.api-sports.io/football/teams/65.png",  country:"England", founded:1877, national:false, code:"WOL", venue:"Molineux Stadium",    city:"Wolverhampton",address:"Waterloo Road",                capacity:32050, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/504.png" },
  { id:36,  name:"Bournemouth",          logo:"https://media.api-sports.io/football/teams/36.png",  country:"England", founded:1899, national:false, code:"BOU", venue:"Vitality Stadium",    city:"Bournemouth",address:"Dean Court",                     capacity:11307, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/491.png" },
  { id:55,  name:"Nottingham Forest",    logo:"https://media.api-sports.io/football/teams/55.png",  country:"England", founded:1865, national:false, code:"NFO", venue:"City Ground",         city:"Nottingham", address:"City Ground",                    capacity:30332, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/505.png" },
  { id:39,  name:"Burnley",              logo:"https://media.api-sports.io/football/teams/39.png",  country:"England", founded:1882, national:false, code:"BUR", venue:"Turf Moor",           city:"Burnley",    address:"Harry Potts Way",                capacity:21944, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/491.png" },
  { id:46,  name:"Sheffield United",     logo:"https://media.api-sports.io/football/teams/46.png",  country:"England", founded:1889, national:false, code:"SHU", venue:"Bramall Lane",        city:"Sheffield",  address:"Cherry Street",                  capacity:32050, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/512.png" },
  { id:31,  name:"Luton Town",           logo:"https://media.api-sports.io/football/teams/31.png",  country:"England", founded:1885, national:false, code:"LUT", venue:"Kenilworth Road",     city:"Luton",      address:"1 Maple Road",                   capacity:10356, surface:"grass",        venueImg:"https://media.api-sports.io/football/venues/491.png" },
];

/* ─── APPLICATION STATE ─────────────────────────────────── */
const state = {
  teams          : [],       // All normalized team objects
  filtered       : [],       // After search + filter + sort
  currentCountry : "all",
  searchQuery    : "",
  sortMode       : "name-asc",
  countryFilter  : "",
  currentPage    : 1,
  favourites     : [],       // Array of team IDs
  currentTeam    : null,     // Team open in modal
  isLive         : false,
};

/* ─── DOM REFS ──────────────────────────────────────────── */
const $ = (id) => document.getElementById(id);
const teamGrid       = $("teamGrid");
const loadingState   = $("loadingState");
const errorState     = $("errorState");
const emptyState     = $("emptyState");
const skeletonGrid   = $("skeletonGrid");
const searchInput    = $("searchInput");
const clearSearch    = $("clearSearch");
const clearFiltersBtn= $("clearFiltersBtn");
const resultsCount   = $("resultsCount");
const sortSelect     = $("sortSelect");
const countryFilter  = $("countryFilter");
const countryTabs    = $("countryTabs");
const themeToggle    = $("themeToggle");
const themeIcon      = themeToggle.querySelector(".theme-icon");
const modalOverlay   = $("modalOverlay");
const modalClose     = $("modalClose");
const favBtn         = $("favBtn");
const favFab         = $("favFab");
const favBadge       = $("favBadge");
const favSidebar     = $("favSidebar");
const favSidebarClose= $("favSidebarClose");
const favList        = $("favList");
const favEmpty       = $("favEmpty");
const pagination     = $("pagination");
const toastContainer = $("toastContainer");
const dataModeNote   = $("dataModeNote");
const statTotal      = $("statTotal");
const statOldest     = $("statOldest");
const statCapacity   = $("statCapacity");
const retryBtn       = $("retryBtn");
const errorMsg       = $("errorMsg");
const apiKeyBtn      = $("apiKeyBtn");
const keyModalOverlay= $("keyModalOverlay");
const keyModalClose  = $("keyModalClose");
const keyInput       = $("keyInput");
const saveKeyBtn     = $("saveKeyBtn");
const keyStatus      = $("keyStatus");
const loadTeamsBtn   = $("loadTeamsBtn");
const clearKeyBtn    = $("clearKeyBtn");

/* ─── STORAGE ───────────────────────────────────────────── */
const storage = {
  getKey      : ()     => localStorage.getItem(STORAGE_KEYS.API_KEY) || "",
  setKey      : (k)    => localStorage.setItem(STORAGE_KEYS.API_KEY, k),
  clearKey    : ()     => localStorage.removeItem(STORAGE_KEYS.API_KEY),
  getFavs     : ()     => JSON.parse(localStorage.getItem(STORAGE_KEYS.FAVOURITES) || "[]"),
  setFavs     : (arr)  => localStorage.setItem(STORAGE_KEYS.FAVOURITES, JSON.stringify(arr)),
  getTheme    : ()     => localStorage.getItem(STORAGE_KEYS.THEME) || "dark",
  setTheme    : (t)    => localStorage.setItem(STORAGE_KEYS.THEME, t),
};

/* ─── INITIALIZATION ────────────────────────────────────── */
document.addEventListener("DOMContentLoaded", () => {
  applyTheme(storage.getTheme());
  state.favourites = storage.getFavs();
  updateFavBadge();
  buildSkeletons();
  setupListeners();
  loadTeams();
  showKeyStatus();
});

/* ─── SKELETONS ─────────────────────────────────────────── */
function buildSkeletons() {
  skeletonGrid.innerHTML = Array.from({ length: PAGE_SIZE }, () => `
    <div class="skeleton-card">
      <div class="skeleton-logo"></div>
      <div class="skeleton-body">
        <div class="skeleton-line skeleton-line--title"></div>
        <div class="skeleton-line skeleton-line--sub"></div>
        <div class="skeleton-line skeleton-line--tag"></div>
      </div>
    </div>
  `).join("");
}

/* ─── LOAD TEAMS ────────────────────────────────────────── */
async function loadTeams() {
  showState("loading");
  const key = storage.getKey();

  try {
    if (key) {
      state.teams = await fetchTeamsFromAPI(key);
      state.isLive = true;
      dataModeNote.textContent = "✅ Live data from API-Football";
    } else {
      await fakeDelay(500);
      state.teams = DEMO_TEAMS.map(t => ({ ...t }));
      state.isLive = false;
      dataModeNote.textContent = "⚠️ Demo data active — add your API key to load live data.";
    }
    updateHeroStats();
    applyFiltersAndRender();
  } catch (err) {
    console.error("loadTeams error:", err);
    // Fallback to demo
    state.teams = DEMO_TEAMS.map(t => ({ ...t }));
    state.isLive = false;
    dataModeNote.textContent = "⚠️ API error — showing demo data.";
    showToast("API error — showing demo data instead.", "error");
    updateHeroStats();
    applyFiltersAndRender();
  }
}

/* ─── API FETCH ─────────────────────────────────────────── */
async function fetchTeamsFromAPI(apiKey) {
  const url = `${API_BASE}/teams?league=${LEAGUE_ID}&season=${SEASON}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      "x-apisports-key": apiKey,
      "Accept": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error(`API responded with status ${res.status}`);
  }

  const data = await res.json();

  if (data.errors && Object.keys(data.errors).length > 0) {
    const firstErr = Object.values(data.errors)[0];
    throw new Error(firstErr);
  }

  if (!Array.isArray(data.response) || data.response.length === 0) {
    throw new Error("No teams found in API response.");
  }

  // HOF: .map() to normalize raw API data
  return data.response.map(normalizeTeam);
}

/* ─── NORMALIZE TEAM ────────────────────────────────────── */
function normalizeTeam(entry) {
  const t = entry.team  || {};
  const v = entry.venue || {};
  return {
    id       : t.id,
    name     : t.name     || "Unknown",
    logo     : t.logo     || "",
    country  : t.country  || "England",
    founded  : t.founded  || null,
    national : t.national || false,
    code     : t.code     || "",
    venue    : v.name     || "—",
    city     : v.city     || "—",
    address  : v.address  || "—",
    capacity : v.capacity || 0,
    surface  : v.surface  || "—",
    venueImg : v.image    || "",
  };
}

/* ─── FILTER + SORT + RENDER PIPELINE ──────────────────── */
function applyFiltersAndRender() {
  state.currentPage = 1;

  // HOF: .filter() for country tab
  let result = state.teams.filter(t => {
    if (state.currentCountry === "all") return true;
    return t.country === state.currentCountry;
  });

  // HOF: .filter() for dropdown country filter
  if (state.countryFilter) {
    result = result.filter(t => t.country === state.countryFilter);
  }

  // HOF: .filter() for search query
  if (state.searchQuery.trim()) {
    const q = state.searchQuery.toLowerCase();
    result = result.filter(t =>
      t.name.toLowerCase().includes(q)    ||
      t.city.toLowerCase().includes(q)    ||
      t.venue.toLowerCase().includes(q)   ||
      t.country.toLowerCase().includes(q)
    );
  }

  // HOF: [...].sort() for multiple sort modes
  const sorted = [...result].sort((a, b) => {
    switch (state.sortMode) {
      case "name-asc"      : return a.name.localeCompare(b.name);
      case "name-desc"     : return b.name.localeCompare(a.name);
      case "founded-asc"   : return (a.founded || 9999) - (b.founded || 9999);
      case "founded-desc"  : return (b.founded || 0)    - (a.founded || 0);
      case "capacity-desc" : return b.capacity - a.capacity;
      case "capacity-asc"  : return a.capacity - b.capacity;
      default              : return 0;
    }
  });

  state.filtered = sorted;
  renderPage();
}

/* ─── RENDER PAGE ───────────────────────────────────────── */
function renderPage() {
  const total = state.filtered.length;

  if (total === 0) {
    showState("empty");
    updateResultsCount(0);
    pagination.hidden = true;
    return;
  }

  updateResultsCount(total);

  const start = (state.currentPage - 1) * PAGE_SIZE;
  const slice = state.filtered.slice(start, start + PAGE_SIZE);

  // HOF: .map() to build card HTML
  teamGrid.innerHTML = slice.map(createTeamCardHTML).join("");
  showState("grid");
  teamGrid.hidden = false;

  addCardListeners();
  renderPagination(total);
}

/* ─── TEAM CARD HTML ────────────────────────────────────── */
function createTeamCardHTML(team) {
  const isFav = state.favourites.includes(team.id);
  const maxCap = Math.max(...state.teams.map(t => t.capacity), 1);
  const pct = team.capacity ? Math.round((team.capacity / maxCap) * 100) : 0;
  const foundedLabel = team.founded ? team.founded : "—";
  const capLabel = team.capacity ? team.capacity.toLocaleString() : "—";
  const safeVenue = escapeHTML(team.venue);
  const safeName  = escapeHTML(team.name);
  const safeCity  = escapeHTML(team.city);

  return `
    <div class="team-card ${isFav ? "favorited" : ""}" data-id="${team.id}">
      <div class="card-logo-wrap">
        <img class="card-logo" src="${escapeHTML(team.logo)}" alt="${safeName}"
             loading="lazy" onerror="this.src='https://via.placeholder.com/90?text=?'"/>
      </div>
      <div class="card-body">
        <div class="card-top">
          <span class="card-country">${escapeHTML(team.country)}</span>
          <span class="card-year">${foundedLabel}</span>
        </div>
        <h3 class="card-name">${safeName}</h3>
        <p class="card-venue">🏟️ <span>${safeVenue}</span>, ${safeCity}</p>
        <div class="card-capacity-bar">
          <div class="capacity-label">
            <span>Capacity</span>
            <span>${capLabel}</span>
          </div>
          <div class="capacity-track">
            <div class="capacity-fill" style="width:${pct}%"></div>
          </div>
        </div>
      </div>
    </div>
  `;
}

/* ─── CARD CLICK LISTENERS ──────────────────────────────── */
function addCardListeners() {
  teamGrid.querySelectorAll(".team-card").forEach(card => {
    card.addEventListener("click", () => openModal(Number(card.dataset.id)));
  });
}

/* ─── PAGINATION ────────────────────────────────────────── */
function renderPagination(total) {
  const pages = Math.ceil(total / PAGE_SIZE);

  if (pages <= 1) { pagination.hidden = true; return; }
  pagination.hidden = false;
  const cur = state.currentPage;
  let html = `<button class="page-btn" data-page="${cur - 1}" ${cur === 1 ? "disabled" : ""}>← Prev</button>`;

  const range = buildPageRange(cur, pages);
  range.forEach(p => {
    if (p === "…") {
      html += `<span class="page-btn ellipsis">…</span>`;
    } else {
      html += `<button class="page-btn ${p === cur ? "active" : ""}" data-page="${p}">${p}</button>`;
    }
  });

  html += `<button class="page-btn" data-page="${cur + 1}" ${cur === pages ? "disabled" : ""}>Next →</button>`;
  pagination.innerHTML = html;

  pagination.querySelectorAll(".page-btn[data-page]").forEach(btn => {
    btn.addEventListener("click", () => {
      const p = Number(btn.dataset.page);
      if (p >= 1 && p <= pages) {
        state.currentPage = p;
        renderPage();
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  });
}

function buildPageRange(cur, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  if (cur <= 4)   return [1, 2, 3, 4, 5, "…", total];
  if (cur >= total - 3) return [1, "…", total-4, total-3, total-2, total-1, total];
  return [1, "…", cur-1, cur, cur+1, "…", total];
}

/* ─── MODAL ─────────────────────────────────────────────── */
function openModal(teamId) {
  // HOF: .find() to locate the team
  const team = state.teams.find(t => t.id === teamId);
  if (!team) return;

  state.currentTeam = team;
  const isFav = state.favourites.includes(team.id);

  $("modalCountry").textContent   = team.country;
  $("modalTitle").textContent     = team.name;
  $("modalCode").textContent      = team.code ? `Code: ${team.code}` : "";
  $("modalLogo").src              = team.logo;
  $("modalLogo").alt              = team.name;
  $("modalFounded").textContent   = team.founded || "—";
  $("modalCountryDetail").textContent = team.country;
  $("modalNational").textContent  = team.national ? "Yes" : "No";
  $("modalVenue").textContent     = team.venue;
  $("modalCity").textContent      = team.city;
  $("modalAddress").textContent   = team.address;
  $("modalCapacity").textContent  = team.capacity ? team.capacity.toLocaleString() : "—";
  $("modalSurface").textContent   = team.surface;

  const venueImgWrap = $("modalVenueImgWrap");
  const venueImg     = $("modalVenueImg");
  if (team.venueImg) {
    venueImg.src       = team.venueImg;
    venueImg.alt       = team.venue;
    venueImgWrap.style.display = "block";
  } else {
    venueImgWrap.style.display = "none";
  }

  updateFavBtn(isFav);
  modalOverlay.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modalOverlay.hidden = true;
  state.currentTeam = null;
  document.body.style.overflow = "";
}

function updateFavBtn(isFav) {
  $("favIcon").textContent  = isFav ? "❤️" : "🤍";
  $("favLabel").textContent = isFav ? "Remove from Favourites" : "Add to Favourites";
  favBtn.classList.toggle("active", isFav);
}

/* ─── FAVOURITES ─────────────────────────────────────────── */
function toggleFavourite() {
  const team = state.currentTeam;
  if (!team) return;

  const idx = state.favourites.indexOf(team.id);
  if (idx === -1) {
    state.favourites.push(team.id);
    showToast(`❤️ ${team.name} added to favourites`, "success");
  } else {
    state.favourites.splice(idx, 1);
    showToast(`Removed ${team.name} from favourites`, "info");
  }

  storage.setFavs(state.favourites);
  updateFavBadge();
  updateFavBtn(state.favourites.includes(team.id));
  renderFavSidebar();

  // Re-render card to update heart indicator
  applyFiltersAndRender();
  // Re-open modal (state.currentTeam still set)
  if (state.currentTeam) openModal(state.currentTeam.id);
}

function updateFavBadge() {
  favBadge.textContent = state.favourites.length;
}

function openFavSidebar() {
  renderFavSidebar();
  favSidebar.classList.add("open");
}

function closeFavSidebar() {
  favSidebar.classList.remove("open");
}

function renderFavSidebar() {
  if (state.favourites.length === 0) {
    favList.innerHTML = "";
    favEmpty.classList.add("visible");
    return;
  }
  favEmpty.classList.remove("visible");

  // HOF: .filter() to get favourite team objects
  const favTeams = state.teams.filter(t => state.favourites.includes(t.id));

  favList.innerHTML = favTeams.map(t => `
    <li class="fav-item" data-id="${t.id}">
      <img class="fav-item-logo" src="${escapeHTML(t.logo)}" alt="${escapeHTML(t.name)}"
           onerror="this.src='https://via.placeholder.com/48?text=?'"/>
      <div class="fav-item-info">
        <div class="fav-item-name">${escapeHTML(t.name)}</div>
        <div class="fav-item-meta">${escapeHTML(t.venue)} · ${escapeHTML(t.country)}</div>
      </div>
      <button class="fav-item-remove" data-remove="${t.id}" aria-label="Remove ${escapeHTML(t.name)}">✕</button>
    </li>
  `).join("");

  favList.querySelectorAll(".fav-item").forEach(item => {
    item.addEventListener("click", e => {
      if (e.target.closest(".fav-item-remove")) return;
      closeFavSidebar();
      openModal(Number(item.dataset.id));
    });
  });

  favList.querySelectorAll(".fav-item-remove").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.remove);
      state.favourites = state.favourites.filter(fid => fid !== id);
      storage.setFavs(state.favourites);
      updateFavBadge();
      renderFavSidebar();
      applyFiltersAndRender();
    });
  });
}

/* ─── HERO STATS ────────────────────────────────────────── */
function updateHeroStats() {
  statTotal.textContent = state.teams.length;

  // HOF: .reduce() to find oldest club
  const withFounded = state.teams.filter(t => t.founded);
  if (withFounded.length > 0) {
    const oldest = withFounded.reduce((acc, t) => Number(t.founded) < Number(acc.founded) ? t : acc);
    statOldest.textContent = oldest.founded;
  } else {
    statOldest.textContent = "—";
  }

  // HOF: .reduce() to find largest stadium
  const withCap = state.teams.filter(t => t.capacity > 0);
  if (withCap.length > 0) {
    const largest = withCap.reduce((acc, t) => t.capacity > acc.capacity ? t : acc);
    statCapacity.textContent = largest.capacity.toLocaleString();
  } else {
    statCapacity.textContent = "—";
  }
}

/* ─── API KEY MODAL ─────────────────────────────────────── */
function openKeyModal() {
  const existing = storage.getKey();
  keyInput.value = existing ? "••••••••••••••••" : "";
  showKeyStatus();
  keyModalOverlay.hidden = false;
}

function closeKeyModal() {
  keyModalOverlay.hidden = true;
}

function showKeyStatus() {
  const key = storage.getKey();
  if (key) {
    keyStatus.textContent = `✅ Key saved (${key.length} chars)`;
    keyStatus.className = "key-status ok";
  } else {
    keyStatus.textContent = "No key saved — using demo data.";
    keyStatus.className = "key-status";
  }
}

/* ─── TOAST ─────────────────────────────────────────────── */
function showToast(msg, type = "info") {
  const el = document.createElement("div");
  el.className = `toast ${type}`;
  el.textContent = msg;
  toastContainer.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

/* ─── THEME ─────────────────────────────────────────────── */
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeIcon.textContent = theme === "dark" ? "🌙" : "☀️";
}

function toggleTheme() {
  const cur   = document.documentElement.getAttribute("data-theme");
  const next  = cur === "dark" ? "light" : "dark";
  applyTheme(next);
  storage.setTheme(next);
}

/* ─── SEARCH (debounced 300ms) ──────────────────────────── */
let searchDebounce;
function handleSearch() {
  clearTimeout(searchDebounce);
  searchDebounce = setTimeout(() => {
    state.searchQuery = searchInput.value;
    clearSearch.hidden = !state.searchQuery;
    applyFiltersAndRender();
  }, 300);
}

/* ─── UI STATE ──────────────────────────────────────────── */
function showState(s) {
  // Hide everything using the hidden attribute (CSS: [hidden]{display:none!important})
  loadingState.hidden = true;
  errorState.hidden   = true;
  emptyState.hidden   = true;
  teamGrid.hidden     = true;
  pagination.hidden   = true;

  // Reveal only the requested panel
  if (s === "loading") loadingState.hidden = false;
  if (s === "error")   errorState.hidden   = false;
  if (s === "empty")   emptyState.hidden   = false;
  if (s === "grid")  { teamGrid.hidden     = false; }
}

function updateResultsCount(n) {
  const label = n === 1 ? "club" : "clubs";
  resultsCount.innerHTML = `Showing <strong>${n}</strong> ${label}`;
}

/* ─── HELPERS ───────────────────────────────────────────── */
function escapeHTML(str) {
  if (str == null) return "";
  const d = document.createElement("div");
  d.textContent = String(str);
  return d.innerHTML;
}

function fakeDelay(ms) {
  return new Promise(res => setTimeout(res, ms));
}

function resetFilters() {
  searchInput.value      = "";
  state.searchQuery      = "";
  state.currentCountry   = "all";
  state.countryFilter    = "";
  countryFilter.value    = "";
  clearSearch.hidden     = true;

  document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
  document.querySelector('[data-country="all"]').classList.add("active");

  applyFiltersAndRender();
}

/* ─── EVENT LISTENERS ───────────────────────────────────── */
function setupListeners() {
  // Search
  searchInput.addEventListener("input", handleSearch);
  clearSearch.addEventListener("click", () => {
    searchInput.value = "";
    state.searchQuery = "";
    clearSearch.hidden = true;
    applyFiltersAndRender();
  });
  clearFiltersBtn.addEventListener("click", resetFilters);

  // Sort & Filter
  sortSelect.addEventListener("change", () => {
    state.sortMode = sortSelect.value;
    applyFiltersAndRender();
  });
  countryFilter.addEventListener("change", () => {
    state.countryFilter = countryFilter.value;
    applyFiltersAndRender();
  });

  // Country Tabs
  countryTabs.addEventListener("click", e => {
    const btn = e.target.closest(".tab-btn");
    if (!btn) return;
    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    state.currentCountry = btn.dataset.country;
    // Sync dropdown
    if (btn.dataset.country !== "all") {
      countryFilter.value = btn.dataset.country;
      state.countryFilter = btn.dataset.country;
    } else {
      countryFilter.value = "";
      state.countryFilter = "";
    }
    applyFiltersAndRender();
  });

  // Theme
  themeToggle.addEventListener("click", toggleTheme);

  // Modal
  modalClose.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", e => {
    if (e.target === modalOverlay) closeModal();
  });
  favBtn.addEventListener("click", toggleFavourite);

  // Favourites sidebar
  favFab.addEventListener("click", openFavSidebar);
  favSidebarClose.addEventListener("click", closeFavSidebar);

  // Retry
  retryBtn.addEventListener("click", loadTeams);

  // API Key modal
  apiKeyBtn.addEventListener("click", openKeyModal);
  keyModalClose.addEventListener("click", closeKeyModal);
  keyModalOverlay.addEventListener("click", e => {
    if (e.target === keyModalOverlay) closeKeyModal();
  });

  saveKeyBtn.addEventListener("click", () => {
    const val = keyInput.value.trim();
    if (!val || val.startsWith("•")) {
      showToast("Enter a valid API key to save.", "error");
      return;
    }
    storage.setKey(val);
    showKeyStatus();
    showToast("✅ Key saved!", "success");
  });

  loadTeamsBtn.addEventListener("click", () => {
    closeKeyModal();
    loadTeams();
  });

  clearKeyBtn.addEventListener("click", () => {
    storage.clearKey();
    keyInput.value = "";
    showKeyStatus();
    showToast("Key cleared — switching to demo data.", "info");
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", e => {
    if (e.key === "Escape") { closeModal(); closeFavSidebar(); closeKeyModal(); }
  });
}