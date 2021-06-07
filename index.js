const express = require('express');
const fileUpload = require('express-fileupload');
const fs = require('fs');
const path = require('path');
const app = express();
require('dotenv').config()
const PATH_UPLOAD = process.env.PATH_UPLOAD;
const PORT = process.env.PORT;


app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : path.join(__dirname,'tmp'),
}));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.post('/', (req, res) => {
    console.log(PATH_UPLOAD);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    let targetFile = req.files.target_file;
    let extName = path.extname(targetFile.name);
    let baseName = path.basename(targetFile.name, extName);
    let uploadDir = path.join(__dirname, PATH_UPLOAD, targetFile.name);

    if(targetFile.size > 1048576){
        fs.unlinkSync(targetFile.tempFilePath);
        return res.status(413).send("File is too Large");
    }

    // Renaming the file
    let num = 1;
    while(fs.existsSync(uploadDir)){
        uploadDir = path.join(__dirname, PATH_UPLOAD, baseName + '-' + num + extName);
        num++;
    }

    targetFile.mv(uploadDir, (err) => {
        if (err)
            return res.status(500).send(err);
        res.send('File uploaded!');
    });
  
});

app.listen(PORT, () => console.log('Your app listening on port '+PORT));