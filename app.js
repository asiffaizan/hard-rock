//adding enter key event listener

document.querySelector('#input-value').addEventListener('keypress', (e)=>{
  if(e.key === 'Enter'){
    searchSongs();
  }
})


// search button event listener

function searchSongs(){
  const inputVal = document.getElementById('input-value').value;
  fetch(`https://api.lyrics.ovh/suggest/${inputVal}`)
  .then(response => response.json())
  .then(data => {
    songsData(data.data.slice(0,10));
  })
  .catch(error => console.log(error));
  document.getElementById('input-value').value = '';
}

const songsData = songs => {
  const lyricsList = document.getElementById('lyrics-list');
  lyricsList.innerHTML = '';
  songs.forEach(song => {
    const title = song.title;
    const artist = song.artist.name;
    const id = song.id.toString();
    const previewURL = song.preview;
    const image = song.album.cover;
    const lyrics = document.createElement('div');
    lyrics.innerHTML = `
      <div class="single-result row align-items-center my-3 p-3">
          <div class="col-md-9">
              <h3 class="lyrics-name">${title}</h3>
              <p class="author lead">Album by <span>${artist}</span></p>
              <audio controls>
                <source src="${previewURL}" type="audio/mpeg">
              </audio>
          </div>
          <div class="col-md-3 text-md-right text-center">
              <div class="p-3">
                <image src="${image}" alt="cover" style="width:100px; height:100px">
              </div>
              <button onclick="getLyric('${artist}','${title}', ${id})" class="btn btn-success" type="button" data-bs-toggle="collapse" data-bs-target="#a${id}" aria-expanded="false" aria-controls="a${id}">Get Lyrics</button>
          </div>
      </div>
      <div class="row align-items-center my-3 p-3">
        <div class="collapse col-md-12" id="a${id}">
          <div id="display-lyrics-${id}" class="card card-body bg-transparent text-white" style="color:black">
            lyrics will be displayed here 😎😎😎
          </div>
        </div>
      </div>
    `;
    lyricsList.appendChild(lyrics);
  });
}


//get lyrics button event listener

function getLyric(artist, title, id){
  var request = new XMLHttpRequest();
  
request.open('GET', `https://api.lyrics.ovh/v1/${artist}/${title}`);

request.onreadystatechange = function () {
  if (this.readyState === 4) {
    displayError(this.responseText, id);
  }else{
    displayLyrics(this.responseText, id);
  }
};

request.send();
}

//display lyrics

const displayLyrics = (lyrics, id) => {
  const lyricsDiv = document.getElementById(`display-lyrics-${id}`);
  lyricsDiv.innerText = lyrics;
}

//display error messages
const displayError = (err, id) =>{
  const lyricsDiv = document.getElementById(`display-lyrics-${id}`);
  const jsonObject = JSON.parse(err);
  const error = jsonObject.error;
  lyricsDiv.textContent = 'Sorry! Something went wrong. ' + error +' 😵😵😵,' + ' please try again later!!!';
}


