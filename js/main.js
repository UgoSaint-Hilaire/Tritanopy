function validateForm() {
	let isValid = true;
	let isEmailValid = true;

	// Clear previous error messages
	document.getElementById("message-error").innerText = "";
	document.getElementById("message-error").style.display = "none";
	document.getElementById("name-error").innerText = "";
	document.getElementById("name-error").style.display = "none";
	document.getElementById("email-error").innerText = "";
	document.getElementById("email-error").style.display = "none";
	document.getElementById("error-icon-1").style.display = "none";
	document.getElementById("error-icon-2").style.display = "none";
	document.getElementById("error-icon-3").style.display = "none";
	const inputGroups = document.querySelectorAll(".input-group");
	inputGroups.forEach((group) => {
		group.classList.remove("input-error");
	});

	// Validate Name
	const name = document.getElementById("name").value;
	if (name.trim() === "") {
		isValid = false;
		document.getElementById("input-name").classList.add("input-error");
		document.getElementById("name-error").innerText = "Veuillez remplir ce champ.";
		document.getElementById("name-error").style.display = "block";
		document.getElementById("error-icon-1").style.display = "block";
		document.getElementById("border-error-1").classList.add("border-left");
	} else {
		document.getElementById("border-error-1").classList.remove("border-left");
	}

	// Validate Email
	const email = document.getElementById("email").value;
	const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	if (email.trim() === "") {
		isValid = false;
		document.getElementById("input-email").classList.add("input-error");
		document.getElementById("email-error").innerText = "Veuillez remplir ce champ.";
		document.getElementById("email-error").style.display = "block";
		document.getElementById("error-icon-2").style.display = "block";
		document.getElementById("border-error-2").classList.add("border-left");
	} else if (!emailPattern.test(email)) {
		isEmailValid = false;
		isValid = false;
		document.getElementById("input-email").classList.add("input-error");
		document.getElementById("email-error").innerText = "Format du mail incorrect. (exemple@mail.mail)";
		document.getElementById("email-error").style.display = "block";
		document.getElementById("error-icon-2").style.display = "block";
		document.getElementById("border-error-2").classList.add("border-left");
	} else {
		document.getElementById("border-error-2").classList.remove("border-left");
	}

	// Validate Message
	const message = document.getElementById("message").value;
	if (message.trim() === "") {
		isValid = false;
		document.getElementById("input-message").classList.add("input-error");
		document.getElementById("message-error").innerText = "Veuillez remplir ce champ.";
		document.getElementById("message-error").style.display = "block";
		document.getElementById("error-icon-3").style.display = "block";
		document.getElementById("border-error-3").classList.add("border-left");
	} else {
		document.getElementById("border-error-3").classList.remove("border-left");
	}

	return isValid;
}
