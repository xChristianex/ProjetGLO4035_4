<template>
  <div>
  <button v-on:click="company('blog')">Extraire collection company  (mode brut)</button>
  <div v-for="(item,i) in items" :key="i"  class="classInventaire">
    i:: {{i}}
    <br>
    le ID: {{item._id}}
    <br>
    la phrase: {{item.address}}
    <br>
    le sujet: {{item.geometry}}
    <br>
  </div>
  </div>
</template>

<script>
  /* eslint-disable */
  import * as api from '../router/api';

    export default {
        name: 'MLab',
      data() {
        return {
          items: []
        };
      },
      methods: {
      company(event) {
        console.log("debut company");

        const albumI = event; // '1125488753';
        api.getCompany(albumI).then((response) => {

          this.items = response;

        });
        console.log("fin company");
      },
    }
 }
</script>

<style scoped>

</style>
