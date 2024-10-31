// Global variable to store database

let db

// Start the database
export function initDB() {
    // We use a promise to ensure the finilization of the function
    return new Promise((resolve, reject) => {
        const request = indexedDB.open("ClientDatabase", 2);

        request.onupgradeneeded = function (e) {
            db = e.target.result;

            const objectStore = db.createObjectStore("clientes", {
                keyPath: "id",
                autoIncrement: true,
            });
            // Use the index to ensure the email is unique in the database
            objectStore.createIndex("email", "email", { unique: true });
        };

        request.onsuccess = function (e) {
            db = e.target.result
            console.log("Conexión abierta con éxito")
            resolve(); // Resolve once the database connection is successful
        };

        request.onerror = function (e) {
            console.error("Error al conectar la base de datos ", e.target.errorCode);
            reject(e.target.errorCode); // Reject with the error code on failure
        };
    });
}

// Add a client objectc to the database
export function addClient(clientDatabase) {
    const transaction = db.transaction(["clientes"], "readwrite")
    const objectStore = transaction.objectStore("clientes")

    const request = objectStore.add(clientDatabase)

    request.onsuccess = function(){
        console.log("Cliente agregado a ", clientDatabase)
    }

    request.onerror = function(e) {
        console.error("Error al agregar al cliente en ", e.target.errorCode)
    }
}

// Delete a client object from the database with the client ID
export function deleteClient(clientId) {
    if (!db) {
        console.error("La base de datos no está inicializada")
        return
    }

    const transaction = db.transaction(["clientes"], "readwrite")
    const objectStore = transaction.objectStore("clientes")

    const request = objectStore.delete(clientId)

    request.onsuccess = function() {
        console.log(`Cliente con ID ${clientId} eliminado correctamente.`)
    };

    request.onerror = function(e) {
        console.error("Error al eliminar el cliente: ", e.target.errorCode)
    };
}

// Modify a client
export function modifyClient(newClient) {
    if (!db) {
        console.error("La base de datos no está inicializada")
        return
    }

    const transaction = db.transaction(["clientes"], "readwrite")
    const objectStore = transaction.objectStore("clientes")

    const request = objectStore.put(newClient)

    request.onsuccess = () => {
        console.log("Cliente actualizado")
    }

    request.onerror = () => {
        console.error("Error al actualizar el cliente")
    }
}

// Return the client you are looking for
export function getClient(clientId) {
    if (!db) {
        console.error("La base de datos no está inicializada")
        return
    }

    const transaction = db.transaction(["clientes"], "readonly")
    const objectStore = transaction.objectStore("clientes")

    const request = objectStore.get(clientId)

    request.onsuccess = () => {

        if(request.result){
            console.log("Cliente encontrado", request.result)
        } else{ 
            console.log(`No se encontro un usuario con el id ${clientId}`)
        }
    }
}

// Return all the stored clients
export function getAllClients() {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("La base de datos no está inicializada")
            reject("Database not initialized")
            return
        }

        const transaction = db.transaction(["clientes"], "readonly")
        const objectStore = transaction.objectStore("clientes")
        const request = objectStore.getAll()

        request.onsuccess = () => {
            console.log("Clientes devueltos con éxito")
            resolve(request.result)
        }

        request.onerror = (e) => {
            console.error("Error al obtener todos los clientes:", e.target.errorCode)
            reject(e.target.errorCode)
        }
    })
}

// Look if an email exists in the database by the email index
export function emailExists(email) {
    return new Promise((resolve, reject) => {
        if (!db) {
            console.error("La base de datos no está inicializada")
            return reject("Database not initialized")
        }

        const transaction = db.transaction(["clientes"], "readonly")
        const objectStore = transaction.objectStore("clientes")
        
        // Create an index to search for email
        const request = objectStore.index("email").get(email)

        request.onsuccess = () => {
            // If result is undefined it means that the email doesn't exist
            resolve(request.result !== undefined)
        };

        request.onerror = (e) => {
            console.error("Error al comprobar el email:", e.target.errorCode)
            reject(e.target.errorCode)
        };
    });
}
