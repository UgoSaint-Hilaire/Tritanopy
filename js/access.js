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
    .catch((error) => console.error("Erreur lors du chargement des icônes :", error));
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
    createTooltip(content.name, content.rangeInput, content.value, content.unit);
    positionTooltip(clickedBtn);
  }
}

function createTooltip(text, rangeInput, value, unit) {
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

  p.appendChild(textNode);
  p.appendChild(spanValue);

  tooltip.appendChild(p);

  if (rangeInput) {
    tooltip.appendChild(rangeInput);
    updateTooltipValue(parseFloat(rangeInput.value), unit);
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
    const { value, rangeInput, unit } = calculateValue(icon.name);
    return { name: icon.text, value, rangeInput, unit };
  } else {
    console.error("Icône non trouvée.");
    return { name: "err", value: "err", rangeInput: null };
  }
}

function calculateValue(iconName) {
  const bodyStyle = window.getComputedStyle(document.body);
  let calculatedValue = null;
  let = null;
  let rangeInput = null;
  let unit = "em";

  switch (iconName) {
    case "Augmenter la taile du texte":
      calculatedValue = pxToEm(bodyStyle.fontSize);
      rangeInput = createRangeInput(0.6, 2, calculatedValue, 0.1, unit);
      console.log(calculatedValue);
      break;
    case "Augmenter la distance des lettres":
      calculatedValue = pxToEm(bodyStyle.letterSpacing);
      rangeInput = createRangeInput(-0.4, 1, calculatedValue, 0.1, unit);
      console.log(calculatedValue);
      break;
    case "Augmenter la hauteur de ligne":
      calculatedValue = pxToEm(bodyStyle.lineHeight);
      rangeInput = createRangeInput(1, 2, calculatedValue, 0.2, unit);
      console.log(calculatedValue);
      break;
    case "Augmenter la distance des mots":
      calculatedValue = pxToEm(bodyStyle.wordSpacing);
      rangeInput = createRangeInput(-0.5, 1.25, calculatedValue, 0.25, unit);
      console.log(calculatedValue);
      break;
    case "Augmenter la distance entre paragraphes":
      unit = "px";
      const paraStyle = window.getComputedStyle(document.querySelector("p"));
      calculatedValueRaw = paraStyle.margin;
      calculatedValue = parseFloat(calculatedValueRaw);
      rangeInput = createRangeInput(0, 50, calculatedValue, 5, unit);
      console.log(calculatedValue);
      break;
  }

  return { value: calculatedValue, rangeInput, unit };
}

function pxToEm(pxValue) {
  const baseFontSize = 16;
  if (pxValue === "normal") {
    return 0;
  }
  const numericValue = parseFloat(pxValue);
  const emValue = numericValue / baseFontSize;
  return emValue;
}

function createRangeInput(min, max, value, step, unit) {
  const rangeInput = document.createElement("input");
  rangeInput.type = "range";
  rangeInput.min = min;
  rangeInput.max = max;
  // rangeInput.defaultValue = value;
  rangeInput.step = step;
  rangeInput.className = "range_input";
  rangeInput.setAttribute("value", value);

  rangeInput.addEventListener("input", function () {
    updateTooltipValue(parseFloat(this.value), unit);
    this.setAttribute("value", this.value);
  });

  return rangeInput;
}

function updateTooltipValue(value, unit) {
  const spanValue = document.querySelector(".tooltip_p_value");
  if (spanValue) {
    spanValue.textContent = value + unit;
  }
}
