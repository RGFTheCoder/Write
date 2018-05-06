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
        bodins.setAttribute("data-tag", bodins.tagName)
        bodins.onclick = function() {
            currFoc = bodins;
            currPos = bodins.textContent.length;
        }
    });

    var newt = false;

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
        } else if (k == 16 || k == 17 || k == 38 || k == 40) {

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