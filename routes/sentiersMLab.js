/* eslint-disable */
console.log("DEBUT sentier.js");
/*
var mongo = require('mongodb'),
    dbHost = 'localhost',
    dbPort = '27017';
var Db = mongo.Db;
var Connection = mongo.Connection;
var Server = mongo.Server;
*/
// Module pour le traitement de fichier upload
var Mongo = require('mongodb');
var formidable = require('formidable');
/*
// Appel du server de la bd mongoDB
var serverDB = new Server(dbHost, dbPort, { auto_reconnect: true });
db = new Db('blog', serverDB, { safe: true });
*/
//Ouverture de la base de données MongoBD plus spécifiquement Musickon avec la collection musicothèque

const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
let dbServeur;
// Connection URL
// const url = 'mongodb://localhost:27017';  // ac:ok
//const url = 'mongodb://ds133796.mlab.com:33796/duproprio';
const url = 'mongodb://glo4035:lolk1234@ds133796.mlab.com:33796/duproprio';



// Database Name
// const dbName = 'ulaval';  // ac:ok
const dbName = 'duproprio';
const laCollection = 'company';////////'inventaireZ';
const laCompany= 'company';

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  const db = client.db(dbName);
  dbServeur = db;
  console.log("Open - Connected to "+laCollection+" database");
  db.collection(laCollection, { safe: true }, function(err, collection) {
    if (err) {
      console.log("The \"+laCollection+\" collection doesn't exist. Creating it with sample data...");
      //populateDB();
    } else {
      console.log("The ["+laCollection+"] collection exist.");
    }
  });
  //client.close();
});
//Recherche par mot clé d'un ou de plusieurs documents
//db.musicotheques.find({"$text":{$search:"ariane",$caseSensitive:false}}, {"titre_album":1,"artiste":1,"parution":1,"pays":1,"style_musical":1})
exports.searchByWord = function(req, res) {
    console.log('searchByWord - Recherche de tous les documents');
    var words = 'québécois';
    db.collection('musicotheques', function(err, collection) {
        //db.collection.find({ $text: { $search: "text zone keywords" } }).toArray(function(err, items)
        collection.find({ '$text': { '$search': words, $caseSensitive: false } }).toArray(function(err, items) {
            console.log('searchByWord - Documents trouvés et retournés');
            console.log(items);
            res.send(items);
        });
    });
};

//Recherche tous les documents de musicothèques
exports.findAll = function(req, res) {
    console.log('exports.findAll*** - Recherche de tous les documents de '+laCollection);
    dbServeur.collection( laCollection, function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('FindAll*** - Documents '+laCollection+' trouvés et retournés');
            console.log(items);
            res.send(items);
        });
    });
};
exports.inventaireZ = function(req, res) {
  let id = req.params.id;
  let findTheONe = { _id: 5 };
  console.log('exports.inventaireZ *** - Recherche de tous les documents de '+laCollection);
  dbServeur.collection( laCollection, function(err, collection) {
    collection.find().toArray(function(err, items) {
      res.send(items);
      console.log('zFindAll*** - Documents '+laCollection+' trouvés et retournés: items.lenght=' + 'items.lenght()');
    });
  });
};
/*
*      if (err) {
        console.log("problème de recherche du document");
      } else {
        console.log(items);
      }
* */
//Recherche d'un document précis par ID selon le choix de l'utilisateur
exports.findById = function(req, res) {
  let id = req.params.id;
  let findTheONe = { _id: 5 };
  console.log('FindById - dans '+laCollection+' Recherche document: ' + id);
  dbServeur.collection(laCollection, function(err, collection) {
    // collection.findOne({ '_id': new Mongo.ObjectId(id) }, function(err, item) {
    collection.findOne( findTheONe, function(err, items) {
    //collection.find( findTheONe, function(err, items) {
    //collection.findOne( { "sujet": "pomme, " }, function(err, item) {
      res.send(items);
      console.log('findOne   item=' + items.data );
    });
  });
};


exports.findCompany = function(req, res) {
  console.log('exports.findCompany*** - Recherche de tous les documents de '+laCompany);
  dbServeur.collection( laCompany, function(err, collection) {
    collection.find().limit(20).toArray(function(err, items) {
      console.log('findCompany*** - Documents '+laCompany+' trouvés et retournés');
      res.send(items);
      console.log(items);

    });
  });
};




