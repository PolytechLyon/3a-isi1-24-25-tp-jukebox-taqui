<template>
    <div class="jukebox">
      <h1>Jukebox</h1>
  
      <!-- section player -->
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
  
      <!-- section playlist -->
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
  
      <!-- section pour add tracker -->
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
      };
    },
    methods: {
      playTrack(index) {
        const track = this.playlist[index];
        if (!track || track.error) return;
        this.currentTrack = track;
        this.audio.src = track.src;
        this.audio.play();
      },
      removeTrack(index) {
        this.playlist.splice(index, 1);
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
  </style>
  