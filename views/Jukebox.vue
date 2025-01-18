/* 
  Ce composant est une application de jukebox simple qui permet de gérer une playlist de pistes audio.
  Il permet de lire, mettre en pause, arrêter, supprimer et ajouter des pistes audio.
  Il permet également de changer le mode de répétition de la playlist.
  Il permet d'ajouter des pistes audio à partir d'une URL ou d'un fichier local.
  Il affiche la progression de la piste en cours de lecture et permet de changer la position de lecture.
*/
/* La partie HTML*/
<template>
  <div class="jukebox">
    
    <h1>Jukebox</h1>
    <router-link to="/playlists">Gérer les listes de lecture</router-link>
    
    <!-- Barre de lecture avec le titre du projet -->
    <div v-if="currentTrack" class="now-playing">
      <p>
        En cours de lecture: <strong>{{ currentTrack.title }}</strong>
      </p>
      <div class="controls">
        <div class="player-controls">
          <button @click="togglePlayPause">
            {{ isPlaying ? "Pause" : "Jouer" }}
          </button>
          <button @click="stopTrack">Arreter</button>
        </div>
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

    <!-- Section où on joue la piste -->
    <section class="player">
      <h2>Lecteur</h2>
      <p>Choisir une piste à lire.</p>
      <div>
        <fieldset>
          <legend>Mode de Relecture</legend>
          <label class="flex items-center">
            <input type="radio" value="list" v-model="repeatMode" /> Répéter la liste
          </label>
          <label class="flex items-center">
            <input type="radio" value="track" v-model="repeatMode" /> Répéter la piste
          </label>
          <label class="flex items-center">
            <input type="radio" value="none" v-model="repeatMode" /> Ne pas répéter
          </label>
        </fieldset>
      </div>
    </section>

    <!-- Section  pour la playlist -->
    <section class="playlist">
      <h2>Playlist</h2>
      <p v-if="playlist.length === 0">Ajouter une nouvelle piste à la playlist.</p> <!--Si la playlist est vide-->
      <ul>
        <li v-for="(track, index) in playlist" :key="index">
          <span :class="{ current: track === currentTrack, error: track.error }">{{ track.title }}</span>
          <div class="playlist-controls">
            <button @click="playTrack(index)">Jouer</button>
            <button @click="removeTrack(index)">Supprimer</button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Section pour ajout musique -->
    <section class="add-track">
      <h2>Nouvelle piste</h2>
      <div class="add-track-controls">
        <p>Ajouter piste</p>
        <select v-model="addMode">
          <option value="link">Via URL</option>
          <option value="file">Via fichier</option>
        </select>
        <div v-if="addMode === 'link'" class="add-track-controls">
          <input type="text" v-model="newTrackURL" placeholder="Enter audio URL" />
          <button @click="addTrackFromURL">Ajouter</button>
        </div>
        <div v-if="addMode === 'file'" class="add-track-controls">
          <input type="file" @change="handleFileUpload" />
          <button @click="addUploadedFile" :disabled="!selectedFile">Ajouter le fichier choisi</button>
        </div>
      </div>
    </section>
  </div>
</template>

