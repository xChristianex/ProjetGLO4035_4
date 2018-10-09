<template>
    <div>
        <h1>Autre Chose</h1>
        <div>GLO-3102 Autres concepts</div>
      <button v-on:click="extraction('blog')">Extraire collection InventaireZ PAR ID (mode brut)</button>
      <div v-for="(item,i) in items" :key="i"  class="classInventaire">
        i:: {{i}}
        <br>
        le ID: {{item._id}}
        <br>
        la phrase: {{item.phrase}}
        <br>
        le sujet: {{item.sujet}}
        <br>
      </div>

    </div>
</template>

<script>
  /* eslint-disable */
  import * as api from '../router/api';

  export default {
    name: 'Inventaire',

    data() {
      return {
        items: []
      };
    },
    methods: {
      extraction(event) {
        console.log("debut extraction");
        /* const messasge = `Bonjour ${this.name} !`;
        alert(messasge); */
        // if (event) {
        // alert(event.target.tagName);
        // }
        const albumI = event; // '1125488753';
        api.getinventaireZID(albumI).then((response) => {
          //if (response.lenght > 0) {
          // debugger;
          this.items = response;
          //}
          /*
                   for (let i = 0; response.length > i; i += 1) {
                    // response = response;
                    const album = this.makeAlbumFromData(response[i]);
                    api.getAlbumTracks(album.albumId).then((responseTrack) => {
                      for (let it = 0; responseTrack.length > it; it += 1) {
                        album.tracks.push(this.makeTrackFromData(responseTrack[it]));
                      }
                    });
                    this.items = [album];
                    // this.items.push(album); // pour le livrable 3
                  } */
        });
        console.log("fin extraction");
      },

    }

  };
</script>

<style>
  .classInventaire{
    background-color: burlywood;
    border-style: groove;
  }
</style>
