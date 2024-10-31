// Client form validation and submission script
// This script handles client information input, validates the fields, and submits valid data to the API.


    // Imports

    import { addClient, initDB } from './API.js';


    // Global validation state variable
    let isFormValid = false

    // Selectors

    const nameField = document.querySelector("#nombre")
    const emailField = document.querySelector("#email")
    const phoneField = document.querySelector("#telefono")
    const businessField = document.querySelector("#empresa")
    const form = document.querySelector("#formulario")
    const addClientBtn = form.querySelector(`input[type="submit"]`)

    // Initialize the database once the DOM content has fully loaded
    document.addEventListener("DOMContentLoaded", () => {
        initDB()
    })
    
    // Listeners
    // Add `blur` event listeners to trigger validation when the user leaves a field

    nameField.addEventListener("blur", verify)
    emailField.addEventListener("blur", verify)
    phoneField.addEventListener("blur", verify)
    businessField.addEventListener("blur", verify)

    form.addEventListener("submit", (e) => {
        e.preventDefault() // Prevent default form submission behavior
        if (isFormValid) {
            console.log("Intentando agregar el siguiente cliente: ", clientObj)
            addClient(clientObj) // Call API function to add client
            resetData()
        } else {
            console.log("El formulario no es válido. Corrige los errores antes de enviar.")
        }
    })

    // Client Object
    // Object to store client data temporarily before submission

    const clientObj = {
        "nombre": "",
        "email": "",
        "telefono": "",
        "empresa": ""
    }



    // Functions


    function verify(e) {
        
        // Destructure field name and value from event target
        const {name, value} = e.target

        // Map of validation functions by field name
        const validationFunctions = {
            "nombre": verifyName,
            "email": verifyEmail,
            "telefono": verifyPhone,
            "empresa": verifyBusiness
        }

        // Check if a validation function exists for the field, then validate
        if (validationFunctions[name]) {
            const { isValid, message } = validationFunctions[name](value)

            if (isValid) {
                cleanAlert(e.target.parentElement)
                clientObj[name] = value
            } else {
                showAlert(e.target.parentElement, message)
                clientObj[name] = ""
            }
        }
        
        // Check if all fields in clientObj have values, indicating form validity
        isFormValid = Object.values(clientObj).every(value => value !== "")

        // Toggle submit button enabled/disabled based on form validity
        if(isFormValid){
            addClientBtn.classList.remove("opacity-50")
            addClientBtn.disabled = false
        } else {
            addClientBtn.classList.add("opacity-50")
            addClientBtn.disabled = true
        }
        console.log(clientObj)
    }


    // Validation function for name field
    // Ensures name has no digits and is not empty
    export function verifyName(string){
        const regex = /^[^\d]*$/ // Matches any string without digits
        const isFieldValid = regex.test(string)

        if (string === "") {
            return validyField(isFieldValid, "El campo nombre es obligatorio")
        } else {
            return validyField(isFieldValid, "El campo nombre no puede tener dígitos")
        }
        
    }

    
    export function verifyEmail(string) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/ // Regex pattern to validate a basic email structure
        const isFieldValid = regex.test(string)

        if(string === "") {
            return validyField(isFieldValid, "El campo email es obligatorio")
        } else {
            return validyField(isFieldValid, "El campo email no tiene el formato adecuado")
        }
    }

    export function verifyPhone(string) {
        const regex = /^\d{7,15}$/ // Regex pattern to validate a phone number with 7 to 15 digits
        const isFieldValid = regex.test(string)

        if(string === ""){
            return validyField(isFieldValid, "El campo teléfono es obligatorio")
        } else {
            return validyField(isFieldValid, "Formato no válido")

        }
    }

    export function verifyBusiness(string){
        const isFieldValid = (string.trim() !== "")

        if(string === "") {
            return validyField(isFieldValid, "El campo de empresa es obligatorio")
        } else {
            return validyField(isFieldValid, "No se permiten letras")

        }
    }

        // Display an alert message under a specific field
        export function showAlert(reference, mensaje){

        cleanAlert(reference)

        const error = document.createElement("P")
        error.textContent = mensaje
        error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
        reference.appendChild(error)
    }
    
    // Delete an alert from an specific field
    export function cleanAlert(reference) {
        const alert = reference.querySelector(".bg-red-600")
            if(alert) { 
                alert.remove()
            } 
    }

    // Validates if the field has all the requirements
    export function validyField(boolean, text) {
        if (boolean) {
            return { isValid: true, message: "" }
        } else {
            return { isValid: false, message: text }
        }
    }

    // Reset the data from the form and the store object
    export function resetData(){
        clientObj.nombre = ""
        clientObj.email = ""
        clientObj.telefono = ""
        clientObj.empresa = ""

        nameField.value = ""
        emailField.value = ""
        phoneField.value = ""
        businessField.value = ""

    }