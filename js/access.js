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

function openTooltip(event) {
  const clickedBtn = event.currentTarget;

  // Si le bouton cliqué est déjà le bouton sélectionné
  if (clickedBtn === selectedBtn) {
    clickedBtn.classList.remove("selectedBtn");
    selectedBtn = null;
  } else {
    // Si un autre bouton est cliqué
    if (selectedBtn) {
      selectedBtn.classList.remove("selectedBtn");
    }
    clickedBtn.classList.add("selectedBtn");
    selectedBtn = clickedBtn;
  }
}
