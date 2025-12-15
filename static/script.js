const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

searchInput.value = "";

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const query = searchInput.value.toLowerCase();

fetch("./songs/songs.json")
    .then((response) => response.json())
    .then((songs) => {
        const results = songs["songs"].filter(
            (song) =>
                song.title.toLowerCase().includes(query) ||
                song.artist.toLowerCase().includes(query)
        );

        displayResults(results);
    });
});

function displayResults(results) {
  const resultsContainer = document.getElementById("results");
  resultsContainer.innerHTML = "";

  results.forEach((song) => {
    const songElement = document.createElement("div");
    songElement.className = `song ${song.title.replace(/\s+/g, '-').toLowerCase()}`;
    songElement.innerHTML = `
      <img src="${song.logo}" alt="${song.title}" class="song-logo"><br>
      <h3>${song.title}</h3>
      <span>${song.artist}</span><br>
    `;
    songElement.style.setProperty('--avg-shadow', song.color || 'rgba(255, 0, 0, 1)');
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
  fetch("songs/songs.json")
    .then((response) => response.json())
    .then((songs) => {
      displayResults(songs["songs"]);
    });
});