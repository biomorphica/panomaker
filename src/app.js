const express = require('express')
const app = express()
const path = require('path')
const hbs = require('hbs')
const fs = require('fs'); // filse system libary in express
const mkdirp = require('mkdirp');

const port = process.env.PORT || 3000

// Define paths for Express config
const publicPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

// Setup handlebars and views configuration
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

// Setup static directory to serve
app.use(express.static(publicPath))
app.use(express.json()); // automatically parses json data into javascript objects.


app.get('', (req, res) => {
    res.render('index', {
        title:'Panorama Network'    
    })
})

app.get('*', (req, res) => {
    // res.send('My 404 page')
    res.render('404', {
        title:'404',
        name: "Thomas Williams",
        errorMessage: "Page Not Found"
    })
})

app.listen(port, () => {
    console.log('Server is up on port '+ port)
})

// Aframe scene build

app.post('/api', (request, response) =>{
    console.log('request accepted. --------------------------------- ');
    console.log( request.body);
    const body = request.body; // data is main part of json file
    
    // Create the new project folder.
    // This is the author name / project name    
    console.log('projectName', body.data.project.projectName, body.data.project.authorName);

    // ============================== getFolder
    // Check to see if a given folder exists. If not, create it.
    // Return the path.
    function getFolder( fPath ){
        console.log('getFolder ', fPath);    
        mkdirp(fPath, function(err){
            if (err) {console.log(err);}
            else { console.log(`dir ${fPath} created`);}
        }); 
    }
    // ============================== copyFile
    // Copy a file from src to dest.
    function copyFile(src, dest, id) {
        console.log("copyFile", src, dest, id);
        let readStream = fs.createReadStream(src);
        readStream.once('error', (err) => {
          console.log(err);
        });

        readStream.once('end', () => {
          console.log('done copying');
          allDone(id);
        });

        readStream.pipe(fs.createWriteStream(dest));
    }
    // ============================== 
    // Create the folders for the project. They will be named
    // authorName/projectName
    // console.log('path', path);
    let author = body.data.project.authorName;
    let project = body.data.project.projectName;
    let destDir = path.join(author, project);
     console.log('destDir', destDir);
     console.log('-----------')
    getFolder( author );
    getFolder(destDir);

    // Copy necessary files to destination folder, including
    // panomaker.html, js folder and files.
    let filename = 'panoviewer.html';
    let __dirname = 'public';
    let dstFilename = 'index.html';
    let srcMain = path.join(__dirname, filename);
    let dstMain =  path.join(destDir, dstFilename);
    copyFile(srcMain, dstMain, 'index.html');

    // Create the js folder
    let jsFolder = path.join( destDir, 'js');
    getFolder(jsFolder);

    // Copy the js files that will be needed, including
    // afc-animend.js, afc-buttoncontrol.js, afc-camcontrol.js, afc-init-spheres.js, afc-spherecontrol.js
    let jsSrc = path.join(__dirname, 'js');    
    let dst, src;
    jsFiles = [ 'afc-animend.js', 'afc-buttoncontrol.js', 'afc-camcontrol.js', 'afc-init-spheres.js', 'afc-spherecontrol.js'];
    jsFiles.forEach(function(js){
        src = path.join(jsSrc, js);
        dst = path.join(jsFolder, js);
        copyFile(src, dst, js);
    });
    
    // Pano Image copy
    // Create the assets folder
    let imgFolder = path.join( destDir, 'assets');
    getFolder(imgFolder);

    // Copy all the image files over and rename them.
    let n=0, id
    console.log(' ================= copy image files');
    console.log('body.data', body.data);
    
    body.data.panos.forEach(function(pano) {
        n++;        
        let filename = path.basename(pano.file);
        let ext = path.extname(pano.file);
        let src = path.join('images', filename);
        console.log('src', src);

        let destDir = imgFolder;    
        console.log('destDir', destDir );   
        let destFileName = 'pano_'+n.toString()+ext;
        console.log('destFileName', destFileName);
        let dest = path.join(destDir, destFileName);
        console.log('dest', dest);
        pano['texture']= destFileName;
        id = 'pano'+n.toString();
        copyFile(src, dest, id );
    });

    // Copy the logo image over to image folder, if it is being used.
   // if (body.data.project.bLogo)



    // Save the object to the server as a JSON file.
    let saveData = JSON.stringify(body);
    console.log('saveData', saveData);
    dst = path.join(destDir, 'data.json');    
    console.log('dest dir', destDir);
    fs.writeFile( dst, saveData, saveFinished);
    console.log('writing json to ',dst);

    // ============================ saveFinished
    function saveFinished(err){
        console.log('json file save finished', err);
    }
    // ============================ allDone
    function allDone(idname){
        console.log('allDone', idname);
        if (idname === 'pano'+ n.toString() ) {
            console.log( 'Sending message back to client');
            response.json( body); // send the response back as a javascript object json(data)
        }
    }

   
    

    // console.log('copied panomaker.html to file path worked', bCopyIndex);

    // rename panomaker to index.html

    // Create assets folder, and copy and the pano images into there

   

    // Open a new tab with the finished folder in there.

    // Email link to user.

/*
  

    response.json( body); // send the response back as a javascript object json(data)
    console.log("recieved data", body);

   
  */
});
