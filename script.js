const API_URL = "https://v3.football.api-sports.io/teams?league=39&season=2023";
const STORAGE_KEY = "footballExplorerApiKey";

const elements = {
  apiForm: document.getElementById("api-form"),
  apiKeyInput: document.getElementById("api-key"),
  keyStatus: document.getElementById("key-status"),
  clearKeyButton: document.getElementById("clear-key"),
  openKeyPanelButton: document.getElementById("open-key-panel"),
  loadDataButton: document.getElementById("load-data"),
  keyPanel: document.getElementById("key-panel"),
  loading: document.getElementById("loading"),
  errorMessage: document.getElementById("error-message"),
  emptyState: document.getElementById("empty-state"),
  teamsContainer: document.getElementById("teams-container"),
  searchInput: document.getElementById("search-input"),
  countryFilter: document.getElementById("country-filter"),
  sortFilter: document.getElementById("sort-filter"),
  totalTeams: document.getElementById("total-teams"),
  totalCountries: document.getElementById("total-countries"),
  oldestClub: document.getElementById("oldest-club"),
  largestStadium: document.getElementById("largest-stadium"),
  modal: document.getElementById("team-modal"),
  modalContent: document.getElementById("modal-content"),
  closeModalButton: document.getElementById("close-modal")
};

const state = {
  teams: [],
  filteredTeams: []
};

function getStoredApiKey() {
  return localStorage.getItem(STORAGE_KEY) || "";
}

function setStoredApiKey(key) {
  localStorage.setItem(STORAGE_KEY, key);
}

function clearStoredApiKey() {
  localStorage.removeItem(STORAGE_KEY);
}

function setKeyStatus() {
  const hasKey = Boolean(getStoredApiKey());
  elements.keyStatus.textContent = hasKey
    ? "API key saved in this browser. You can load the data now."
    : "No API key saved yet.";
  elements.apiKeyInput.value = getStoredApiKey();
}

function setLoading(isLoading) {
  elements.loading.hidden = !isLoading;
  elements.loadDataButton.disabled = isLoading;
  elements.loadDataButton.textContent = isLoading ? "Loading..." : "Load Teams";
}

function setError(message = "") {
  elements.errorMessage.hidden = !message;
  elements.errorMessage.textContent = message;
}

function normalizeTeamData(item) {
  const team = item.team || {};
  const venue = item.venue || {};

  return {
    id: team.id,
    name: team.name || "Unknown Team",
    logo: team.logo || "",
    country: team.country || "Unknown Country",
    founded: team.founded || "N/A",
    code: team.code || "N/A",
    national: team.national ? "National Team" : "Club Team",
    venueName: venue.name || "Unknown Stadium",
    venueCity: venue.city || "Unknown City",
    venueAddress: venue.address || "Address unavailable",
    venueCapacity: venue.capacity || 0,
    venueSurface: venue.surface || "Unknown",
    venueImage: venue.image || ""
  };
}

function updateStats(teams) {
  elements.totalTeams.textContent = teams.length;
  elements.totalCountries.textContent = new Set(teams.map((team) => team.country)).size;

  const oldestClub = teams
    .filter((team) => Number.isFinite(Number(team.founded)))
    .sort((first, second) => Number(first.founded) - Number(second.founded))[0];

  const largestStadium = teams
    .filter((team) => Number.isFinite(Number(team.venueCapacity)))
    .sort((first, second) => Number(second.venueCapacity) - Number(first.venueCapacity))[0];

  elements.oldestClub.textContent = oldestClub
    ? `${oldestClub.name} (${oldestClub.founded})`
    : "-";

  elements.largestStadium.textContent = largestStadium
    ? `${largestStadium.venueName}`
    : "-";
}

function populateCountryFilter(teams) {
  const countries = [...new Set(teams.map((team) => team.country))].sort();

  elements.countryFilter.innerHTML = '<option value="all">All Countries</option>';

  countries.forEach((country) => {
    const option = document.createElement("option");
    option.value = country;
    option.textContent = country;
    elements.countryFilter.appendChild(option);
  });
}

function formatCapacity(capacity) {
  const numericCapacity = Number(capacity);
  return numericCapacity > 0 ? numericCapacity.toLocaleString() : "Not available";
}

function renderTeams(teams) {
  elements.teamsContainer.innerHTML = "";
  elements.emptyState.hidden = teams.length !== 0;

  teams.forEach((team) => {
    const card = document.createElement("article");
    card.className = "team-card";
    card.innerHTML = `
      <div class="team-header">
        <div class="team-logo-wrap">
          <img src="${team.logo}" alt="${team.name} logo">
        </div>
        <div>
          <h3>${team.name}</h3>
          <p>${team.country}</p>
        </div>
      </div>
      <div class="team-meta">
        <span class="info-chip">Founded ${team.founded}</span>
        <span class="info-chip">${team.code}</span>
        <span class="info-chip">${team.national}</span>
      </div>
      <div class="team-venue">
        <span>${team.venueName}</span>
        <span>${team.venueCity}</span>
      </div>
      <p>Capacity: ${formatCapacity(team.venueCapacity)}</p>
      <button class="detail-button" type="button" data-team-id="${team.id}">View Details</button>
    `;

    elements.teamsContainer.appendChild(card);
  });
}

