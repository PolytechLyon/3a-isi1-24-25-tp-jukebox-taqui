<template>
  <div class="jukebox">
    <h1>Jukebox</h1>

    <!-- barre de lecture avec le titre du projet -->
    <div v-if="currentTrack" class="now-playing">
      <p>
        Now playing: <strong>{{ currentTrack.title }}</strong>
      </p>
      <div class="controls">
        <button @click="togglePlayPause">
          {{ isPlaying ? "Pause" : "Play" }}
        </button>
        <button @click="stopTrack">×</button>
      </div>
      <input
        type="range"
        class="progress-bar"
        :max="audio.duration || 0"
        :value="currentTime"
        @input="seekTrack"
      />
      <div class="time-info">
        {{ formatTime(currentTime) }} / {{ formatTime(audio.duration) }}
      </div>
    </div>

    <!-- section ou on joue le track -->
    <section class="player">
      <h2>Player</h2>
      <p>Choose a track to play.</p>
      <div>
        <fieldset>
          <legend>Playback mode</legend>
          <label>
            <input type="radio" value="list" v-model="repeatMode" /> Repeat list
          </label>
          <label>
            <input type="radio" value="track" v-model="repeatMode" /> Repeat track
          </label>
          <label>
            <input type="radio" value="none" v-model="repeatMode" /> Don't repeat
          </label>
        </fieldset>
      </div>
    </section>

    <!-- section  pour la playlist -->
    <section class="playlist">
      <h2>Playlist</h2>
      <p>Add a new track to the playlist.</p>
      <ul>
        <li v-for="(track, index) in playlist" :key="index">
          <span :class="{ current: track === currentTrack, error: track.error }">{{ track.title }}</span>
          <button @click="playTrack(index)" :disabled="track.error">Play</button>
          <button @click="removeTrack(index)">Remove</button>
        </li>
      </ul>
    </section>

    <!-- section pour ajout musique -->
    <section class="add-track">
      <h2>New track</h2>
      <p>Add track</p>
      <div>
        <select v-model="addMode">
          <option value="file">Via file upload</option>
          <option value="link">Via URL</option>
        </select>
        <div v-if="addMode === 'file'">
          <input type="file" @change="handleFileUpload" />
          <button @click="addUploadedFile" :disabled="!selectedFile">Add uploaded file</button>
        </div>
        <div v-if="addMode === 'link'">
          <input type="text" v-model="newTrackURL" placeholder="Enter audio URL" />
          <button @click="addTrackFromURL">Add</button>
        </div>
      </div>
    </section>
  </div>
</template>



<script>
export default {
  data() {
    return {
      playlist: [],
      currentTrack: null,
      repeatMode: 'list',
      addMode: 'file',
      newTrackURL: '',
      selectedFile: null,
      audio: new Audio(),
      isPlaying: false,
      currentTime: 0, //position de lecture
    };
  },
  methods: {
    playTrack(index) {
      const track = this.playlist[index];
      if (!track || track.error) return;
      this.currentTrack = track;
      this.audio.src = track.src;
      this.audio.play();
      this.isPlaying = true;

      //ajoute un ecouteur pour actualiser la progression
      this.audio.addEventListener('timeupdate', this.updateProgress);
      this.audio.addEventListener('ended', this.handleTrackEnd);
    },
    stopTrack() {
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.currentTrack = null;

      //on delete les ecouteurs
      this.audio.removeEventListener('timeupdate', this.updateProgress);
    },
    togglePlayPause() {
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    seekTrack(event) {
      const newTime = event.target.value;
      this.audio.currentTime = newTime;
    },
    updateProgress() {
      this.currentTime = this.audio.currentTime; //on actualise la position en direct
    },
    handleTrackEnd() {
      if (this.repeatMode === 'track') {
        this.audio.currentTime = 0;
        this.audio.play();
      } else if (this.repeatMode === 'list') {
        const currentIndex = this.playlist.indexOf(this.currentTrack);
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        this.playTrack(nextIndex);
      } else {
        this.stopTrack();
      }
    },
    handleFileUpload(event) {
      this.selectedFile = event.target.files[0];
    },
    addUploadedFile() {
      if (!this.selectedFile) return;
      const src = URL.createObjectURL(this.selectedFile);
      this.playlist.push({ title: this.selectedFile.name, src, error: false });
      this.selectedFile = null;
    },
    addTrackFromURL() {
      if (!this.newTrackURL) return;
      this.playlist.push({ title: this.newTrackURL.split('/').pop(), src: this.newTrackURL, error: false });
      this.newTrackURL = '';
    },
    formatTime(seconds) {
      if (isNaN(seconds)) return "00:00";
      const minutes = Math.floor(seconds / 60)
        .toString()
        .padStart(2, "0");
      const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
      return `${minutes}:${secs}`;
    },
  },
};
</script>



<style> 
body {
  font-family: 'Changa', sans-serif;
}

h1, h2 {
  font-family: 'Changa', sans-serif;
  font-weight: 700; 
}

button {
  font-family: 'Changa', sans-serif;
}

.jukebox {
  width: 600px;
  margin: 20px auto;
}

fieldset {
  border: 1px solid #ccc;
  padding: 10px;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  margin-bottom: 10px;
}

.error {
  text-decoration: line-through;
  color: red;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.now-playing {
  margin: 20px 0;
  border-top: 1px solid #ccc;
  padding-top: 10px;
  text-align: center;
}

.now-playing .controls {
  margin: 10px 0;
}

.progress-bar {
  width: 100%;
}

.time-info {
  display: flex;
  justify-content: space-between;
  margin-top: 5px;
  font-size: 14px;
  color: #333;
}
</style>
