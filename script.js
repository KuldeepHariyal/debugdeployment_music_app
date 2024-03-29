const image = document.getElementById('cover'),
    title = document.getElementById('music-title'),
    artist = document.getElementById('music-artist'),
    currentTimeEl = document.getElementById('current-time'),
    durationEl = document.getElementById('duration'),
    progress = document.getElementById('progress'),
    playerProgress = document.getElementById('player-progress'),
    prevBtn = document.getElementById('prev'),
    nextBtn = document.getElementById('next'),
    playBtn = document.getElementById('play'),
    background = document.getElementById('bg-img');

const music = new Audio();

const songs = [
    {
        path: './assets/song1.mp3',
        displayName: 'Teri baaton mein aisa uljha jiya',
        cover: './assets/song1.jpg',
        artist: 'Raghav, Aseesh Kaur, Tanishk Bagchi',
    },
    {
        path: './assets/song2.mp3',
        displayName: 'Aam jahe munde',
        cover: './assets/song2.jpg',
        artist: 'Parmish Verma',
    },
    {
        path: './assets/song3.mp3',
        displayName: 'Yimmy Yimmy',
        cover: './assets/song3.jpg',
        artist: 'Tayc, Shreya Ghoshal',
    }
];

let musicIndex = 0;
let isPlaying = false;

function togglePlay() {
    if (isPlaying) {
        pauseMusic();
    } else {
        playMusic();
    }
}

function playMusic() {
    isPlaying = true;
    playBtn.classList.replace('fa-play', 'fa-pause');
    playBtn.setAttribute('title', 'Pause');
    music.play();
}

function pauseMusic() {
    isPlaying = false;
    playBtn.classList.replace('fa-pause', 'fa-play');
    playBtn.setAttribute('title', 'Play');
    music.pause();
}

function loadMusic(index) {
    // Load the new song
    musicIndex = index;
    const song = songs[musicIndex];
    const isPausedBeforeLoading = music.paused;
    music.src = song.path;
    title.textContent = song.displayName;
    artist.textContent = song.artist;
    image.src = song.cover;
    background.src = song.cover;

     // Check if music is paused and update play button icon accordingly
     if (isPausedBeforeLoading) {
        // If the music was paused before loading, keep it paused
        pauseMusic();
    } else {
        // If the music was playing before loading, keep it playing
        playMusic();
    }
    // playMusic();
}

// Initialize by loading the first song and highlighting it in the playlist
loadMusic(musicIndex);

// Function to update the playlist highlighting
function updatePlaylistHighlight() {
    // Remove the 'playing' class from any previously highlighted item
    const previouslyPlaying = document.querySelector('#playlist li.playing');
    if (previouslyPlaying) {
        previouslyPlaying.classList.remove('playing');
    }
    // Highlight the playlist item corresponding to the currently playing song
    const playlistItem = document.querySelectorAll('#playlist li')[musicIndex];
    playlistItem.classList.add('playing');
}

// Update the progress bar and playlist highlighting as the song plays
function updatePlayer() {
    updateProgressBar();
    updatePlaylistHighlight();
}

function changeMusic(direction) {
    musicIndex = (musicIndex + direction + songs.length) % songs.length;
    loadMusic(musicIndex);
}

function updateProgressBar() {
    const { duration, currentTime } = music;
    const progressPercent = (currentTime / duration) * 100;
    progress.style.width = `${progressPercent}%`;

    const formatTime = (time) => String(Math.floor(time)).padStart(2, '0');
    durationEl.textContent = `${formatTime(duration / 60)}:${formatTime(duration % 60)}`;
    currentTimeEl.textContent = `${formatTime(currentTime / 60)}:${formatTime(currentTime % 60)}`;
}

function setProgressBar(e) {
    const width = playerProgress.clientWidth;
    const clickX = e.offsetX;
    music.currentTime = (clickX / width) * music.duration;
}

playBtn.addEventListener('click', togglePlay);
prevBtn.addEventListener('click', () => changeMusic(-1));
nextBtn.addEventListener('click', () => changeMusic(1));
music.addEventListener('ended', () => changeMusic(1));
music.addEventListener('timeupdate', updatePlayer);
playerProgress.addEventListener('click', setProgressBar);

// Populate the playlist and highlight the initially loaded song
function populatePlaylist() {
    const playlist = document.getElementById('playlist');
    playlist.innerHTML = '';
    songs.forEach((song, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${song.displayName} - ${song.artist}`;
        listItem.addEventListener('click', () => loadMusic(index));
        playlist.appendChild(listItem);
        // Highlight the playlist item if it corresponds to the initially loaded song
        if (index === musicIndex) {
            listItem.classList.add('playing');
        }
    });
}

// Call populatePlaylist function to populate the playlist initially
populatePlaylist();


// Function to toggle playlist visibility
function togglePlaylist() {
    const playlistContainer = document.getElementById('playlist-container');
    const playlistButton = document.getElementById('show-playlist');

    if (playlistContainer.style.display === 'block') {
        // If playlist is currently visible, hide it and change button text to 'Show Playlist'
        playlistContainer.style.display = 'none';
        playlistButton.textContent = 'Show Playlist';
    } else {
        // If playlist is currently hidden, show it and change button text to 'Hide Playlist'
        playlistContainer.style.display = 'block';
        playlistButton.textContent = 'Hide Playlist';
    }
}

// Add event listener to the playlist button to toggle playlist visibility
document.getElementById('show-playlist').addEventListener('click', togglePlaylist);

