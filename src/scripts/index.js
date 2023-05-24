import { Tierlist } from "/src/scripts/exports.js"
console.log("Hello World!")


// ----------- Tierlist && testing. -----------
var tierlist = new Tierlist();
tierlist.createField("Absolute Zero", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/absolute-zero");
console.log(tierlist);


// ----------- Drag && drop sheningans. -----------
var holdEle = document.getElementById("holding");
var tlEle = document.getElementById("tl");

// Add event listeners for dragging and dropping.
let interactables = Array.from((tlEle.children));
interactables.push(holdEle)
for (let ele of interactables) {
    document.getElementById(ele.id).addEventListener("drop", function () { dragDrop(event) }, false);
    document.getElementById(ele.id).addEventListener("dragover", function () { dragOver(event) }, false);
    document.getElementById(ele.id).addEventListener("dragenter", function () { dragEnter(event) }, false);
    document.getElementById(ele.id).addEventListener("dragleave", function () { dragLeave(event) }, false);
    console.log(ele)
}

// Event that triggers when something draggable drops over something.
function dragDrop(e) {
    e.preventDefault();
    console.log("i was dropped");
}

// Event that triggers when something draggable drags over something.
function dragOver(e) {
    e.preventDefault();
    console.log("this is something");
}

// Event that triggers when something draggable drags over something.
function dragEnter(e) {
    e.preventDefault();
    if ( e.target.className == "container") e.target.style.border = "3px dotted red";
}

// Event that triggers when something draggable leaves a container.
function dragLeave(e) {
    if ( e.target.className == "container") e.target.style.border = "";
}