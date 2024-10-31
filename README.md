
# Desarrollo de funcionalidades dinámicas con JavaScript

Este proyecto es una aplicación web que permite gestionar la información de clientes a través de un formulario. La aplicación valida los datos ingresados y se comunica con una API para agregar o modificar la información de los clientes.

## Tabla de Contenidos

1. Características
2. Tecnologías usadas
3. Instalación
4. Uso
5. Funciones de validación
6. API de Gestión de Clientes

## Características

* Validación de formularios en tiempo real.
* Soporte para agregar nuevos clientes.
* Modificación de datos existentes de clientes.
* Eliminar clientes de la base de datos.
* Verificación de la unicidad del correo electrónico.
* Persistencia de datos utilizando `localStorage`.
* Interfaz de usuario para mostrar y gestionar clientes en una tabla.

## Tecnologías Usadas

* JavaScript
* HTML/CSS
* API REST
* IndexedDB para almacenamiento
* Font Awesome para iconos

## Instalación

1. Clona el repositorio:

```bash
git clone <URL-del-repositorio>

```

2. Navega al directorio del proyecto:

```bash
cd nombre-del-repositorio

```

3. Abre el archivo `index.html` en tu navegador para ejecutar la aplicación.

## Uso

1. **Agregar un Cliente** : Completa todos los campos obligatorios (nombre, email, teléfono, empresa) y presiona "Enviar".
  Completa todos los campos obligatorios (nombre, email, teléfono, empresa) y presiona "Enviar".

    Ejemplo: Si deseas agregar un cliente llamado "Manuel Rivas", ingresa:
    Nombre: Manuel Rivas
    Email: manuel.rivas@example.com
    Teléfono: 645431315
    Empresa: Rafael Alberti 

2. **Modificar un Cliente** : Si hay datos guardados en `localStorage`, estos se cargarán automáticamente en el formulario al iniciar la aplicación.
    Ejemplo: Cambia el teléfono de "Manuel Rivas" a 675434241 y presiona "Enviar".

3. **Eliminar un Cliente** : Haz clic en el ícono de eliminación (X) junto al cliente que deseas eliminar en la tabla. Esto eliminará el cliente de la base de datos.

    Ejemplo: Para eliminar a "Manuel Rivas", haz clic en la X y confirma la acción.
## Funciones de Validación

El sistema incluye varias funciones de validación para asegurar que la información ingresada sea correcta:

* **`verifyName`** : Verifica que el nombre no contenga dígitos y que no esté vacío.
* **`verifyEmail`** : Comprueba que el formato del correo electrónico sea válido y que no esté vacío.
* **`verifyPhone`** : Valida que el número de teléfono contenga entre 7 y 15 dígitos y que no esté vacío.
* **`verifyBusiness`** : Asegura que el campo de empresa no esté vacío.

## API de Gestión de Clientes

El proyecto utiliza una API para interactuar con una base de datos IndexedDB, la cual permite realizar las siguientes operaciones:

* **Inicialización de la Base de Datos** :

```javascript
initDB();

```

  Se crea una base de datos llamada `ClientDatabase` y se establece un almacén de objetos para almacenar los datos de los clientes.

* **Agregar un Cliente** :

```javascript
addClient(clientData);

```

  Se añade un nuevo cliente a la base de datos.
  Ejemplo: addClient({ name: 'Manuel Rivas', email: 'manuel.rivas@example.com', phone: '645431315', business: 'Rafael Alberti' });

* **Eliminar un Cliente** :

```javascript
deleteClient(clientId);

```

  Se elimina un cliente existente de la base de datos mediante su ID.
  Ejemplo: deleteClient(1); (donde 1 es el ID del cliente).

* **Modificar un Cliente** :

```javascript
modifyClient(updatedClientData); 


```

  Se actualizan los datos de un cliente existente en la base de datos.
  Ejemplo: modifyClient({ id: 1, name: 'Manuel Rivas', email: 'manuel.rivas@example.com', phone: '551515516', business: 'Casa Rivas' })

* **Obtener Todos los Clientes** :

```javascript
getAllClients();

```

  Se recuperan todos los clientes almacenados en la base de datos.

* **Verificar si un Correo Electrónico Existe** :

```javascript
emailExists(email);

```

  Se comprueba si un correo electrónico ya está en uso en la base de datos.
  Ejemplo: emailExists('manuel.rivas@example.com'); devuelve true si el correo ya existe
