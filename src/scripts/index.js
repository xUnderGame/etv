import { Tierlist, Tier } from "/src/scripts/exports.js";
import frumsPreset from "/src/presets/frums.json" assert { type: "json" };

// ----------- Tierlist && initial stuff. -----------
if (/Android|iPhone/i.test(navigator.userAgent)) openGUI("create", "mobile");

// Creates the default tierlist.
var tierlist = new Tierlist([
    new Tier("S", "red"),
    new Tier("A", "orange"),
    new Tier("B", "yellow"),
    new Tier("C", "green"),
    new Tier("D", "blue")
]);

// Add event listeners.
document.getElementById("createTier").addEventListener("click", function () { openGUI("create", "tier"); });
document.getElementById("createField").addEventListener("click", function () { openGUI("create", "field"); });
document.getElementById("export").addEventListener("click", function () { if (window.isSecureContext) navigator.clipboard.writeText(JSON.stringify(tierlist)); else prompt("Exported JSON: (Ctrl + C)", JSON.stringify(tierlist)) });
document.getElementById("import").addEventListener("click", function () { tierlist = importTierlist(); });
document.getElementById("presets").addEventListener("change", function () { let me = document.getElementById("presets"); tierlist = importTierlist(me.options[me.selectedIndex].text) });

// Import a tierlist.
function importTierlist(preset = null) {
    let json;
    
    // Get the information and check that the JSON is valid..
    if (!preset) {
        let importDOM = document.getElementById("importField");
        try { json = JSON.parse(importDOM.value); } catch (e) { json = null; }
        importDOM.value = "";
        if (!json) {
            importDOM.placeholder = "Invalid JSON.";
            return tierlist;
        };
        importDOM.placeholder = "Tierlist imported correctly!";
    }

    // Presets (currently only frums tierlist).
    else {
        if (preset == "Frums") json = frumsPreset;
        else return tierlist;
    }

    
    // Reset all the DOM elements.
    document.getElementById("tl").innerHTML = "";
    document.querySelector("#holding section").innerHTML = "";

    // Create all the tiers (excluding holding).
    let tiers = [];
    json["tiers"].forEach(tier => tiers.push(new Tier(tier.id, tier.color, tier.container.map(function (field) { return field }))))

    // Make the tierlist object and DOM objects.
    let temp = new Tierlist(tiers, new Tier(json["hold"].id, json["hold"].color, json["hold"].container.map(function (field) { return field })));
    temp.tiers.forEach(tier => tier.container.forEach(field => temp.createField(field.name, field.image, field.url, tier.id)))
    temp.hold.container.forEach(field => temp.createField(field.name, field.image, field.url, temp.hold.id)); // Holding.
    console.log(temp)
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
            colorField.type = "color";
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
        
        // OnMobile modal.
        else if (tierOrField == "mobile") {
            title.textContent = "Mobile Notice";

            // Creates and edits both text fields.
            let infoText = document.createElement("p");
            let however = document.createElement("p");
            infoText.textContent = "This website does not function well (if at all) on mobiles, please consider using a computer or laptop to use this website!";
            however.textContent = "You can still, however, check the website by clicking off this modal!";
            infoText.style.textAlign = "center";
            however.style.textAlign = "center";

            fields.appendChild(infoText);
            fields.appendChild(however);
        }

        // Appends to other elements.
        controls.appendChild(fields);
        if (tierOrField != "mobile") controls.appendChild(addThing);

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
    if (tierlist.tiers.some(tier => tier.container.some(field => field.name == fieldName)) || tierlist.hold.container.some(field => field.name == fieldName) || fieldName.match(/^[a-zA-Z0-9]+$/) == null) return;
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