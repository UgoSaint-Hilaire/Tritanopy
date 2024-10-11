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
    createTooltip(content.name, content.value, content.rangeInput);
    positionTooltip(clickedBtn);
  }
}

function createTooltip(text, value, rangeInput) {
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
  spanValue.textContent = value;

  p.appendChild(textNode);
  p.appendChild(spanValue);

  tooltip.appendChild(p);

  if (rangeInput) {
    tooltip.appendChild(rangeInput);
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
    const { value, rangeInput } = calculateValue(icon.name);
    return { name: icon.text, value, rangeInput };
  } else {
    console.error("Icône non trouvée.");
    return { name: "err", value: "err", rangeInput: null };
  }
}

function calculateValue(iconName) {
  const bodyStyle = window.getComputedStyle(document.body);
  let calculatedValue = null;
  let rangeInput = null;

  switch (iconName) {
    case "Augmenter la taile du texte":
      calculatedValue = pxToEm(bodyStyle.fontSize);
      rangeInput = createRangeInput(0.5, 3, parseFloat(calculatedValue), 0.2);
      break;
    case "Augmenter la distance des lettres":
      calculatedValue = pxToEm(bodyStyle.letterSpacing);
      rangeInput = createRangeInput(0, 1, parseFloat(calculatedValue), 0.05);
      break;
    case "Augmenter la hauteur de ligne":
      calculatedValue = pxToEm(bodyStyle.lineHeight);
      rangeInput = createRangeInput(1, 3, parseFloat(calculatedValue), 0.1);
      break;
    case "Augmenter la distance des mots":
      calculatedValue = pxToEm(bodyStyle.wordSpacing);
      rangeInput = createRangeInput(0, 2, parseFloat(calculatedValue), 0.1);
      break;
    case "Augmenter la distance entre paragraphes":
      const paraStyle = window.getComputedStyle(document.querySelector("p"));
      calculatedValue = parseFloat(paraStyle.margin);
      rangeInput = createRangeInput(0, 50, calculatedValue, 5);
      break;
  }

  return { value: calculatedValue, rangeInput };
}

function pxToEm(pxValue) {
  // 1em == 16px par défaut
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
  rangeInput.value = value;
  rangeInput.step = step;
  rangeInput.className = "range_input";

  return rangeInput;
}
