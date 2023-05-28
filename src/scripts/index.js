import { Tierlist, Tier } from "/src/scripts/exports.js"

// ----------- Tierlist && initial stuff. -----------
var tierlist = new Tierlist([
    new Tier("S", "red"),
    new Tier("A", "orange"),
    new Tier("B", "yellow"),
    new Tier("C", "green"),
    new Tier("D", "blue")
]);

// Adds some placeholder songs.
tierlist.createField("Absolute Zero", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/absolute-zero");
tierlist.createField("I Can't Even Remember My Own Name", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/i-cant-even-remember-my-own-name");
tierlist.createField("olin en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");
tierlist.createField("olidsadan en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");
tierlist.createField("olidsadasdasdn en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("olain ssden pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("oliasdaaaasn en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("oliasdasasdan en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("oliadddsn en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("oliasdn en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("oliasdasaddsdn en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

tierlist.createField("olindasdaaaaasd en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");


console.log(tierlist);

// Add event listeners to buttons.
let buttonIDs = ["tierControls", "fieldControls"]; //, "import", "export"
for (const i in buttonIDs) {
    document.getElementById(buttonIDs[i]).addEventListener("click", function () { openGUI(buttonIDs[i]); });
}

// GUI Function.
function openGUI(id) {
    // Dim background and main modal.
    let blank = document.createElement("article");
    let modal = document.createElement("section");
    let controls = document.createElement("div");
    let title = document.createElement("h3");
    blank.addEventListener("click", function (e) { if (!document.getElementById("modal").contains(e.target)) document.getElementById("blank").remove(); });
    controls.id = "controls"
    blank.id = "blank";
    modal.id = "modal";

    // Now the funky stuff!
    switch (id) {
        // Tier controls.
        case "tierControls":
            title.textContent = "Tier controls";

            // Create tier buttons.
            let buttons = document.createElement("div");

            let tierAddTier = document.createElement("button");
            let tierRemoveTier = document.createElement("button");
            tierAddTier.addEventListener("click", addTierDOM);
            tierRemoveTier.addEventListener("click", addTierDOM);
            tierAddTier.textContent = "Create tier";
            tierRemoveTier.textContent = "Remove tier";
            
            // Input fields.
            let fields = document.createElement("div");
            let tierNameField = document.createElement("input");
            let tierColorField = document.createElement("input");
            tierNameField.id = "tierNameField";
            tierColorField.id = "tierColorField";
            tierNameField.placeholder = "Tier name/id";
            tierColorField.placeholder = "Tier color (color, hex or rgb)";

            // Appends to other elements.
            buttons.appendChild(tierAddTier);
            buttons.appendChild(tierRemoveTier);
            fields.appendChild(tierNameField);
            fields.appendChild(tierColorField);
            controls.appendChild(buttons);
            controls.appendChild(fields);
            break;
    
        // Field controls.
        case "fieldControls":
            title.textContent = "Field controls";
            break;
        
        default:
            break;
    }

    // Append everything into the DOM.
    modal.appendChild(title);
    modal.appendChild(controls);
    blank.appendChild(modal);
    document.body.appendChild(blank);
}

// Add field function.
function addTierDOM() {
    let tierName = document.getElementById("tierNameField").value;
    if (tierlist.tiers.some(tier => tier.id == tierName) || tierName.match(/^[a-z0-9]+$/) == null) return;
    console.log(tierlist.tiers)
    tierlist.createTier(new Tier(tierName, document.getElementById("tierColorField").value));
}


// ----------- Drag && drop sheningans. -----------
let holdingEle = document.getElementById("holding");
holdingEle.addEventListener("drop", function () { dragDrop(event) }, false);
holdingEle.addEventListener("dragover", function () { dragOver(event) }, false);

// Event that triggers when something draggable drops over something.
export function dragDrop(e) {
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
        tierlist.moveTo(from.container.find(field => field.name == fieldEle.id), to, from);
        console.log(tierlist)
    }
}

// Remove the default event to allow dropping in elements.
export function dragOver(e) {
    e.preventDefault();
}