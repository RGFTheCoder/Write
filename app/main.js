const { dialog } = require('electron').remote;
var fs = require('fs');
var currFoc = null;
var currPos = 0;


addEventListener('load', function() {

    var ipc = require('electron').ipcRenderer;

    var closeEl = document.querySelector('button#close');
    closeEl.onclick = function() {
        ipc.send('close-main-window');
    };

    var closeEl = document.querySelector('button#max');
    closeEl.onclick = function() {
        ipc.send('max-main-window');
    };

    var closeEl = document.querySelector('button#min');
    closeEl.onclick = function() {
        ipc.send('min-main-window');
    };

    // var title = document.querySelector("h1#title");
    // title.onclick = function() {
    //     currFoc = title;
    // }

    var bodin = document.querySelectorAll("div.body *");
    bodin.forEach(bodins => {
        bodins.setAttribute("data-tag", bodins.tagName.toLowerCase());
        bodins.onclick = function() {
            currFoc = bodins;
            currPos = bodins.textContent.length;
        }
    });

    var newt = false;
    var cmd = false;

    var newnode = "";

    document.onkeydown = function(e) {
        var k = e.keyCode;

        if (newt) {
            console.log(k);
            if (k == 8) {
                if (currPos != 0) {
                    newnode = newnode.split("").slice(0, currPos - 1).join("") + newnode.split("").slice(currPos).join("");
                    currPos--;
                }
            } else if (k == 39) {
                currPos++
            } else if (k == 37) {
                currPos--;
            } else if (k == 16 || k == 17 || k == 38 || k == 40 || k == 13 || k == 9 || k == 32) {

            } else {
                newnode = newnode.split("").slice(0, currPos).join("") + e.key + newnode.split("").slice(currPos).join("");
                currPos++;
            }

            if (currPos > newnode.length) {
                currPos = newnode.length;
            }

            if (k == 32) {
                newnode = document.createElement(newnode);
                currFoc.parentNode.insertBefore(newnode, currFoc.nextSibling);
                currFoc = newnode;
                currPos = 0;
                var bodin = document.querySelectorAll("div.body *");
                bodin.forEach(bodins => {
                    bodins.setAttribute("data-tag", bodins.tagName)
                    bodins.onclick = function() {
                        currFoc = bodins;
                        currPos = bodins.textContent.length;
                    }
                });
                newt = false;
            }
            return;
        }

        if (cmd) {
            switch (e.key) {
                case "s":
                    saveFile(document.querySelector("div.body").innerHTML);
                    break;
                case "o":
                    openFile();
                    var bodin = document.querySelectorAll("div.body *");

                    break;
            }
            cmd = false;
            return;
        }

        if (k == 8) {
            if (currPos != 0) {
                currFoc.textContent = currFoc.textContent.split("").slice(0, currPos - 1).join("") + currFoc.textContent.split("").slice(currPos).join("");
                currPos--;
            } else {

                currFoc.parentNode.removeChild(currFoc);

            }
        } else if (k == 39) {
            currPos++
        } else if (k == 37) {
            currPos--;
        } else if (k == 16 || k == 38 || k == 40) {

        } else if (k == 17) {
            cmd = true;
        } else if (k == 13) {
            newt = true;
            newnode = "";
            currPos = 0;
        } else if (k == 9) {
            currFoc.textContent = currFoc.textContent.split("").slice(0, currPos).join("") + "    " + currFoc.textContent.split("").slice(currPos).join("");
            currPos++;
            currPos++;
            currPos++;
            currPos++;
        } else {
            currFoc.textContent = currFoc.textContent.split("").slice(0, currPos).join("") + e.key + currFoc.textContent.split("").slice(currPos).join("");
            currPos++;
        }

        console.log(k);

        if (currPos > currFoc.textContent.length) {
            currPos = currFoc.textContent.length;
        }
    }
})
var savLoc = "";

function saveFile(content) {
    if (savLoc == "") {
        // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
        dialog.showSaveDialog((fileName) => {
            if (fileName === undefined) {
                console.log("You didn't save the file");
                return;
            }

            savLoc = fileName;

            // fileName is a string that contains the path and filename created in the save file dialog.  
            fs.writeFile(fileName, content, (err) => {
                if (err) {
                    alert("An error ocurred creating the file " + err.message)
                }

            });
        });
    } else {
        fs.writeFile(savLoc, content, (err) => {
            if (err) {
                alert("An error ocurred creating the file " + err.message)
            }
        });
    }
}

function openFile() {
    var t = "";
    dialog.showOpenDialog((fileNames) => {
        // fileNames is an array that contains all the selected
        if (fileNames === undefined) {
            console.log("No file selected");
            return;
        }

        savLoc = fileNames[0];

        var s = fs.readFileSync(fileNames[0], 'utf-8');
        document.querySelector("div.body").innerHTML = s;

        var bodin = document.querySelectorAll("div.body *");
        bodin.forEach(bodins => {
            bodins.setAttribute("data-tag", bodins.tagName)
            bodins.onclick = function() {
                currFoc = bodins;
                currPos = bodins.textContent.length;
            }
        });
    });
}