function sortTeams(teams, sortValue) {
  const sortedTeams = [...teams];

  switch (sortValue) {
    case "name-desc":
      return sortedTeams.sort((first, second) => second.name.localeCompare(first.name));
    case "founded-asc":
      return sortedTeams.sort((first, second) => Number(first.founded) - Number(second.founded));
    case "capacity-desc":
      return sortedTeams.sort((first, second) => Number(second.venueCapacity) - Number(first.venueCapacity));
    case "name-asc":
    default:
      return sortedTeams.sort((first, second) => first.name.localeCompare(second.name));
  }
}

function applyFilters() {
  const searchValue = elements.searchInput.value.trim().toLowerCase();
  const selectedCountry = elements.countryFilter.value;
  const sortValue = elements.sortFilter.value;

  const filtered = state.teams.filter((team) => {
    const matchesSearch =
      team.name.toLowerCase().includes(searchValue) ||
      team.country.toLowerCase().includes(searchValue) ||
      team.venueCity.toLowerCase().includes(searchValue);

    const matchesCountry = selectedCountry === "all" || team.country === selectedCountry;

    return matchesSearch && matchesCountry;
  });

  state.filteredTeams = sortTeams(filtered, sortValue);
  renderTeams(state.filteredTeams);
}

function openModal(teamId) {
  const team = state.teams.find((item) => String(item.id) === String(teamId));

  if (!team) {
    return;
  }

  elements.modalContent.innerHTML = `
    <div class="modal-header">
      <img src="${team.logo}" alt="${team.name} logo">
      <div>
        <p class="eyebrow">Team Profile</p>
        <h2 id="modal-title">${team.name}</h2>
        <p>${team.country}</p>
      </div>
    </div>
    <div class="modal-grid">
      <div class="info-row">
        <strong>Founded</strong>
        <span>${team.founded}</span>
      </div>
      <div class="info-row">
        <strong>Team Code</strong>
        <span>${team.code}</span>
      </div>
      <div class="info-row">
        <strong>Stadium</strong>
        <span>${team.venueName}</span>
      </div>
      <div class="info-row">
        <strong>Capacity</strong>
        <span>${formatCapacity(team.venueCapacity)}</span>
      </div>
      <div class="info-row">
        <strong>City</strong>
        <span>${team.venueCity}</span>
      </div>
      <div class="info-row">
        <strong>Surface</strong>
        <span>${team.venueSurface}</span>
      </div>
      <div class="info-row">
        <strong>Address</strong>
        <span>${team.venueAddress}</span>
      </div>
      <div class="info-row">
        <strong>Team Type</strong>
        <span>${team.national}</span>
      </div>
    </div>
  `;

  elements.modal.classList.remove("hidden");
  elements.modal.setAttribute("aria-hidden", "false");
}

function closeModal() {
  elements.modal.classList.add("hidden");
  elements.modal.setAttribute("aria-hidden", "true");
}

async function loadTeams() {
  const apiKey = getStoredApiKey().trim();

  if (!apiKey) {
    setError("Please save your API-Football key first, then load the teams.");
    elements.keyPanel.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  setLoading(true);
  setError("");

  try {
    const response = await fetch(API_URL, {
      headers: {
        "x-apisports-key": apiKey
      }
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}. Check your API key and plan limits.`);
    }

    const data = await response.json();

    if (!data.response || !Array.isArray(data.response)) {
      throw new Error("Unexpected API response format.");
    }

    state.teams = data.response.map(normalizeTeamData);
    populateCountryFilter(state.teams);
    updateStats(state.teams);
    applyFilters();
  } catch (error) {
    setError(error.message || "Unable to load team data right now.");
  } finally {
    setLoading(false);
  }
}

elements.apiForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const key = elements.apiKeyInput.value.trim();

  if (!key) {
    setError("Enter a valid API key before saving.");
    return;
  }

  setStoredApiKey(key);
  setKeyStatus();
  setError("");
});

elements.clearKeyButton.addEventListener("click", () => {
  clearStoredApiKey();
  setKeyStatus();
  setError("");
});

elements.loadDataButton.addEventListener("click", loadTeams);

elements.openKeyPanelButton.addEventListener("click", () => {
  elements.keyPanel.scrollIntoView({ behavior: "smooth", block: "center" });
  elements.apiKeyInput.focus();
});

elements.searchInput.addEventListener("input", applyFilters);
elements.countryFilter.addEventListener("change", applyFilters);
elements.sortFilter.addEventListener("change", applyFilters);

elements.teamsContainer.addEventListener("click", (event) => {
  const button = event.target.closest("[data-team-id]");

  if (!button) {
    return;
  }

  openModal(button.dataset.teamId);
});

elements.closeModalButton.addEventListener("click", closeModal);
elements.modal.addEventListener("click", (event) => {
  if (event.target.dataset.closeModal === "true") {
    closeModal();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !elements.modal.classList.contains("hidden")) {
    closeModal();
  }
});

setKeyStatus();
