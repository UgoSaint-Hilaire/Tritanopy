function validateForm() {
  let isValid = true;

  // Clear previous error messages
  document.getElementById("message-error").innerText = "";
  document.getElementById("message-error").style.display = "none"; // Cache le message d'erreur au début
  const inputGroups = document.querySelectorAll(".input-group"); // Sélectionne tous les groupes d'input
  inputGroups.forEach((group) => {
    group.classList.remove("input-error"); // Retire la classe d'erreur de tous les champs
  });

  // Validate Name
  const name = document.getElementById("name").value;
  if (name.trim() === "") {
    isValid = false;
    document.getElementById("input-name").classList.add("input-error");
  }

  // Validate Email
  const email = document.getElementById("email").value;
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  if (email.trim() === "") {
    isValid = false;
    document.getElementById("input-email").classList.add("input-error");
  } else if (!emailPattern.test(email)) {
    isValid = false;
    document.getElementById("input-email").classList.add("input-error");
  }

  // Validate Message
  const message = document.getElementById("message").value;
  if (message.trim() === "") {
    isValid = false;
    document.getElementById("input-message").classList.add("input-error");
  }

  // Affiche le message d'erreur s'il y a des erreurs
  if (!isValid) {
    document.getElementById("message-error").innerText =
      "Veuillez remplir tous les champs.";
    document.getElementById("message-error").style.display = "block"; // Affiche le message d'erreur
    document.getElementById("input-message").classList.add("input-error"); // Ajoute la classe d'erreur pour le message
  }

  return isValid;
}