//Ajoute un document en format JSON
exports.addFile = function(req, res) {
    var documents = req.body;
    var existDocument = false;
    console.log('AddFile - Ajouter documents: ' + JSON.stringify(documents));
    db.collection('musicotheques', function(err, collection) {
        collection.insert(documents, { safe: true }, function(err, result) {
            if (err) {
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};



//Modifie un document spécifique selon le ID ciblé avec le document complet envoyé
exports.updateFile = function(req, res) {
    var id = req.params.id; //id du document
    var documents = req.body; //document au complet
    delete documents._id;
    console.log('UpdateFile - Modifier documents: ' + id);
    console.log(JSON.stringify(documents));
    db.collection('musicotheques', function(err, collection) {
        collection.update({ '_id': new mongo.ObjectId(id) }, documents, { safe: true }, function(err, result) {
            if (err) {
                console.log('Error updating document(s): ' + err);
                res.send({ 'error': 'An error has occurred' });
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(documents);
            }
        });
    });
};

//Supprime un document spécifique en fonction du ID
exports.deleteFile = function(req, res) {
    console.log("DeleteFile - Suppression d'un document: " + req.params.id);
    if (!req.params.id) return next(new Error('Aucun ID de document'));
    db.collection("musicotheques").remove({ "_id": new mongo.ObjectId(req.params.id) }, function(err, obj) {
        if (err) throw err;
        console.log(obj.result.n + " document supprimé");
        res.send(req.body);
    });
};

//************************************************ */
//---- SECTION POUR TRAITER LES MÉLOMANES ----------

/*ac: Connexion membres de la BD */
exports.verifyLogin = function(req, res) {
    console.log("exports.verifyLogin   req.params=" + req.params);
    var user_id = req.params; //('id');
    var idd = req.params._id;
    var vLogin = req.body;
    console.log('Adding LOGIN: ' + JSON.stringify(vLogin));
    console.log("1exports.verifyLogin user_id=" + vLogin.nomDuCompte);
    console.log("2exports.verifyLogin user_id=" + vLogin.motDePasse);
    db.collection('membres', function(err, collection) {
       // console.log(" db.collection('membres', function(err, collection)");
       // db.membres.find( {}, { nomDuCompte:"abc", motDePasse:"cba"} ).pretty()
        // db.membres.find(  { nomDuCompte:"abc", motDePasse:"cba"} ).pretty()
        // db.membres.find(  { nomDuCompte:"bebe", motDePasse:"ebeb"} ).pretty()
        //db.membres.find(  { nomDuCompte:"bebe" } )
        collection.find({ nomDuCompte: vLogin.nomDuCompte, motDePasse: vLogin.motDePasse }).toArray(function(err, items) {
            console.log("JSON.stringify(items)=" + JSON.stringify(items));
            console.log("3 exports.verifyLogin  err=" + err);
            console.log("items.length=" + items.length );
            if (!items.length) {
                return res.status(400).send('Missing username or password');
            }
            console.log('Success: ' + JSON.stringify(items[0]));
            res.send(items[0]);

        });
    });
};

/*ac: Insertion de membres de la BD */
exports.addMembre = function(req, res) {
    var member = req.body;
    console.log('Ajouter Membre: ' + JSON.stringify(member));
    db.collection('membres', function(err, collection) {
        collection.insert(member, { safe: true }, function(err, result) {
            if (err) {
                res.send({ 'error': 'An error membres has occurred' });
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
};

/*ac: Liste des membres de la BD */
exports.findAllMembre = function(req, res) {
    //"use strict";
    console.log("musickon.js    exports.findAllMembre");

    db.collection('membres', function(err, collection) {
        collection.find().sort({ Ville: 1 }).toArray(function(err, items) {
            console.log("collection.find().toArray(function(err, items)");
            //console.log( items.length );
            //console.log( items );
            var debut = "<ul class='quote'> aa "
            var fin = " </ul>"
                // debut +=   items[1].name + fin
            res.send(items);
        });
    });
};
exports.findOneMember = function(req, res) {
    //"use strict";
    console.log("findOneMember");
    var member = req.body;
    console.log('Get one Member findOneMember ' + JSON.stringify(member));
    //body.appendChild(e);
    db.collection('membres', function(err, collection) {
        collection.find({ nomDuCompte: member.nomDuCompte, motDePasse: member.motDePasse }).toArray(function(err, items) {
            //console.log( items.length );
            //console.log( items );
            var debut = "<ul class='quote'> aa "
            var fin = " </ul>"
                // debut +=   items[1].name + fin
            res.send(items);
        });
    });
};

/*ac: Statistique */
exports.findAllStat = function(req, res) {
    console.log("avemues.js    exports.findAllStat");

    db.collection('statistique', function(err, collection) {
        collection.find().toArray(function(err, items) {
            console.log('statistique: ' + JSON.stringify(items));
            res.send(items);
        });
    });
};

/*ac: Nombre de Membres */
/*
 var get_total_num_docs = function(db_client, query, cb){
  db_client.collection(query['collection'], function(e, coll) {
    coll.find(query.params, query.options).count(function (e, count) {
      console.log(count);
      return cb(e, count);
    });
  });
};
*/
exports.findNbrDeMembres = function(req, res) {
        console.log("avemues.js    exports.findNbrDeMembres");
        db.collection('membres', function(err, collection) {
            //db.membres.find().count()
            collection.find().count(function(err, countMembres) {
                //console.log('membres count: ' + JSON.stringify(items));
                console.log('membres countMembres: ' + JSON.stringify(countMembres));
                var strJson = '{ "_id":0, "nomDuCompte":"game", "nbrMembre":' + countMembres + '}'
                    //{ "_id":0, "nomDuCompte":"game", "nbrMembre":"3" }
                    //res.send(items);
                console.log('strJson=' + strJson);
                console.log('res.send( JSON.parse(strJson) );: ' + JSON.parse(strJson));
                res.send(JSON.parse(strJson));
            });
        });
    }
    /* Version précédente avec count JS
    exports.findNbrDeMembres = function(req, res) {
        console.log("avemues.js    exports.findNbrDeMembres");
        db.collection('membres', function(err, collection) {
            collection.find().toArray(function(err, items) {
                //console.log('membres count: ' + JSON.stringify(items));
                console.log('membres items.length: ' + JSON.stringify(items.length));
                var strJson = '{ "_id":0, "nomDuCompte":"game", "nbrMembre":' + items.length + '}'
                    //{ "_id":0, "nomDuCompte":"game", "nbrMembre":"3" }
                    //res.send(items);
                console.log('strJson=' + strJson);
                console.log('res.send( JSON.parse(strJson) );: ' + JSON.parse(strJson));
                res.send(JSON.parse(strJson));
            });
        });
    }*/

/*ac: Musiques favorites par région */
exports.findMusiqueFavParReg = function(req, res) {
    db.collection('StatMusFavParReg', function(err, collection) {
        collection.find().sort({ region: 1 }).toArray(function(err, items) {
            console.log('findMusiqueFavParReg: ' + JSON.stringify(items));
            res.send(items);
        });
    });
};

//************************************************ */

/*
exports.getFile = function(req, res){
    console.log('DEBUT res.sendFile ')
    res.sendFile(path.join(__dirname, 'public/index.html'));// views
};

exports.uploadFile = function(req, res){
    console.log('DEBUT upload ')
      // create an incoming form object
      var form = new formidable.IncomingForm();

      // specify that we want to allow the user to upload multiple files in a single request
      form.multiples = true;

      // store all uploads in the /uploads directory
      form.uploadDir = path.join(__dirname, '/uploads');

      // every time a file has been uploaded successfully,
      // rename it to it's orignal name
      form.on('file', function(field, file) {
        fs.rename(file.path, path.join(form.uploadDir, file.name));
		console.log('Fichier upload ');
      });

      // log any errors that occur
      form.on('error', function(err) {
        console.log('An error has occured: \n' + err);
      });

      // once all the files have been uploaded, send a response to the client
      form.on('end', function() {
		console.log('upload avec succes');
        res.end('success');
      });

	  console.log('fin upload');
      // parse the incoming request containing the form data
      form.parse(req);

};
*/

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {

    var documents = [{
            "titre_album": "Quelqu'un m'a dit",
            "artiste": "Carla Bruni",
            "image_album": "album_carla_bruni.jpg",
            "descript": "Quelqu'un m'a dit",
            "style_musical": "pop français",
            "support": "cd",
            "compagnie": "audiogram",
            "parution": "2003",
            "pays": "France",
            "evaluation": "4.5",
            "mot_cle": "guitare voix rauque jeux mots brillant"
        },
        {
            "titre_album": "Himalaya mon amour",
            "artiste": "Alex Nevsky",
            "image_album": "album_himalaya.jpg",
            "descript": "Les coloriés, On leur a fait croire, Tuer le désir",
            "style_musical": "pop québécois",
            "support": "cd",
            "compagnie": "audiogram",
            "parution": "2013 ",
            "pays": "Canada",
            "evaluation": "4.5",
            "mot_cle": "coloriés himalaya guitare musique douce"
        },
        {
            "titre_album": "Le coeur dans la tête",
            "artiste": "Ariane Moffat",
            "image_album": "album_lecoeur_ArianeM.jpg",
            "descript": "Imparfait, Farine Five Roses, Se Perdre, Terminus",
            "style_musical": "pop québécois",
            "support": "cd",
            "compagnie": "audiogram",
            "parution": "2005",
            "pays": "Canada",
            "evaluation": "4",
            "mot_cle": "électro-pop sujet montréal"
        },
        {
            "titre_album": "Pierre Lapointe",
            "artiste": "Pierre Lapointe",
            "image_album": "album_pierre-lapointe.jpg",
            "descript": "columbarium, vous, plaisirs dénudés, pointant le nord",
            "style_musical": "pop québécois",
            "support": "cd",
            "compagnie": "audiogram",
            "parution": "2004",
            "pays": "Canada",
            "evaluation": "5",
            "mot_cle": "piano accord classique style rétro"
        },
        {
            "titre_album": "Solitudes",
            "artiste": "Matt Holubowski",
            "image_album": "album_solitude.jpg",
            "descript": "la mer/mon pere, the king, l'imposteur, the year i was undone",
            "style_musical": "folk",
            "support": "cd",
            "compagnie": "audiogram",
            "parution": "2016",
            "pays": "Canada",
            "evaluation": "4",
            "mot_cle": "guitare sèche classique rappel patrick watson"
        },
        {
            "titre_album": "Trente",
            "artiste": "Karim Ouellet",
            "image_album": "album_trente_KarimO.jpg",
            "descript": "description_album",
            "style_musical": "pop québécois",
            "support": "cd",
            "compagnie": "coyote records",
            "parution": "2016",
            "pays": "Canada",
            "evaluation": "4",
            "mot_cle": "musique électro-pop"
        }
    ];

    db.collection('musicotheques', function(err, collection) {
        collection.insert(documents, { safe: true }, function(err, result) {});
    });

};

//  SECTION POPULATE MEMBER
var populateMembres = function() {

    var c_Membres = [
        { _id: 0, "nomDuCompte": "qwer", "motDePasse": "asdf", "confirmationMotDePasse": "zxcv", "imageDuCompte": "bidon4", "moisAnnee": "bidon5", "genre": "bidon6", "Ville": "bidon7", "Province": "bidon8", "Pays": "bidon9", "Code": "bidon10", "Telephone": "bidon11" },
        { _id: 1, "nomDuCompte": "abc", "motDePasse": "cba", "confirmationMotDePasse": "rt", "imageDuCompte": "fgh", "moisAnnee": "rt", "genre": "ui", "Ville": "jk", "Province": "nm", "Pays": "gh", "Code": "67", "Telephone": "234234 234234" },
        { _id: 2, nomDuCompte: 'Le Trois', motDePasse: 'mot mot mot ', confirmationMotDePasse: 'mot mot mot', imageDuCompte: 'Three', moisAnnee: 'Mars', genre: 'ui', Ville: 'Marcino', Province: 'QQ', Pays: 'gh', Code: '67', Telephone: '234234 234234' }
    ];
    //db.membres.insert( c_Membres);
    //db.membres.insert( {	   _id: 4,        nom: "Nombre de mElomane par groupe d'age",        annee: "1899",		leLien: "nbMeloParGroupeDage"    } )
    //db.membres.find().pretty()
    //db.membres.drop()
    db.collection('membres', function(err, collection) {
        collection.insert(c_Membres, { safe: true }, function(err, result) {});
    });
};


//  SECTION POPULATE STATISTIQUE
var populateStat = function() {

    var c_statistique = [{
            _id: 0,
            nom: "Nombre de Membres",
            annee: "2017",
            leLien: "nombreDeMembres",
            actif: 1
        },
        {
            _id: 1,
            nom: "Musiques favorites par région",
            annee: "2109",
            leLien: "musiqueFavParReg",
            actif: 1
        },
        {
            _id: 2,
            nom: "Nombre de mélomane par région",
            annee: "2209",
            leLien: "nbMeloParREgion",
            actif: 1
        },
        {
            _id: 3,
            nom: "TOP 10 musical",
            annee: "2009",
            leLien: "top10Musical",
            actif: 0
        },

        {
            _id: 4,
            nom: "Artistes favoris par région",
            annee: "2209",
            leLien: "artiteFavoriParREgion",
            actif: 0
        },

        {
            _id: 5,
            nom: "Nombre de mélomanes par groupe d'age",
            annee: "1899",
            leLien: "nbMeloParGroupeDage",
            actif: 0
        },
        {
            _id: 6,
            nom: "Nombre de nombres par groupe( ... )",
            annee: "1899",
            leLien: "nbMeloParGroupeDeGroupe",
            actif: 0
        }

    ];

    db.collection('statistique', function(err, collection) {
        collection.insert(c_statistique, { safe: true }, function(err, result) {});
    });

    // db.statistique.insert( c_statistique);
    //db.statistique.insert( {	   _id: 4,        nom: "Nombre de mElomane par groupe d'age",        annee: "1899",		leLien: "nbMeloParGroupeDage"    } )
    //db.statistique.find().pretty()
    // db.statistique.drop()

};


var populateStatMusFavParReg = function() {

    var c_StatMusFavParReg = [{
            _id: 0,
            region: "SHERBROOKEA",
            MusFav: "Country",
            leLien: ""
        },
        {
            _id: 1,
            region: "SHERBROOKEA",
            MusFav: "Jazz",
            leLien: ""
        },
        {
            _id: 2,
            region: "SHERBROOKEA",
            MusFav: "Lounge",
            leLien: ""
        },
        {
            _id: 3,
            region: "SHERBROOKEZ",
            MusFav: "Rock n Roll",
            leLien: ""
        },
        {
            _id: 4,
            region: "SHERBROOKEZ",
            MusFav: "Classique",
            leLien: ""
        },
        {
            _id: 5,
            region: "SHERBROOKEZ",
            MusFav: "Pop",
            leLien: ""
        },
        {
            _id: 6,
            region: "SHERBROOKEM",
            MusFav: "Franco",
            leLien: ""
        },
        {
            _id: 7,
            region: "SHERBROOKEM",
            MusFav: "Musique du Monde",
            leLien: ""
        },
        {
            _id: 8,
            region: "SHERBROOKEM",
            MusFav: "Metal",
            leLien: ""
        }
    ];

    db.collection('StatMusFavParReg', function(err, collection) {
        collection.insert(c_statistique, { safe: true }, function(err, result) {});
    });
    // db.StatMusFavParReg.insert( c_StatMusFavParReg);
    // db.StatMusFavParReg.find().pretty()
    // db.StatMusFavParReg.drop()
};
/*
verbes = ["Je mange ", "Tu bois ", "Il joue ",  "Nous voulons ", "Vous verrez ", "Ils sauront "]
adjs = ["une bonne ", "du délicieux ",  "du difficile ", "des étranges ", "de la grande ", "un beau "]
noms = ["pomme, ", "thé, ", "béton, ", "tâches, ", "gomme, ", "piano, "]
advs = ["activement.", "passionnément.", "passivement.", "lentement.", "amicalement.", "chronologiquement."]

for (var i = 0; i < 37; i++) {
 db.inventaireZ.insert({ "_id" : i, "phrase" : verbes[Math.round(5*Math.random())] +
 adjs[Math.round(5*Math.random())] + noms[Math.round(5*Math.random())] +
 advs[Math.round(5*Math.random())], "sujet" : noms[Math.round(5*Math.random())] })
 ;}

db.inventaireZ.find()
db.inventaireZ.find().count()
 */


/*
db.open(function(err, db) {
    if (!err) {

        console.log("Open - Connected to MusickOn database");
        db.collection('musicotheques', { safe: true }, function(err, collection) {
            if (err) {
                console.log("The musicotheques collection doesn't exist. Creating it with sample data...");
                populateDB();
            } else {
                console.log("The musicotheques collection exist.");
            }
        });
        console.log("server.js   Connected to 'musickon' database  collection:membres");
        db.collection('membres', { safe: true }, function(err, collection) {
            if (err) {
                console.log("La collection 'membre' inexisant. ...");
                populateMembres(); //ac: orig
                //process.exit(1);
            } else {
                console.log("The members collection exist.");
            }
        });
        console.log("server.js   Connecting to 'musickon' database  collection:statistique");
        db.collection('statistique', { safe: true }, function(err2, collection) {
            console.log("server.js   err2=" + err2);
            if (err2) {
                console.log("La collection 'statistique' inexisant. ...");
                populateStat(); //ac: orig
                //   process.exit(1);
            } else {
                console.log("The statistics collection exist.");
            }
        });
        //populateStatMusFavParReg
        console.log("server.js   Connecting to 'musickon' database collection:StatMusFavParReg");
        db.collection('StatMusFavParReg', { safe: true }, function(err, collection) {
            console.log("server.js   err2=" + err);
            if (err) {
                console.log("La collection 'StatMusFavParReg' inexisant. ...");
                populateStatMusFavParReg(); //ac: orig
                //   process.exit(1);
            } else {
                console.log("The statistics StatMusFavParReg exist.");
            }
        });
    }
});
*/
