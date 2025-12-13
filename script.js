const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchInput.value = "";

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = searchInput.value.toLowerCase();

  fetch("/api/songs")
    .then((response) => response.json())
    .then((songs) => {
      const results = songs["songs"].filter(
        (song) =>
          song.title.toLowerCase().includes(query) ||
          song.artist.toLowerCase().includes(query) ||
          song.album.toLowerCase().includes(query)
      );

      displayResults(results);
    });
});

function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  results.forEach((song) => {
    const songElement = document.createElement("div");
    songElement.className = "song";
    songElement.innerHTML = `
      <h3>${song.title}</h3>
      <span>${song.artist}</span><br>
    `;
    const playButton = document.createElement("button");
    playButton.className = "playButton";
    playButton.innerHTML = "";
    const playImg = document.createElement("img");
    playImg.src = "./play.svg";
    playImg.width = 32;
    playImg.height = 32;
    playButton.appendChild(playImg);
    var playing = false;
    const audio = new Audio(song.url);
    playButton.addEventListener("click", () => {
      if (!playing) {
        audio.play();
        playButton.innerHTML = "";
            const playImg = document.createElement('img');
            playImg.src = './pause.svg';
            playImg.width = 32;
            playImg.height = 32;
            playButton.appendChild(playImg);
        audio.play();
        playing = true;
        audio.onended = () => {
          playButton.innerHTML = "";
          const playImg = document.createElement("img");
          playImg.src = "./play.svg";
          playImg.width = 32;
          playImg.height = 32;
          playButton.appendChild(playImg);
          playing = false;
        };
      } else {
        // Pause functionality can be implemented here
        playButton.innerHTML = "";
            const playImg = document.createElement('img');
            playImg.src = './play.svg';
            playImg.width = 32;
            playImg.height = 32;
            playButton.appendChild(playImg);
        audio.pause();
        playing = false;
      }
    });
    songElement.appendChild(playButton);
    resultsContainer.appendChild(songElement);
  });
}


document.addEventListener("DOMContentLoaded", () => {
  // Initial load: display all songs
  fetch("/api/songs")
    .then((response) => response.json())
    .then((songs) => {
      displayResults(songs["songs"]);
    });
});