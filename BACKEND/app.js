const express = require('express');
const mysql = require('mysql');
const myConnection = require('express-myconnection');
const app = express();
const port = 8000;
require('dotenv').config();


//extraction des donnes du form
app.use(express.urlencoded({ extended: false }));

//config de la connexion avec la bd
const optionBd = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    port: 3306,
    database: 'commerce_bd'
};

//def du midlerware pour connexion avec la bd
app.use(myConnection(mysql, optionBd, 'pool'));

//config-gestion fichiers statiques
const path = require('path');
app.use("/Images_BD", express.static(path.join(__dirname, 'Images_BD')));

//definition du moteur de templates html
app.set('view engine', 'ejs');
//definition du dossier des vues
app.set('views', __dirname + '/../FRONTEND');
//definition
app.use('/assets', express.static(path.join(__dirname, '../FRONTEND/assets')));



//gerer le telechargement des images
const multer = require('multer');
//config de multer pour specifier le dossier d'enregistrement des fichiers

const strorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'Images_BD');//dossier de destination
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);//nom du fichier enregistré 
    }
});

//
app.get('/', (req, res) => {

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            connection.query('SELECT *FROM notes', [], (erreur, resultats) => {
                if (erreur) {
                    console.log(erreur);
                } else {
                    console.log(resultats)
                    res.render('index', { notes: resultats });
                }
            });
        }
    });
});


//
const upload = multer({ storage: strorage });
//modifier
app.post('/ajouter',upload.single('image'), (req, res) => {
    let id = req.body.id === "" ? null : req.body.id;
    let titre = req.body.titre;
    let description = req.body.description;
    let image = req.file.buffer;//donnees binaires de l'image

    let reqSql = id === null ? 'INSERT INTO notes(id,titre,description,image)VALUES(?,?,?,?)'
        : 'UPDATE notes SET titre = ? , description = ? , image= ? WHERE id = ?';
    let donnees = id === null ? [null, titre, description, image] : [titre, description, image, id];

    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            connection.query(
                reqSql,
                donnees,
                (erreur, resultat) => {
                    if (erreur) {
                        console.log(erreur);
                    } else {
                        res.status(300).redirect('/');
                    }
                });
        }
    });
});

app.delete('/ajouter/:id', (req, res) => {
    let id = req.params.id;
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            connection.query('DELETE FROM notes WHERE id =?', [id], (erreur, resultat) => {
                if (erreur) {
                    console.log(erreur);
                } else {
                    res.status(200).json({ routeRacine: "/" });
                }
            });
        }
    })
});

app.listen(port, () => {
    console.log('server listening on port 8000')
})
//page introuvable
app.use((req, res) => {
    res.status(404).render('pageIntrouvable')
});

