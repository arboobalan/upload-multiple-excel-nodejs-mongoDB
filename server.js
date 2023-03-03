const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const app = express();
const File = require('./model/excel')

//MiddleWare
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'views')));
app.set('view engine', 'ejs');

//DB
require('./config/db');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
})


const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        if (ext !== '.csv') {
            return cb(new Error('Only CSV files are allowed'));
        }
        cb(null, true);
    }
}).array('path',3);



app.post('/excelForm', function (req, res) {
    upload(req, res, function (err) {
        if (err) {
            console.log(err);
            return res.status(400).send(err.message);
        }
        const file = new File({
            path1: req.files[0].path,
            path2: req.files[1].path,
            path3: req.files[2].path
        });

        // const files = req.files;
        // const path1 = files[0].path;
        // const path2 = files[1].path;
        // const path3 = files[2].path;

        // const file = new File({
        //     path1: path1,
        //     path2: path2,
        //     path3: path3,
        // });

        file.save()
            .then(() => {
                res.redirect('/');
                console.log('Upload success');
            })
            .catch((err) => {
                console.log('Upload failed');
                console.log(err);
                res.status(500).send(err.message);
            });
    });
});


app.get('/', function (req, res) {
    File.find({}, function (err, files) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        }

        res.render('index', { files: files });
    });
});

port = 1001;

app.listen(port, (req, res) => {
    console.log(`=> http://localhost:${port}`);
});