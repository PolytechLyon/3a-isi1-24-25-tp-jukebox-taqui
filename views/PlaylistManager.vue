/*
  Ce composant permet de gérer les listes de lecture. 
  Il permet de créer une nouvelle liste de lecture,
  de sélectionner une liste de lecture existante et de supprimer une liste de lecture.
  Il affiche la liste des listes de lecture existantes,
  avec le nombre de titres qu'elles contiennent.
*/
/* La partie HTML*/
<template>
  <div>
    <h1>Gestion des listes de lecture</h1>
    <form @submit.prevent="createPlaylist" class="playlist-form">
      <input v-model="newPlaylistName" placeholder="Nom de la nouvelle liste" />
      <button type="submit" class="playlist-creation">Créer</button>
    </form>
    <ul>
      <li v-for="(playlist, index) in playlists" :key="index" class="playlist-item">
        <span>{{ playlist.name }} ({{ playlist.tracks.length }} titres)</span>
        <div class="playlist-controls">
          <button @click="selectPlaylist(index)" :disabled="selectedPlaylistIndex === index">Sélectionner</button>
          <button @click="deletePlaylist(index)" :disabled="playlist.name === 'main'">Supprimer</button>
        </div>
      </li>
    </ul>
    <router-link to="/">Retour au Jukebox</router-link>
  </div>
</template>

/* La partie JavaScript*/
<script>
export default {
  data() {
    return {
      playlists: JSON.parse(localStorage.getItem('playlists')) || [], // Ajoutez une propriété pour stocker les listes de lecture
      newPlaylistName: '', // ... pour stocker le nom de la nouvelle liste
      selectedPlaylistIndex: JSON.parse(localStorage.getItem('selectedPlaylistIndex')) || 0 // ... pour stocker l'index de la liste sélectionnée
    };
  },
  created() {
    // Vérifiez si la playlist "main" existe, sinon ajoutez-la
    if (!this.playlists.some(playlist => playlist.name === 'main')) {
      this.playlists.push({ name: 'main', tracks: [] });
      this.savePlaylists();
    } else {
      this.playlists = JSON.parse(localStorage.getItem('playlists')) || [];
    }
  },
  methods: {
    createPlaylist() { // Fonction pour créer une nouvelle liste de lecture
      if (this.newPlaylistName.trim()) {
        this.playlists.push({ name: this.newPlaylistName, tracks: [] });
        this.newPlaylistName = '';
        this.savePlaylists();
      }
    },
    selectPlaylist(index) { // Fonction pour sélectionner une liste de lecture
    this.selectedPlaylistIndex = index;
    localStorage.setItem('selectedPlaylistIndex', JSON.stringify(index));
    this.$router.push('/'); // Redirige vers le Jukebox
    },
    deletePlaylist(index) { // Fonction pour supprimer une liste de lecture
      if (this.playlists[index].name !== 'main') {
        this.playlists.splice(index, 1);
        if (this.selectedPlaylistIndex === index) {
          this.selectedPlaylistIndex = 0;
          localStorage.setItem('selectedPlaylistIndex', JSON.stringify(0));
        }
        this.savePlaylists();
      }
    },
    savePlaylists() { // Fonction pour enregistrer les listes de lecture
      localStorage.setItem('playlists', JSON.stringify(this.playlists));
    }
  }
};
</script>

/* La partie CSS*/
<style scoped>
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
.playlist-creation {
  margin-left: 10px;
}
.playlist-form {
  display: flex;
  align-items: center;
  gap: 20px;
}
</style>