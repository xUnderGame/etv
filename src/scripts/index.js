import { Tierlist, Tier } from "/src/scripts/exports.js";

// ----------- Tierlist && initial stuff. -----------
// Creates the default tierlist.
var tierlist = new Tierlist([
    new Tier("S", "red"),
    new Tier("A", "orange"),
    new Tier("B", "yellow"),
    new Tier("C", "green"),
    new Tier("D", "blue")
]);

// // Adds some placeholder songs.
// tierlist.createField("Absolute Zero", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/absolute-zero");
// tierlist.createField("I Can't Even Remember My Own Name", "https://f4.bcbits.com/img/a1941319298_16.jpg", "https://frums.bandcamp.com/track/i-cant-even-remember-my-own-name");
// tierlist.createField("olin en pakala", "https://f4.bcbits.com/img/a1562528122_16.jpg", "https://strlabel.bandcamp.com/track/olin-en-pakala");

// Add event listeners.
document.getElementById("createTier").addEventListener("click", function () { openGUI("create", "tier"); });
document.getElementById("createField").addEventListener("click", function () { openGUI("create", "field"); });
document.getElementById("export").addEventListener("click", function () { prompt("Exported JSON: (Ctrl + C)", JSON.stringify(tierlist)) });
document.getElementById("import").addEventListener("click", function () { tierlist = importTierlist(); });

// Import a tierlist.
function importTierlist() {
    // Get the information
    let json;
    try { json = JSON.parse(document.getElementById("importField").value); } catch (e) { return; }
    document.getElementById("tl").innerHTML = "";
    document.querySelector("#holding section").innerHTML = "";

    // Create all the tiers (excluding holding).
    let tiers = [];
    json["tiers"].forEach(tier => tiers.push(new Tier(tier.id, tier.color, tier.container.map(function (field) { return field }))))

    // Make the tierlist object and DOM objects.
    let temp = new Tierlist(tiers, new Tier(json["hold"].id, json["hold"].color, json["hold"].container.map(function (field) { return field })));
    temp.tiers.forEach(tier => tier.container.forEach(field => temp.createField(field.name, field.image, field.url, tier.id)))
    temp.hold.container.forEach(field => temp.createField(field.name, field.image, field.url, temp.hold.id)); // Holding.
    return temp;
}

// GUI function.
export function openGUI(id, tierOrField = null) {
    // Dim background and main modal.
    let blank = document.createElement("article");
    let modal = document.createElement("section");
    let controls = document.createElement("div");
    let title = document.createElement("h3");
    blank.addEventListener("click", function (e) { if (!document.getElementById("modal").contains(e.target)) document.getElementById("blank").remove(); });
    controls.id = "controls";
    blank.id = "blank";
    modal.id = "modal";

    // Tier controls.
    if (id == "create") {
        
        // Create tier button.
        let addThing = document.createElement("button");
        
        // Input fields.
        let fields = document.createElement("div");
        let nameField = document.createElement("input");
        let colorField = document.createElement("input");
        let imgField = document.createElement("input");
        let urlField = document.createElement("input");
        nameField.id = "NameField";
        colorField.id = "ColorField";
        imgField.id = "ImgField";
        urlField.id = "UrlField";
        
        // Settings for tier.
        if (tierOrField == "tier") {
            title.textContent = "Create tier";
            nameField.placeholder = "Tier name/id";
            colorField.placeholder = "Tier color (color, hex or rgb)";
            addThing.addEventListener("click", addTierDOM);
            addThing.textContent = "Create tier";

            fields.appendChild(nameField);
            fields.appendChild(colorField);
        }

        // Settings for field.
        else if (tierOrField == "field") {
            title.textContent = "Create field";
            nameField.placeholder = "Field name/id";
            imgField.placeholder = "Field img (https://)";
            urlField.placeholder = "Field url (https://..., optional)";
            addThing.addEventListener("click", addFieldDOM);
            addThing.textContent = "Create field";

            fields.appendChild(nameField);
            fields.appendChild(imgField);
            fields.appendChild(urlField);
        }
        
        // Appends to other elements.
        controls.appendChild(addThing);
        controls.appendChild(fields);
    } else {
        title.textContent = "Tier settings";

        // Delete tier button.
        let deleteTier = document.createElement("button");
        deleteTier.addEventListener("click", function () { removeTierDOM(id); blank.click(); }); // blank.click errors (but works???)
        deleteTier.textContent = "Delete tier (Must be empty)";

        // Move tier buttons.
        let moveTierUp = document.createElement("button");
        let moveTierDown = document.createElement("button");
        moveTierUp.addEventListener("click", function () { moveTierDOM(id, "UP"); });
        moveTierDown.addEventListener("click", function () { moveTierDOM(id, "DOWN"); });
        moveTierUp.textContent = "Move tier UP (Must be empty)";
        moveTierDown.textContent = "Move tier DOWN (Must be empty)";

        // Appends to other elements.
        controls.appendChild(deleteTier);
        controls.appendChild(moveTierUp);
        controls.appendChild(moveTierDown);
    }

    // Append everything into the DOM.
    modal.appendChild(title);
    modal.appendChild(controls);
    blank.appendChild(modal);
    document.body.appendChild(blank);
}

// Add tier function.
function addTierDOM() {
    let tierName = document.getElementById("NameField").value;
    if (tierlist.tiers.some(tier => tier.id == tierName) || tierName.match(/^[a-zA-Z0-9]+$/) == null) return;
    tierlist.createTier(new Tier(tierName, document.getElementById("ColorField").value));
}

// Add field function.
function addFieldDOM() {
    let fieldName = document.getElementById("NameField").value;
    if (tierlist.tiers.some(tier => tier.container.some(field => field.name = fieldName)) || tierlist.hold.container.some(field => field.name = fieldName) || fieldName.match(/^[a-zA-Z0-9]+$/) == null) return;
    tierlist.createField(fieldName, document.getElementById("ImgField").value, document.getElementById("UrlField").value);
}

// Move tier function.
function moveTierDOM(id, direction) {
    // Just some checks just in case...
    let ref = tierlist.tiers.findIndex(tier => tier.id == id);
    if (ref == -1) return;
    if (tierlist.tiers[ref].container.length > 0) return; // Checks if the container is empty.
    if ((ref <= 0 && direction == "UP") || (ref >= tierlist.tiers.length - 1 && direction == "DOWN")) return; // Checks if you can move up/down.

    // Moves the DOM element.
    let ele = document.getElementById(id);
    if (ele.previousElementSibling && direction == "UP") ele.parentNode.insertBefore(ele, ele.previousElementSibling);
    else if (ele.nextElementSibling && direction == "DOWN") ele.parentNode.insertBefore(ele.nextElementSibling, ele);

    // Moves inside the tierlist tiers list.
    var f = tierlist.tiers.splice(ref, 1)[0];
    (direction == "UP")? tierlist.tiers.splice(ref - 1, 0, f) : tierlist.tiers.splice(ref + 1, 0, f);
    console.log(tierlist.tiers);
}

// Remove tier function.
function removeTierDOM(id) {
    if (id.match(/^[a-zA-Z0-9]+$/) == null) return;
    
    // Removes the tier.
    let ref = tierlist.tiers.findIndex(tier => tier.id == id);
    if (ref == -1) return;
    if (tierlist.tiers[ref].container.length > 0) return; // Checks if the container is empty.
    document.getElementById(id).remove();
    tierlist.tiers.splice(ref, 1);
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