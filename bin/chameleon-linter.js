#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const scanFiles = () => {
    const directoryPath = path.join(__dirname, '..',);
   
    fs.readdir(directoryPath, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        } 

        filterJsFiles(files);
    });
}

const filterJsFiles = (files) => {
    const jsFiles = files.filter((file) => path.extname(file) == '.js')

    if(jsFiles.length > 0) {
        // console.log(jsFiles)
        jsFiles.map(file => (readFileLines(file)));
    }else(
        console.log("No javascript files found!"));
}

const readFileLines = (file) => {
    const rl = readline.createInterface({
        input: fs.createReadStream(file),
      });

      
    let lineCount = 0;

    rl.on('line', function (line) {
        lineCount++;
       
        if(line && line[0] !== '/' && line[line.length - 1] !== ';'){
            rl.close();
            rl.removeAllListeners()
            console.log( '🦎'+ file)
            console.log('Missing semi-colon at the end of line ' + lineCount + '.')
        }

        if( line[0] !== '/' && line.includes('=') && line.includes('const') || line.includes('let') || line.includes('var')){
           const assignmentOperatorIndex = line.indexOf('=')

           const prevIndex = assignmentOperatorIndex - 1;

           const nextIndex = assignmentOperatorIndex + 1;

           if(line[prevIndex] !== ' ' || line[nextIndex] !== ' '){
                rl.close();
                rl.removeAllListeners()
                console.log( '🦎'+ file)
                console.log('Missing space before or after the assignment operator on line ' + lineCount + '.')
           }
         
        }  
    })
}

scanFiles();
