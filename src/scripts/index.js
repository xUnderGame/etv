import { Tierlist, Tier } from "/src/scripts/exports.js"
console.log("Hello World!")


// ----------- Tierlist && testing. -----------
var tierlist = new Tierlist([
    new Tier("S", "red"),
    new Tier("A", "orange"),
    new Tier("B", "yellow"),
    new Tier("C", "green"),
    new Tier("D", "blue")
]);
tierlist.createField("Absolute Zero", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/absolute-zero");
tierlist.createField("I Can't Even Remember My Own Name", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/i-cant-even-remember-my-own-name");
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
}

// Event that triggers when something draggable drops over something.
function dragDrop(e) {
    e.preventDefault();
    if (e.target.className != "container") return;

    // Move the element to the new container and update the element.
    let fieldEle = document.getElementById(e.dataTransfer.getData("text"));
    if (!fieldEle) return;
    let currContainer = fieldEle.parentElement.parentElement.id;
    let newContainer = e.target.parentElement.id;

    if (tierlist.hold.container.some(field => field.name == fieldEle.id) || tierlist.tiers.some((tier => tier.container.some(field => field.name == fieldEle.id)))) {
        e.target.appendChild(fieldEle);
        // Moving the element with the tierlist object.
        let to = (newContainer != "holding") ? tierlist.tiers.find(tier => tier.id == newContainer) : tierlist.hold;
        let from = (currContainer != "holding") ? tierlist.tiers.find(tier => tier.id == currContainer) : tierlist.hold;
        tierlist.moveTo(
            from.container.find(field => field.name == fieldEle.id),
            to,
            from);
        console.log(tierlist)
    }
}

// Remove the default event to allow dropping in elements.
function dragOver(e) {
    e.preventDefault();
}