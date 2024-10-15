let selectedBtn = null;
let tooltip = null;
let iconsData = null;
let vanillaPreset = {};
let userPrefPreset = {};

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
	initVanillaPreset();
	loadPreferences();
});

function fetchIconsData() {
	fetch("../js/icons.json")
		.then((res) => res.json())
		.then((data) => {
			iconsData = data.icons;
			initAcessibilityElement();
		})
		.catch((error) => console.error("Erreur lors du chargement des icônes :", error));
}

function initVanillaPreset() {
	const bodyStyle = window.getComputedStyle(document.body);
	const paraStyle = window.getComputedStyle(document.querySelector("p"));

	vanillaPreset = {
		fontSize: pxToEm(bodyStyle.fontSize),
		letterSpacing: pxToEm(bodyStyle.letterSpacing),
		lineHeight: pxToEm(bodyStyle.lineHeight),
		wordSpacing: pxToEm(bodyStyle.wordSpacing),
		paragraphSpacing: parseFloat(paraStyle.margin),
	};
	userPrefPreset = { ...vanillaPreset };
}

function loadPreferences() {
	const savedPreferences = localStorage.getItem("userAccessibilityPreferences");
	if (savedPreferences) {
		userPrefPreset = JSON.parse(savedPreferences);
		applyPreferences();
	}
}

function applyPreferences() {
	document.body.style.fontSize = `${userPrefPreset.fontSize}em`;
	document.body.style.letterSpacing = `${userPrefPreset.letterSpacing}em`;
	document.body.style.lineHeight = `${userPrefPreset.lineHeight}em`;
	document.body.style.wordSpacing = `${userPrefPreset.wordSpacing}em`;

	const paragraphs = document.getElementsByTagName("p");
	for (let p of paragraphs) {
		p.style.marginTop = `${userPrefPreset.paragraphSpacing}px`;
		p.style.marginBottom = `${userPrefPreset.paragraphSpacing}px`;
	}
}

function savePreferences() {
	localStorage.setItem("userAccessibilityPreferences", JSON.stringify(userPrefPreset));
}

function initAcessibilityElement() {
	document.getElementById("access_letters_size").addEventListener("click", openTooltip);
	document.getElementById("access_letters_spacing").addEventListener("click", openTooltip);
	document.getElementById("access_lines_height").addEventListener("click", openTooltip);
	document.getElementById("access_words_spacing").addEventListener("click", openTooltip);
	document.getElementById("access_paragraph_spacing").addEventListener("click", openTooltip);
	document.getElementById("access_reset").addEventListener("click", resetAcessibilityValues);
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
	let calculatedValue = null;
	let rangeInput = null;
	let unit = "em";

	switch (iconName) {
		case "Augmenter la taile du texte":
			calculatedValue = userPrefPreset.fontSize;
			rangeInput = createRangeInput(0.6, 3, calculatedValue, 0.2, unit, "fontSize");
			break;

		case "Augmenter la distance des lettres":
			calculatedValue = userPrefPreset.letterSpacing;
			rangeInput = createRangeInput(0, 0.7, calculatedValue, 0.1, unit, "letter-spacing");
			break;

		case "Augmenter la hauteur de ligne":
			calculatedValue = userPrefPreset.lineHeight;
			rangeInput = createRangeInput(1, 2, calculatedValue, 0.2, unit, "line-height");
			break;

		case "Augmenter la distance des mots":
			calculatedValue = userPrefPreset.wordSpacing;
			rangeInput = createRangeInput(-0.5, 1.25, calculatedValue, 0.25, unit, "word-spacing");
			break;

		case "Augmenter la distance entre paragraphes":
			unit = "px";
			calculatedValue = userPrefPreset.paragraphSpacing;
			rangeInput = createRangeInput(0, 100, calculatedValue, 10, unit, "margin");
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

function createRangeInput(min, max, value, step, unit, cssProperty) {
	const rangeInput = document.createElement("input");
	rangeInput.type = "range";
	rangeInput.min = min;
	rangeInput.max = max;
	// rangeInput.defaultValue = value;
	rangeInput.step = step;
	rangeInput.className = "range_input";
	rangeInput.setAttribute("value", value);
	rangeInput.dataset.css_property = cssProperty;

	rangeInput.addEventListener("input", function () {
		updateTooltipValue(parseFloat(this.value), unit, cssProperty);
		this.setAttribute("value", this.value);
	});

	return rangeInput;
}

function updateTooltipValue(value, unit, cssProperty) {
	const spanValue = document.querySelector(".tooltip_p_value");
	if (spanValue) {
		spanValue.textContent = value + unit;
	}
	modifyCSSaccessibility(value, unit, cssProperty);
	updateUserPrefPreset(value, cssProperty);
}

function modifyCSSaccessibility(value, unit, cssProperty) {
	let unitValue = value + unit;
	let currentProperty = cssProperty;
	let body = document.body;
	let p = document.getElementsByTagName("p");

	if (currentProperty == "margin") {
		for (let element of p) {
			element.style.marginBottom = unitValue;
			element.style.marginTop = unitValue;
		}
	} else {
		body.style[currentProperty] = unitValue;
	}
}

function updateUserPrefPreset(value, cssProperty) {
	switch (cssProperty) {
		case "fontSize":
			userPrefPreset.fontSize = value;
			break;
		case "letter-spacing":
			userPrefPreset.letterSpacing = value;
			break;
		case "line-height":
			userPrefPreset.lineHeight = value;
			break;
		case "word-spacing":
			userPrefPreset.wordSpacing = value;
			break;
		case "margin":
			userPrefPreset.paragraphSpacing = value;
			break;
	}
	savePreferences();
}

function resetAcessibilityValues() {
	userPrefPreset = { ...vanillaPreset };
	localStorage.removeItem("userAccessibilityPreferences");

	document.body.style.fontSize = `${vanillaPreset.fontSize}em`;
	document.body.style.letterSpacing = `${vanillaPreset.letterSpacing}em`;
	document.body.style.lineHeight = `${vanillaPreset.lineHeight}em`;
	document.body.style.wordSpacing = `${vanillaPreset.wordSpacing}em`;
	const paragraphs = document.getElementsByTagName("p");
	for (let p of paragraphs) {
		p.style.marginTop = `${vanillaPreset.paragraphSpacing}px`;
		p.style.marginBottom = `${vanillaPreset.paragraphSpacing}px`;
	}

	const tooltip = document.querySelector(".tooltip");
	const selectedBtn = document.querySelector(".selectedBtn");
	if (selectedBtn) selectedBtn.classList.remove("selectedBtn");
	if (tooltip) tooltip.style.display = "none";
}
