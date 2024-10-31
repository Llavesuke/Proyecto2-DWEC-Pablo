import { initDB, deleteClient, getAllClients } from './API.js';

// Select
const tableBody = document.querySelector("tbody");

// Center all the headers
document.querySelectorAll("th").forEach((header) => {
    header.style.textAlign = "center"
    header.style.verticalAlign = "middle"
})
         
document.addEventListener("DOMContentLoaded", () => {
    initDB()
        .then(() => getAllClients())  // Call getAllClients after the Database is charged
        .then((clients) => {
            loadClientsOnTable(clients); // Pass the clients data to the function to show them in the table
        })
        .catch((error) => {
            console.error("Error al inicializar la base de datos o cargar los clientes:", error)
        });
});

function loadClientsOnTable(clients) {
    tableBody.innerHTML = ""

    clients.forEach((client) => {
        const newRow = document.createElement("TR")
        newRow.setAttribute("client-id", client.id)

        const clientNameTable = document.createElement("TD")
        const clientPhoneTable = document.createElement("TD")
        const clientBusinessTable = document.createElement("TD")
        const actionsTable = document.createElement("TD")
        const editIcon = document.createElement("I")
        const deleteIcon = document.createElement("I")

        deleteIcon.classList.add("fa-solid", "fa-xmark")
        deleteIcon.addEventListener("click", deleteClientFromProgram)


        editIcon.classList.add("fa-solid", "fa-pen-to-square")
        editIcon.addEventListener("click", () => {

            localStorage.setItem("clientData", JSON.stringify(client))
            window.location.href = "editar-cliente.html"
        })

        clientNameTable.textContent = client.nombre;
        clientPhoneTable.textContent = client.telefono;
        clientBusinessTable.textContent = client.empresa;

        actionsTable.appendChild(deleteIcon)
        actionsTable.appendChild(editIcon)
        actionsTable.style.display = "flex"
        actionsTable.style.gap = "8px"
        actionsTable.style.alignItems = "center"
        actionsTable.style.justifyContent = "center";


        [clientNameTable, clientPhoneTable, clientBusinessTable, actionsTable].forEach((cell) => {
            cell.style.textAlign = "center"
            cell.style.verticalAlign = "middle"
        })

        newRow.appendChild(clientNameTable)
        newRow.appendChild(clientPhoneTable)
        newRow.appendChild(clientBusinessTable)
        newRow.appendChild(actionsTable)

        tableBody.appendChild(newRow)
    })
}

function deleteClientFromProgram(e) {
    const rowToDelete = e.target.parentElement.parentElement
    const clientIdToDelete = rowToDelete.getAttribute("client-id")

    rowToDelete.remove()
    deleteClient(Number(clientIdToDelete))
}