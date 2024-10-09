/* INITIAL SET UP */
document.addEventListener("DOMContentLoaded", () => {
  console.log("script initialized");
  const head = document.head;
  const link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "../css/access.css";

  head.appendChild(link);

  createAcessibilityElement();
});

function createAcessibilityElement() {
  const ul = document.createElement("ul");
  ul.setAttribute("id", "access");
  document.body.appendChild(ul);

  fetch("../js/icons.json")
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      data.icons.forEach((icon) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        const img = document.createElement("img");
        img.src = icon.path;
        img.alt = icon.name;

        button.dataset.tooltip = icon.text;
        button.appendChild(img);
        button.title = icon.name;
        button.setAttribute("id", "access_btn");

        button.addEventListener("click", openTooltip);

        li.appendChild(button);
        ul.appendChild(li);
      });
    });
}

let selectedBtn = null;
let tooltip = null;

function openTooltip(event) {
  const clickedBtn = event.currentTarget;

  // Si le bouton cliqué est déjà le bouton sélectionné
  if (clickedBtn === selectedBtn) {
    clickedBtn.classList.remove("selectedBtn");
    selectedBtn = null;
    tooltip.style.display = "none";
  } else {
    // Si un autre bouton est cliqué
    if (selectedBtn) {
      selectedBtn.classList.remove("selectedBtn");
      tooltip.style.display = "none";
    }
    clickedBtn.classList.add("selectedBtn");
    selectedBtn = clickedBtn;
    createTooltip(clickedBtn.dataset.tooltip);
    positionTooltip(clickedBtn);
  }
}

function createTooltip(text) {
  if (!tooltip) {
    const ul = document.getElementById("access");
    // Si l'infobulle n'existe pas encore
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    ul.appendChild(tooltip);
  }
  tooltip.textContent = text;
  tooltip.style.display = "block";
}

function positionTooltip(button) {
  const rect = button.offsetTop;
  tooltip.style.right = "70px"; // Centrer l'infobulle horizontalement
  tooltip.style.top = `${rect}px`; // Positionner au-dessus du bouton
}
