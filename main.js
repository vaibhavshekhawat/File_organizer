#!/usr/bin/env node
let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
// node main.js tree "directoryPath"
// node main.js organise "directoryPath"
// node main.js help
let types = {
    videos: ["mp4", "mkv"],
    archives: ['zip', '7z', 'rar', 'tar', 'gz', 'ar', 'iso', 'xz'],
    documents: ['docx', 'doc', 'pdf', 'xlsx', 'xls', 'odt', 'ods', 'odp', 'odg', 'odf', 'txt', 'ps', 'tex', 'pptx'],
    apps: ['exe', 'dmg', 'pkg', 'deb'],
    images: ['jpg', 'png', 'jpeg']
}

let command = inputArr[0];
switch (command) {
    case ("tree"):
        treeFn(inputArr[1]);
        break;

    case ("organize"):
        organizeFn(inputArr[1]);
        break;

    case ("help"):
        helpFn();
        break;

    default:
        console.log("Please input Right command.");
        break;
}



function organizeFn(dirPath) {
    //1. input -> directory path given
    let destPath;
    if (dirPath == undefined) {
        // console.log("Kindly Enter the Path.");
        // destPath = process.cwd();
        // return;
        //this will give us the current working directory
        dirPath = process.cwd();
        destPath = path.join(dirPath, "organized_files");
            //checking whether already the organize_files directory exists or not.
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }
            
        // organize_helper(des_path);
        // return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            //create -> organized_files -> directory
            destPath = path.join(dirPath, "Organized_Files");
            if (fs.existsSync(destPath) == false) {
                fs.mkdirSync(destPath);
            }


        } else {
            console.log("Kindly Enter the correct Path.");
            return;
        }


    }
    organiseHelper(dirPath, destPath);

    /*
        1. input -> directory path given
        2. create -> organized_files -> directory
        3. identify categories of all the files present in that input directory
        4. copy / cut files to that organized directory inside of any of category folder  
    */
}

function organiseHelper(src, dest) {
    //identify categories of all the files present in that input directory

    let childNames = fs.readdirSync(src);
    for (let i = 0; i < childNames.length; i++) {
        let childAddress = path.join(src, childNames[i]);
        let isFile = fs.lstatSync(childAddress).isFile();
        if (isFile) {
            // copy / cut files to that organized directory inside of any of category folder  
            let category = getCategory(childNames[i]);
            sendFiles(childAddress, dest, category);
        }
    }
}

function sendFiles(srcFilePath, dest, category) {
    let categoryPath = path.join(dest, category);
    if (fs.existsSync(categoryPath) == false) {
        fs.mkdirSync(categoryPath);
    }
    let fileName = path.basename(srcFilePath);
    let destFilePath = path.join(categoryPath, fileName);
    fs.copyFileSync(srcFilePath, destFilePath);
    fs.unlinkSync(srcFilePath);
    console.log(fileName, " copied to ", category);
}

function getCategory(name) {
    let ext = path.extname(name);
    ext = ext.slice(1);
    for (let type in types) {
        let cTypeArray = types[type];
        for (let i = 0; i < cTypeArray.length; i++) {
            if (ext == cTypeArray[i]) {
                return type;
            }
        }
    }
    return "others";
}


function treeFn(dirPath) {
    // let destPath;
    if (dirPath == undefined) {
        treeHelper(process.cwd(),"");

        //console.log("Kindly Enter the Path.");
        return;
    }
    else {
        let doesExist = fs.existsSync(dirPath);
        if (doesExist) {
            treeHelper(dirPath, "");
        } else {
            console.log("Kindly Enter the correct Path.");
            return;
        }


    }
}

function treeHelper(dirPath, indent) {
    // is file or folder
    let isFile = fs.lstatSync(dirPath).isFile();
    if (isFile == true) {
        let fileName = path.basename(dirPath);
        console.log(indent + "├──" + fileName);
    }
    else {
        let dirName = path.basename(dirPath);
        console.log(indent + "└──" + dirName);
        let childrens = fs.readdirSync(dirPath);
        for (let i = 0; i < childrens.length; i++) {
            let childPath = path.join(dirPath, childrens[i]);
            treeHelper(childPath, indent + "\t");
        }
    }
}


function helpFn() {
    console.log(`
    List of All the Commands:
            node main.js tree "directoryPath"
            node main.js organise "directoryPath"
            node main.js help
    `)
}