/* La partie JavaScript */
<script>
export default {
  data() {
    return {
      playlist: [], // Ajoutez une propriété pour stocker la playlist
      currentTrack: null, // ... pour stocker la piste en cours de lecture
      repeatMode: 'list', // ... pour gérer le mode de répétition
      addMode: 'file', // ... pour gérer le mode d'ajout de piste
      newTrackURL: '', // ... pour stocker l'URL de la nouvelle piste
      selectedFile: null, // ... pour stocker le fichier sélectionné
      audio: new Audio(), // Créez une instance de l'objet Audio
      isPlaying: false, // Etat de lecture
      currentTime: 0, // Position de lecture
    };
  },
  created() {
  this.loadPlaylist(); // Charge la playlist depuis le stockage local
},
  methods: {
    loadPlaylist() { // Fonction pour charger la playlist
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const selectedPlaylistIndex = JSON.parse(localStorage.getItem('selectedPlaylistIndex')) || 0;

    if (playlists[selectedPlaylistIndex]) {
      this.playlist = playlists[selectedPlaylistIndex].tracks;
    } else {
      this.playlist = [];
    }
    },
    savePlaylist() { // Fonction pour sauvegarder la playlist
    const playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    const selectedPlaylistIndex = JSON.parse(localStorage.getItem('selectedPlaylistIndex')) || 0;

    if (playlists[selectedPlaylistIndex]) {
      playlists[selectedPlaylistIndex].tracks = this.playlist;
      localStorage.setItem('playlists', JSON.stringify(playlists));
    }
    },
    playTrack(index) { // Fonction pour jouer une piste
      const track = this.playlist[index];
      if (!track || track.error) return;
      this.currentTrack = track;
      this.audio.src = track.src;
      this.audio.play();
      this.isPlaying = true;

      // Ajoute un ecouteur pour actualiser la progression
      this.audio.addEventListener('timeupdate', this.updateProgress);
      this.audio.addEventListener('ended', this.handleTrackEnd);
    },
    stopTrack() { // Fonction pour arrêter la piste
      this.audio.pause();
      this.audio.currentTime = 0;
      this.isPlaying = false;
      this.currentTrack = null;

      // On supprime les ecouteurs
      this.audio.removeEventListener('timeupdate', this.updateProgress);
    },
    togglePlayPause() { // Fonction pour jouer ou mettre en pause la piste
      if (this.isPlaying) {
        this.audio.pause();
      } else {
        this.audio.play();
      }
      this.isPlaying = !this.isPlaying;
    },
    removeTrack(index) { // Fonction pour supprimer une piste
      this.playlist.splice(index, 1);
    if (this.currentTrack === this.playlist[index]) {
      this.stopTrack();
    }
    this.savePlaylist();
    },
    seekTrack(event) { // Fonction pour changer la position de lecture
      const newTime = event.target.value;
      this.audio.currentTime = newTime;
    },
    updateProgress() { // Fonction pour actualiser la progression de la piste
      this.currentTime = this.audio.currentTime;
    },
    handleTrackEnd() { // Fonction pour gérer la fin de la piste
      if (this.repeatMode === 'track') { // Si le mode de répétition est 'Répéter la liste'
        this.audio.currentTime = 0;
        this.audio.play();
      } else if (this.repeatMode === 'list') { // Si le mode de répétition est 'Répéter la piste'
        const currentIndex = this.playlist.indexOf(this.currentTrack);
        const nextIndex = (currentIndex + 1) % this.playlist.length;
        this.playTrack(nextIndex);
      } else { // Si le mode de répétition est 'Ne pas répéter'
        this.stopTrack();
      }
    },
    handleFileUpload(event) { // Fonction pour gérer un fichier par l'utilisateur
      this.selectedFile = event.target.files[0];
    },
    addTrackFromURL() { // Fonction pour ajouter une piste depuis une URL
      if (!this.newTrackURL) return;
      this.playlist.push({ title: this.newTrackURL.split('/').pop(), src: this.newTrackURL, error: false });
      this.newTrackURL = '';
      this.savePlaylist();
    },
    addUploadedFile() { // Fonction pour ajouter un fichier ajouté localement
      if (!this.selectedFile) return;
      const src = URL.createObjectURL(this.selectedFile);
      this.playlist.push({ title: this.selectedFile.name, src, error: false });
      this.selectedFile = null;
    },
    formatTime(seconds) { // Fonction pour formater le temps en minutes:secondes
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

/* La partie CSS */
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
.player-controls {
  display: flex;
  justify-content: center;
  gap: 10px; 
}
.playlist-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.playlist-controls {
  display: flex;
  gap: 10px;
}
.add-track-controls {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>
