const searchForm = document.getElementById('searchForm');
const searchInput = document.getElementById('searchInput');

searchForm.addEventListener('submit', function(event) {
  event.preventDefault();
  const query = searchInput.value.toLowerCase();

  fetch('/api/songs')
    .then(response => response.json())
    .then(songs => {

      console.log(songs);
      const results = songs["songs"].filter(song => 
        song.title.toLowerCase().includes(query) || 
        song.artist.toLowerCase().includes(query) || 
        song.album.toLowerCase().includes(query)
      );

      displayResults(results);
    });
});

function displayResults(searchResults) {
  const resultsContainer = document.getElementById('searchResults');
  resultsContainer.innerHTML = '';

  searchResults.forEach(song => {
    const songElement = document.createElement('div');
    songElement.innerHTML = `
      <h3>${song.title}</h3>
      <p>Artist: ${song.artist}</p>
      <p>Album: ${song.album}</p>
      <audio controls src="${song.url}"></audio>
    `;
    resultsContainer.appendChild(songElement);
  });
}