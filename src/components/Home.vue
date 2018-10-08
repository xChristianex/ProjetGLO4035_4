<template>
    <div>
        <h1>Portail</h1>
        <div>GLO-3102 Portail</div>
      <button v-on:click="estServeur" id="idEstServeur">est Serveur Present</button>
      <label id="idEstPresent"></label>
      <br>
      <input type="text" id="myText" value="Some text...">
      <br>
    </div>
</template>

<script>
/* eslint-disable */
export default {
    name: 'Home',
  data() {
    return {
      items: []
    };
  },
  methods: {
    estServeur() {
      const xhttp = new XMLHttpRequest();
      // const apiURL = 'https://glo3102lab4.herokuapp.com/';
       const apiURL = 'https://ubeat.herokuapp.com/';
      // const apiURL = 'localhost:27017';
      //debugger;
      console.log("debut");
      document.getElementById('myText').value = "debut";
      xhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          document.getElementById('idEstPresent').innerHTML += this.responseText;
          //document.getElementById('myText').value += this.responseText;
        } else {
          document.getElementById('idEstPresent').innerHTML += `this.readyState=${this.readyState}:: this.status=${this.status}`;
          //document.getElementById('myText').value += `this.readyState=${this.readyState}:: this.status=${this.status}`;
        }
      };
      xhttp.open("GET", apiURL, true);
      xhttp.send();
      console.log("fin");
    },
  }
  };
</script>
<style>
label{
  border-style: groove;
}
</style>
