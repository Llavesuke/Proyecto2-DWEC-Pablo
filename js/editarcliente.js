import { initDB, modifyClient, emailExists, getClient } from "./API.js"

// This scripts get the data from the IndexedDb and overwrites the data of the client in the DB

const clientObj = {
    "nombre": "",
    "email": "",
    "telefono": "",
    "empresa": "",
    "id": null // Add ID field to modify the specified client
}

let isFormValid = false;

document.addEventListener("DOMContentLoaded", () => {
    const clientData = JSON.parse(localStorage.getItem("clientData"))
    initDB()

    if (clientData) {
        // Asign values to the data fields
        nameField.value = clientData.nombre
        emailField.value = clientData.email
        phoneField.value = clientData.telefono
        businessField.value = clientData.empresa

        // Asign data to the client Obj with the client Id
        clientObj.id = clientData.id
        clientObj.nombre = clientData.nombre
        clientObj.email = clientData.email
        clientObj.telefono = clientData.telefono
        clientObj.empresa = clientData.empresa
    }
})

// Selects
const nameField = document.querySelector(`input[name="nombre"]`)
const emailField = document.querySelector(`input[name="email"]`)
const phoneField = document.querySelector(`input[name="telefono"]`)
const businessField = document.querySelector(`input[name="empresa"]`)
const form = document.querySelector("#formulario")
const saveChangesBtn = document.querySelector(`input[type="submit"]`)

// Listeners
nameField.addEventListener("blur", verify)
emailField.addEventListener("blur", verify)
phoneField.addEventListener("blur", verify)
businessField.addEventListener("blur", verify)

form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Update the clientObj fields with the values of the form
    clientObj.nombre = nameField.value;
    clientObj.email = emailField.value;
    clientObj.telefono = phoneField.value;
    clientObj.empresa = businessField.value;

    // Verify all the fields all valid
    if (!isFormValid) {
        console.log("El formulario no es válido. Corrige los errores antes de enviar.");
        return;
    }

    // Verify if the email exists in the DB
    const existingEmailClient = await emailExists(clientObj.email);
    const emailCurrentClient = JSON.parse(localStorage.getItem("clientData")).email

    // If the email exists and is not from the current client, show an error
    if (existingEmailClient && emailCurrentClient !== clientObj.email) {
        showAlert(emailField.parentElement, "El email ya existe");
        return;
    }

    // Modify the client at the final
    modifyClient(clientObj);
    localStorage.removeItem("clientData") // Delete the data from the localStorage
    window.location.href = "index.html";
});

// Validate functions
function verify(e) {
    const { name, value } = e.target

    const validationFunctions = {
        "nombre": verifyName,
        "email": verifyEmail,
        "telefono": verifyPhone,
        "empresa": verifyBusiness
    };

    if (validationFunctions[name]) {
        const { isValid, message } = validationFunctions[name](value)

        if (isValid) {
            cleanAlert(e.target.parentElement)
            clientObj[name] = value // Asigna el valor válido al objeto cliente
        } else {
            showAlert(e.target.parentElement, message)
            clientObj[name] = "" // Resetea el campo en caso de error
        }
    }

    isFormValid = Object.values(clientObj).every(value => value !== "")

    if (isFormValid) {
        saveChangesBtn.classList.remove("opacity-50")
        saveChangesBtn.disabled = false
    } else {
        saveChangesBtn.classList.add("opacity-50")
        saveChangesBtn.disabled = true
    }
}


function verifyName(string) {
    const regex = /^[^\d]*$/
    const isFieldValid = regex.test(string)

    if (string === "") {
        return validyField(isFieldValid, "El campo nombre es obligatorio")
    } else {
        return validyField(isFieldValid, "El campo nombre no puede tener dígitos")
    }
}

function verifyEmail(string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isFieldValid = regex.test(string)

    if (string === "") {
        return validyField(isFieldValid, "El campo email es obligatorio")
    } else {
        return validyField(isFieldValid, "El campo email no tiene el formato adecuado")
    }
}

function verifyPhone(string) {
    const regex = /^\d{7,15}$/
    const isFieldValid = regex.test(string)

    if (string === "") {
        return validyField(isFieldValid, "El campo teléfono es obligatorio")
    } else {
        return validyField(isFieldValid, "Formato no válido")
    }
}

function verifyBusiness(string) {
    const isFieldValid = (string.trim() !== "")

    if (string === "") {
        return validyField(isFieldValid, "El campo de empresa es obligatorio")
    } else {
        return validyField(isFieldValid, "No se permiten letras")
    }
}

function showAlert(reference, mensaje) {
    cleanAlert(reference)

    const error = document.createElement("P");
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    reference.appendChild(error)
}

function cleanAlert(reference) {
    const alert = reference.querySelector(".bg-red-600")
    if (alert) {
        alert.remove()
    }
}

function validyField(boolean, text) {
    if (boolean) {
        return { isValid: true, message: "" }
    } else {
        return { isValid: false, message: text }
    }
}