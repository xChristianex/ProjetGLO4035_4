/* eslint-disable */
var express = require('express'),
    path = require('path'),
    http = require('http'),
    documents = require('./routes/sentiers');

// Module pour le traitement de fichier upload
var formidable = require('formidable');
var fs = require('fs');
const bodyParser = require('body-parser');

//J'appelle la librairie express pour obtenir les fondements
//de la structure et des fonctionnalités d'une application web

var app = express();
/**/
//app.configure(function() {
app.set('port', process.env.PORT || 5000);
//app.use(express.bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
// app.use(express.logger('dev')); /* 'default', 'short', 'tiny', 'dev' */
/*
   app.use(express.bodyParser()),
        app.use(bodyParser.json()),
        app.use(bodyParser.urlencoded({ extended: true })),
        app.use(express.static(path.join(__dirname, 'public')));
    */
//});

// Fonctions pour le traitement des documents jSON
app.get('/search', documents.searchByWord);
app.get('/musickon3399', documents.findAll);
app.get('/inventaireZ', documents.inventaireZ);
app.get('/musickon/:id', documents.findById);
app.post('/musickon', documents.addFile);
app.put('/musickon/:id', documents.updateFile);
app.delete('/musickon/:id', documents.deleteFile);

//************************************************** */
// Fonctions traitements des comptes Membre-Mélomanes
// Traitement du compte utilisateur "Mélomanes"
//app.get('/leGetLogin', documents.getPassword);
app.put('/leLoginAjout/:id', documents.verifyLogin);

app.post('/membreAjoutToto', documents.addMembre);
app.put('/membreAjoutToto', documents.addMembre);


app.get('/membreAffiche', documents.findAllMembre);
app.get('/membreAffiche', documents.findOneMember);
app.get('/membreAffiche/:id', documents.findOneMember);

//Main action html de la page STAT
app.get('/statistique', documents.findAllStat);
//Sous branche de statistique À VALIDER --> si on utilise get/post/put
//Calcul le nombre de membre dans la BD
app.get('/nombreDeMembres', documents.findNbrDeMembres);
app.post('/nombreDeMembres', documents.findNbrDeMembres);
app.put('/nombreDeMembres', documents.findNbrDeMembres);
//Sous branche de statistique
//Renvoie la liste des préférences des membres par région
app.get('/musiqueFavParReg', documents.findMusiqueFavParReg); //ac:ok
app.post('/musiqueFavParReg', documents.findMusiqueFavParReg); //ac:ok
app.put('/musiqueFavParReg', documents.findMusiqueFavParReg); //ac:ok

//modelsLeLoginAjout.js
// placer main.js en bas en bas de index.html
// main.js : des modif
// server.js : des modif
// musickon.js : des modif
//************************************************** */


// Fonctions pour le traitement de chargement du fichier
//app.get('/', documents.getFile);
//app.post('./uploads', documents.uploadFile);

app.get('/', function(req, res) {
    console.log('DEBUT res.sendFile ')
    res.sendFile(path.join(__dirname, 'public/uploads')); // views
});

app.post('/uploads', function(req, res) {
    console.log('DEBUT upload ')
        // createion d'un objet de type "form incoming"
    var form = new formidable.IncomingForm();

    // On spécifie ici si on veut que l'utilisateur upload un ou plusieurs fichiers
    form.multiples = false;
    // On précise que l'on a besoin de l'extension
    form.keepExtensions = true;

    // On précise le répertoire des fichiers en uploads
    form.uploadDir = path.join(__dirname, './uploads');
    console.log('Répertoire upload ');
    // every time a file has been uploaded successfully,
    // rename it to it's orignal name
    form.on('file', function(field, file) {
        console.log('Fichier upload ');
        fs.rename(file.path, path.join(form.uploadDir, file.name));
    });

    // log any errors that occur
    form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
        throw err;
    });

    // once all the files have been uploaded, send a response to the client
    form.on('end', function() {
        console.log('upload avec succes');
        res.end('success');
    });

    console.log('fin upload');
    // parse the incoming request containing the form data
    form.parse(req);

});


app.listen(5000);
console.log('Listening on port 5000...');
