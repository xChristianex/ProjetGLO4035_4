/* eslint-disable import/prefer-default-export */
/* eslint-disable */
import axios from 'axios';

const baseUrl = 'https://ubeat.herokuapp.com/unsecure';
const mongoURL = 'http://localhost:8080';
// const baseUrl = 'https://ubeat.herokuapp.com/';
// npm install axios
// npm install express --save
// npm install body-parser
// npm install mongodb --save
// npm --loglevel verbose install mongodb

// const mongo = require('mongodb');
// const mongo = require('mongodb').MongoClient;
/*
let dbHost = 'localhost';
let dbPort = '27017';
let Db = mongo.Db;
let Connection = mongo.Connection;
let Server = mongo.Server;
// Appel du server de la bd mongoDB
let serverDB = new Server(dbHost, dbPort, { auto_reconnect: true });
Db = new Db('ulaval', serverDB, { safe: true });

// Recherche tous les documents de musicothèques
exports.findAll = function(req, res) {
  console.log('FindAll*** - Recherche de tous les documents');
  Db.collection('blog', function(err, collection) {
    collection.find().toArray(function(err, items) {
      console.log('FindAll*** - Documents trouvés et retournés');
      res.send(items);
    });
  });
};
*/
// mode: "cors",
export const getBlog = collectionId =>
  axios({
    method: 'GET',
    url: `${mongoURL}/musickon3399`,
  }).then(response => response.data)
    .catch(error => error);

export const getinventaireZ = inventaireId =>
  axios({
    method: 'GET',
    url: `${mongoURL}/inventaireZ`,
  }).then(response => response.data)
    .catch(error => error);

export const getinventaireZID = inventaireId =>
  axios({
    method: 'GET',
    url: `${mongoURL}/inventaireZ/5`,
  }).then(response => response.data)
    .catch(error => error);

export const getAlbum = collectionId =>
  axios({
    method: 'GET',
    url: `${baseUrl}/albums/${collectionId}`,
  }).then(response => response.data.results)
    .catch(error => error);

export const getAlbumTracks = collectionId =>
  axios({
    method: 'GET',
    url: `${baseUrl}/albums/${collectionId}/tracks`,
  }).then(response => response.data.results)
    .catch(error => error);

export const addTrack = (playlistId, track) => {
  axios({
    method: 'POST',
    url: `${baseUrl}/playlists/${playlistId}/tracks/`,
    data: track,
  }).then(response => response)

    .catch(error => error);
};
export const deletePlaylist = playlistId =>
  axios({
    method: 'DELETE',
    url: `${baseUrl}/playlists/${playlistId}`,
  });

export const addPlaylist = (playlistName, owner) => {
  const data = { name: playlistName, owner };
  return axios({
    method: 'POST',
    url: `${baseUrl}/playlists`,
    data
  });
};
