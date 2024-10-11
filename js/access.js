let selectedBtn = null;
let tooltip = null;
let iconsData = null;

/* INITIAL SET UP */
document.addEventListener("DOMContentLoaded", () => {
  console.log("script initialized");
  const head = document.head;
  const link = document.createElement("link");

  link.type = "text/css";
  link.rel = "stylesheet";
  link.href = "../css/access.css";

  head.appendChild(link);

  fetchIconsData();
});

function fetchIconsData() {
  fetch("../js/icons.json")
    .then((res) => res.json())
    .then((data) => {
      iconsData = data.icons;
      createAcessibilityElement();
    })
    .catch((error) =>
      console.error("Erreur lors du chargement des icônes :", error)
    );
}

function createAcessibilityElement() {
  const ul = document.createElement("ul");
  ul.setAttribute("id", "access");
  document.body.appendChild(ul);

  iconsData.forEach((icon) => {
    const li = document.createElement("li");
    const button = document.createElement("button");
    const img = document.createElement("img");

    img.src = icon.path;
    img.alt = icon.name;

    button.dataset.tooltip = icon.text;
    button.title = icon.name;
    button.appendChild(img);
    button.setAttribute("id", "access_btn");

    button.addEventListener("click", openTooltip);

    li.appendChild(button);
    ul.appendChild(li);
  });
}

function openTooltip(event) {
  const clickedBtn = event.currentTarget;

  // Si le bouton cliqué est déjà le bouton sélectionné
  if (clickedBtn === selectedBtn) {
    clickedBtn.classList.remove("selectedBtn");
    selectedBtn = null;
    tooltip.style.display = "none";
  } else {
    if (selectedBtn) {
      selectedBtn.classList.remove("selectedBtn");
      tooltip.style.display = "none";
    }
    clickedBtn.classList.add("selectedBtn");
    selectedBtn = clickedBtn;

    const content = generateTooltipContent(clickedBtn.title);
    createTooltip(
      content.name,
      content.value,
      content.rangeInput,
      content.valueWithUnit
    );
    positionTooltip(clickedBtn);
  }
}

function createTooltip(text, value, rangeInput, valueWithUnit) {
  if (!tooltip) {
    const ul = document.getElementById("access");
    tooltip = document.createElement("div");
    tooltip.className = "tooltip";
    ul.appendChild(tooltip);
  }

  tooltip.innerHTML = "";

  const p = document.createElement("p");
  p.className = "tooltip_p";
  const textNode = document.createTextNode(text);
  const spanValue = document.createElement("span");
  spanValue.className = "tooltip_p_value";
  spanValue.textContent = valueWithUnit;
  console.log(valueWithUnit);

  p.appendChild(textNode);
  p.appendChild(spanValue);

  tooltip.appendChild(p);

  if (rangeInput) {
    tooltip.appendChild(rangeInput);
    // Mise à jour initiale de la valeur
    updateTooltipValue(parseFloat(rangeInput.value).toFixed(1));
  }

  tooltip.style.display = "block";
}

function positionTooltip(button) {
  const rect = button.offsetTop;
  tooltip.style.right = "60px";
  tooltip.style.top = `${rect}px`;
}

function generateTooltipContent(iconNameToFind) {
  const icon = iconsData.find((icon) => icon.name === iconNameToFind);

  if (icon) {
    const { value, rangeInput, valueWithUnit } = calculateValue(icon.name);
    console.log(valueWithUnit);
    return { name: icon.text, value, rangeInput, valueWithUnit };
  } else {
    console.error("Icône non trouvée.");
    return { name: "err", value: "err", rangeInput: null, valueWithUnit: null };
  }
}

function calculateValue(iconName) {
  const bodyStyle = window.getComputedStyle(document.body);
  let calculatedValue = null;
  let calculatedValueNum = null;
  let rangeInput = null;

  switch (iconName) {
    case "Augmenter la taile du texte":
      calculatedValue = pxToEm(bodyStyle.fontSize);
      calculatedValueNum = parseFloat(calculatedValue);
      rangeInput = createRangeInput(0.6, 2, calculatedValueNum, 0.1);
      console.log("calcultated value : " + calculatedValue);
      break;
    case "Augmenter la distance des lettres":
      calculatedValue = pxToEm(bodyStyle.letterSpacing);
      calculatedValueNum = parseFloat(calculatedValue);
      rangeInput = createRangeInput(-0.4, 1, calculatedValueNum, 0.1);
      console.log("calcultated value : " + calculatedValue);
      break;
    case "Augmenter la hauteur de ligne":
      calculatedValue = pxToEm(bodyStyle.lineHeight);
      calculatedValueNum = parseFloat(calculatedValue);
      rangeInput = createRangeInput(1, 2, calculatedValueNum, 0.2);
      console.log("calcultated value : " + calculatedValue);
      break;
    case "Augmenter la distance des mots":
      calculatedValue = pxToEm(bodyStyle.wordSpacing);
      calculatedValueNum = parseFloat(calculatedValue);
      rangeInput = createRangeInput(-0.5, 1.25, calculatedValueNum, 0.25);
      console.log("calcultated value : " + calculatedValue);
      break;
    case "Augmenter la distance entre paragraphes":
      const paraStyle = window.getComputedStyle(document.querySelector("p"));
      calculatedValue = paraStyle.margin;
      calculatedValueNum = parseFloat(calculatedValue);
      rangeInput = createRangeInput(0, 50, calculatedValueNum, 5);
      console.log(calculatedValue);
      break;
  }

  return { value: calculatedValueNum, rangeInput, calculatedValue };
}

function pxToEm(pxValue) {
  const baseFontSize = 16;
  if (pxValue === "normal") {
    return "0em";
  }
  const numericValue = parseFloat(pxValue);
  const emValue = numericValue / baseFontSize;
  return `${emValue}em`;
}

function createRangeInput(min, max, value, step) {
  const rangeInput = document.createElement("input");
  rangeInput.type = "range";
  rangeInput.min = min;
  rangeInput.max = max;
  // rangeInput.defaultValue = value;
  rangeInput.step = step;
  rangeInput.className = "range_input";

  // Assurons-nous que l'attribut value est correctement défini
  rangeInput.setAttribute("value", value);

  // Ajout d'un événement pour mettre à jour la valeur affichée
  rangeInput.addEventListener("input", function () {
    updateTooltipValue(parseFloat(this.value).toFixed(1));
    // Mettons également à jour l'attribut value
    this.setAttribute("value", this.value);
  });

  return rangeInput;
}

function updateTooltipValue(value) {
  const spanValue = document.querySelector(".tooltip_p_value");
  if (spanValue) {
    spanValue.textContent = value;
  }
}
