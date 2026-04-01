const container = document.getElementById("teams-container");
const loading = document.getElementById("loading");

loading.innerText = "Loading...";

fetch("https://v3.football.api-sports.io/teams?league=39&season=2023", {
  headers: {
    "x-apisports-key": "YOUR_API_KEY"
  }
})
.then(res => res.json())
.then(data => {
  loading.innerText = "";

  data.response.forEach(teamData => {
    const team = teamData.team;

    const div = document.createElement("div");

    div.innerHTML =
      "<img src='" + team.logo + "' width='80'>" +
      "<h3>" + team.name + "</h3>" +
      "<p>" + team.country + "</p>";

    container.appendChild(div);
  });
});
