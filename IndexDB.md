<h1 align="center"> INDEXED DB </h1>

---

**¿Qué es?**

Es un sistema NoSQL que nos permite añadir casi cualquier tipo de dato brindando persistencia de datos dentro del navegador del usuario lo que permite hacer consultas independientemente de la disponibilidad de la red.

Esta API esta hecha para almacenar grandes cantidades de datos y que tengan cierta estructura. Trabajando mediante transacciones, las cuales son asíncronas y trabajan bajo peticiones (request) que estan ligadas a las operaciones que desea realizar y devuelve un evento cada vez que son resueltos. Al ser asíncrona, podemos navegar por la interfaz mientras se hacen las operaciones.

Además esta opción es mucho más interesante para manejar grandes paquetes de distintos datos (incluido complejos) ya que por ejemplo LocalStorage antes de almacenar los datos debe transformarlos a String, no permite la adición directa como si hace IndexedDB

**LocalStorage**

```javascript
// Definimos una lista de tareas
const tasks = [
  { id: 1, title: 'Comprar leche', completed: false },
  { id: 2, title: 'Leer un libro', completed: true },
  { id: 3, title: 'Hacer ejercicio', completed: false }
];

// Almacenamos la lista de tareas como un string en localStorage
localStorage.setItem('tasks', JSON.stringify(tasks));

// Recuperamos la lista de tareas y la convertimos de nuevo a un objeto
const storedTasks = JSON.parse(localStorage.getItem('tasks'));

// Mostramos las tareas en la consola
storedTasks.forEach(task => {
  console.log(`Tarea: ${task.title}, Completada: ${task.completed}`);
});

```

**IndexedDB**

```javascript
// Abriendo la base de datos IndexedDB
const request = window.indexedDB.open('taskDatabase', 1);

request.onupgradeneeded = (event) => {
  const db = event.target.result;
  // Creamos una tienda de objetos para las tareas
  const taskStore = db.createObjectStore('tasks', { keyPath: 'id' });

  // Almacenamos las tareas en la base de datos
  taskStore.put({ id: 1, title: 'Comprar leche', completed: false });
  taskStore.put({ id: 2, title: 'Leer un libro', completed: true });
  taskStore.put({ id: 3, title: 'Hacer ejercicio', completed: false });
};

request.onsuccess = (event) => {
  const db = event.target.result;
  const transaction = db.transaction(['tasks'], 'readonly');
  const taskStore = transaction.objectStore('tasks');

  // Consultando la base de datos para obtener todas las tareas
  const getAllRequest = taskStore.getAll();
  getAllRequest.onsuccess = () => {
    const tasks = getAllRequest.result;
    // Mostramos las tareas en la consola
    tasks.forEach(task => {
      console.log(`Tarea: ${task.title}, Completada: ${task.completed}`);
    });
  };
};

```

---

[Using IndexedDB - Web APIs | MDN* . (2024, October 27). MDN Web Docs.](**https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)

[Cuzcano, A. V. (2022, January 4).  *IndexedDB paso a paso* . DEV Community.](https://dev.to/pandresdev/indexeddb-paso-a-paso-3i50)

[Cuzcano, A. V. (2022b, January 4).  *IndexedDB paso a paso* . DEV Community](https://dev.to/pandresdev/indexeddb-paso-a-paso-3i50)

[Olusoji, A. (2024, April 22). 9 differences between IndexedDB and LocalStorage. DEV Community](https://dev.to/armstrong2035/9-differences-between-indexeddb-and-localstorage-30ai)

## CONFIGURACIÓN INICIAL

---

El primer paso sería abrir la base de datos

```JAVASCRIPT
// Abrimos la base de datos
const request = window.indexedDB.open("BaseDeDatosParaManuel", 3);
```

Esta función no abre directamente la base de datos si que nos devuelve un objeto **IDBOpenRequest** con un resultado como succes o error que se maneja como un evento. En este caso si funciona nos devolvera una instancia de **IDBDatabase**.

> [!NOTE]
>
> El primer parámetro de la función es el nombre que tendra la base de datos en el navegador, debe ser único por aplicación.
>
> El segundo parámetro es la versión de la base de datos, aunque puede no especificarse e iniciara con la versión más moderna. Esta versión es lo que define el Database Scheme que es como se estructuran los datos dentro de la base de datos

Esta función nos devuelve tres eventos que debemos controlar:

- Onerror -> Si la creación falla

```Javascript
request.onerror = function(event) {
  console.error("Error al abrir la base de datos:", event.target.error)
}
```

- Onsucces -> Se ejecuta cada vez que se conecta o se crea la base de datos.

```Javascript
request.onsuccess = function(event) {
  const db = event.target.result; // Acceso a la base de datos abierta
  
  // Manejo de transacciones
}
```

- Onupgradeneeded -> Se ejecuta una sola vez, cuando se crea la base de datos o se actualiza. Tambien sirve para actualizar la versión, que viene siendo la estructura de datos de la misma.

```Javascript
request.onupgradeneeded = (event) => {
  const db = event.target.result

  // Crear una tienda de objetos para almacenar datos de usuarios
  const objectStore = db.createObjectStore("perdedores", { keyPath: "id" })

  // Opcional: Agregar algunos datos iniciales
  objectStore.add({ id: 1, nombre: "Boruto", edad: 25 })
  objectStore.add({ id: 2, nombre: "Aether", edad: 30 })
}
```

---

*[Using IndexedDB - Web APIs | MDN* . (2024, October 27). MDN Web Docs.](**https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB)**

[Cuzcano, A. V. (2022, January 4).  *IndexedDB paso a paso* . DEV Community.](https://dev.to/pandresdev/indexeddb-paso-a-paso-3i50)

[Cuzcano, A. V. (2022b, January 4).  *IndexedDB paso a paso* . DEV Community](https://dev.to/pandresdev/indexeddb-paso-a-paso-3i50)

### ESTRUCTURA DE BASE DE DATOS

---

IndexedDB al ser noSQL tiene su manera de almacenar los datos. En esta API se utilizan los llamados **Object Store** que son parecidas a las tablas en las bases de datos relacionales, por lo que una base de datos puede tener varios object stores.

Para mayor integridad de los datos, solo pueden crearse y borrarse con la función $\ callback^1$ **idb.open()**, que contiene un método llamado createObjectStore().

```Javascript
IDBDatabase.createObjectStore(name);
Or,
IDBDatabase.createObjectStore(name, options);
```

Options nos permite configurar distintos configuraciones en nuestro almacenador de datos

> [!NOTA]
>
> 1. Una función callback es una función que se pasa a otra función como argumento

```Javascript
let dbRequest = indexedDB.open("BaseDeDatosParaManuel", 1)

dbRequest.onupgradeneeded = event => {
   let database = event.target.result
   let tiendaClientes = database.createObjectStore("clientes")
}   
```

También deberemos crear una clave primaria para almacenar de manera única datos en un object store. Hay dos maneras de realizar esto:

- Keypath -> Es una propiedad que **siempre** existe y contiene un valor único.
- Keygenerator -> Crea un valor único para cada objeto dentro del object store. Si no se menciona nada como parametro en el método de createObjectStore, se asigna esto a nuestro contenedor de datos.

La sintaxis para crear una clave primaria es:

```Javascript
let objectStore = db.createObjectStore("ObjectStoreName", { keyPath: "primary key, autoincrement/autoDecrement : true" });
```

Y un ejemplo sería:

```Javascript
var request = indexedDB.open("BaseDeDatosParaManuel", 2);
      request.onupgradeneeded = event => {
         var db = event.target.result;
         var objectStore = db.createObjectStore("customers",{keyPath:"id", autoIncrement:true});
         document.write("Object store Created Successfully...");
      };
```

---

[Función Callback - Glosario de MDN Web Docs: Definiciones de términos relacionados con la Web | MDN. (n.d.). MDN Web Docs. ](https://developer.mozilla.org/es/docs/Glossary/Callback_function)

[IndexedDB - Object Stores. (n.d.).](https://www.tutorialspoint.com/indexeddb/indexeddb_object_stores.htm)

## Transacciones

---

```Javascript
db.transaction(store[, type]);
```

Una **transaccion** es un grupo de operaciones que deben tener éxito o
deben fallar. Una peculiaridad de IndexedDB es que todas las operaciones
de datos deben ser hechas con una transaccion

Hay dos parametros utilizables en las transacciones:

**Store** -> El nombre del object store sobre el que queremos trabajar

**Type** -> El tipo de transaccion puede ser:

- **Readonly**: Solo de lectura
- **Readwrite**: Se puede leer y escribir los datos (No se puede modificar, crear o
  borrar datos, eso solo en onupgradeneeded)

---

[_IndexedDB - Transactions_. (n.d.)](https://www.tutorialspoint.com/indexeddb/indexeddb_transactions.html)

## Operaciones básicas

---

### Agregar datos

Para agregar datos a un object store primero abriremos una transaccion y luego utilizaremos la siguiente sintaxis Si la clave del elemento ya existe retornara un error *ConstraintError*

```Javascript
let request = objectStore.add(data, key);
```

Un ejemplo practico seria este:

```Javascript
let solicitud = indexedDB.open("empresaDB", 1)

solicitud.onsuccess = evento => {
    document.write("Base de datos de empresa abierta exitosamente")
    let baseDeDatos = evento.target.result
    let transaccion = baseDeDatos.transaction("empleados", "readwrite")
    let almacenEmpleados = transaccion.objectStore("empleados")

    almacenEmpleados.add({ id: 101, nombre: "Ana", departamento: "Marketing" })
    almacenEmpleados.add({ id: 102, nombre: "Luis", departamento: "Finanzas" })
    almacenEmpleados.add({ id: 103, nombre: "Marta", departamento: "Recursos Humanos" })
    almacenEmpleados.add({ id: 104, nombre: "Pedro", departamento: "Ingeniería" })
    almacenEmpleados.add({ id: 105, nombre: "Sofía", departamento: "Ventas" })
}
```

### Leer datos

Sintaxis:

```Javascript
request = objectStore.get(key);
```

Este método se utiliza con las claves primarias del object storage.

```Javascript
// Abrimos (o creamos) la base de datos "miBase" con versión 1
let solicitud = indexedDB.open("miBase", 1)

// Se ejecuta si la base de datos necesita ser creada o actualizada
solicitud.onupgradeneeded = evento => {
    let db = evento.target.result
    let store = db.createObjectStore("usuarios", { keyPath: "id" }) // Creamos el object store "usuarios" con "id" como clave primaria
    store.add({ id: 1, nombre: "Carlos", edad: 30 })
    store.add({ id: 2, nombre: "María", edad: 25 })
}

// Una vez abierta con éxito la base de datos
solicitud.onsuccess = evento => {
    let db = evento.target.result

    // Iniciamos una transacción en modo solo lectura para el store "usuarios"
    let transaccion = db.transaction("usuarios", "readonly")
    let store = transaccion.objectStore("usuarios")

    // Realizamos una consulta para obtener el registro con id 1
    let consulta = store.get(1)

    // Cuando la consulta es exitosa, mostramos el resultado
    consulta.onsuccess = () => {
        if (consulta.result) {
            console.log("Usuario encontrado:", consulta.result)
        } else {
            console.log("No se encontró el usuario con id 1")
        }
    }
}
```

Y para obtener todo lo que haya guardado en el object storage es:

```Javascript
request = objectStore.getAll(restriccionOpcional);
```

Esto nos devolvera todas los datos que haya o si se especifica una condición
todos los que cumplan esa condición

```Javascript
let request = indexedDB.open("miBaseDeDatos", 1)

request.onsuccess = event => {
    let db = event.target.result
    let transaccion = db.transaction("productos", "readonly")
    let objectStore = transaccion.objectStore("productos")

    // Obtener todos los registros sin restricción
    let consulta = objectStore.getAll()

    consulta.onsuccess = () => {
        console.log("Todos los productos:", consulta.result)
    }
}
```

**Getall**

```Javascript
let request = indexedDB.open("miBaseDeDatos", 1)

request.onupgradeneeded = event => {
    let db = event.target.result
    let objectStore = db.createObjectStore("usuarios", { keyPath: "id" })

    // Luego se profundizara en este apartado
    objectStore.createIndex("ciudad", "ciudad", { unique: false })

    // Agregamos algunos datos de ejemplo
    objectStore.add({ id: 1, nombre: "Carlos", ciudad: "Madrid" })
    objectStore.add({ id: 2, nombre: "Ana", ciudad: "Barcelona" })
    objectStore.add({ id: 3, nombre: "Luis", ciudad: "Madrid" })
}

request.onsuccess = event => {
    let db = event.target.result
    let transaccion = db.transaction("usuarios", "readonly")
    let objectStore = transaccion.objectStore("usuarios")

    // Usamos el índice "ciudad" para obtener solo los usuarios de Madrid
    let indice = objectStore.index("ciudad")
    let consulta = indice.getAll("Madrid") // Recupera todos los usuarios de "Madrid"

    consulta.onsuccess = () => {
        console.log("Usuarios en Madrid:", consulta.result)
    }
}
```

### Modificar datos

El método **`put()`** es utilizado para actualizar registros existentes o para insertar nuevos registros en un **object store**. Su caso de uso favorable sería para asegurar la existencia del elemento en la base de datos ya que este método no retorna ningún error ya que sino existe, directamente lo inserta

```Javascript
put(item)
put(item, key)
```

Los parámetros son:

- Item -> Este es el objeto que deseas agregar o actualizar en la base de datos. Este objeto debe cumplir con la estructura definida en el **object store**
- Key -> Un valor opcional que permite especificar la clave del objeto que deseas actualizar. Si no se proporciona, el item debe incluir la clave primaria necesaria.

Aquí un ejemplo

```Javascript
let request = indexedDB.open("miBaseDeDatos", 1)

request.onsuccess = event => {
    let db = event.target.result
    let transaccion = db.transaction("productos", "readwrite")
    let objectStore = transaccion.objectStore("productos")

    // Suponiendo que queremos actualizar el precio del producto con id 1
    let productoActualizado = { id: 1, nombre: "Laptop", precio: 1200 } // Nuevo precio

    let resultado = objectStore.put(productoActualizado)

    resultado.onsuccess = () => {
        console.log("Producto actualizado con éxito:", productoActualizado)
    }

    resultado.onerror = () => {
        console.error("Error al actualizar el producto")
    }
}


```

### Eliminar datos

El método **delete()** retorna un IDBRequest object y en un hilo separado, borra la entrada o entradas especificadas. Este método acepta una key o un rango de keys a eliminar. También si se quiere eliminar todo a la vez se puede utilizar el método .

```Javascript
delete(key)
```

- **Key**: Este es el valor de la clave que identifica el registro que deseas eliminar. Si se especifica un rango de claves, se eliminarán todos los registros que coincidan con ese rango.

El método delete() devuelve un objeto **`IDBRequest`**. Puedes utilizar este objeto para manejar el éxito o el error de la operación. Si hay un error durante la operación, puedes manejarlo utilizando la propiedad onerror.

```Javascript
let request = indexedDB.open("miBiblioteca", 1)

request.onsuccess = event => {
    let db = event.target.result
    let transaccion = db.transaction("libros", "readwrite")
    let objectStore = transaccion.objectStore("libros")

    // Clave del libro que deseamos eliminar
    let claveLibroAEliminar = 2 

    // Realizamos la operación de eliminación
    let resultadoEliminacion = objectStore.delete(claveLibroAEliminar)

    resultadoEliminacion.onsuccess = () => {
        console.log(`El libro con clave ${claveLibroAEliminar} ha sido eliminado exitosamente`)
    }

    resultadoEliminacion.onerror = () => {
        console.error(`Error al intentar eliminar el libro con clave ${claveLibroAEliminar}`)
    }
}
```

---

[MDN Web Docs - IDBObjectStore.put()](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/put)
[JavaScript.info - IndexedDB](https://tr.javascript.info/indexeddb)
[TutorialsPoint - IndexedDB - Reading Data](https://www.tutorialspoint.com/indexeddb/indexeddb_reading_data.htm)
[Reality Ripple - IDBObjectStore.put()](https://udn.realityripple.com/docs/Web/API/IDBObjectStore/put)

## Índices

---

Los **índices** son una forma especial de organizar los datos en IndexedDB que permiten recuperar información de manera más eficiente. Estos son estructuras que facilitan el acceso a los datos del object store. En lugar de usar la clave primaria del object store para buscar, se puede utilizar un indice de una propiedad especifica de los datos como su clave de búsqueda.

Tiene los siguientes parámetros:

- **indexName**: El nombre del índice que se desea crear. Es posible crear un índice sin nombre, es decir, con un indexName vacío.
- **keyPath**: La ruta de la clave que el índice utilizará para acceder a los datos. También es posible crear un índice sin una keyPath definida, o incluso pasar una secuencia (un arreglo) como keyPath para definir una clave compuesta, permitiendo que el índice use varias propiedades del objeto como clave.
- **Options**: Diversas opciones que crean distintas restricciones en el indice.

```Javascript
let request = indexedDB.open("miColecciónDePelículas", 1)

request.onupgradeneeded = event => {
    let db = event.target.result

    // Crear el object store para las películas
    let peliculasStore = db.createObjectStore("peliculas", { keyPath: "id" })

    // Crear un índice para buscar por director
    peliculasStore.createIndex("directorIndex", "director", { unique: false })

    console.log("Object store 'peliculas' y el índice 'directorIndex' creados exitosamente")
}

request.onsuccess = event => {
    let db = event.target.result
    console.log("Base de datos abierta exitosamente")

    // Ejemplo de agregar películas al object store
    let transaccion = db.transaction("peliculas", "readwrite")
    let objectStore = transaccion.objectStore("peliculas")

    // Agregar algunas películas
    objectStore.add({ id: 1, titulo: "Inception", director: "Christopher Nolan", anio: 2010 })
    objectStore.add({ id: 2, titulo: "The Godfather", director: "Francis Ford Coppola", anio: 1972 })
    objectStore.add({ id: 3, titulo: "Pulp Fiction", director: "Quentin Tarantino", anio: 1994 })

    console.log("Películas agregadas exitosamente")
}
```

Luego se podria utilizar un getAll( Index ) para obtener todos los valores que coincidan con ese campo.

```Javascript
let query = directorIndex.getAll("Christopher Nolan") // Buscando todas las películas de este director
query.onsuccess = () => {
    console.log("Películas encontradas:", query.result) // Mostrando las películas encontradas
}
```

---

[TutorialsPoint - IndexedDB - Indexes](https://www.tutorialspoint.com/indexeddb/indexeddb_indexes.htm)
[MDN Web Docs - IDBObjectStore.createIndex()](https://developer.mozilla.org/en-US/docs/Web/API/IDBObjectStore/createIndex#indexname)

## Rangos

---

Los rangos en IndexedDB se utilizan para recuperar una parte específica de la información en lugar de obtener todos los datos almacenados. Esto resulta útil cuando solo se necesita una sección de la información, optimizando así la consulta y mejorando el rendimiento.

IndexedDB ofrece un objeto llamado IDBKeyRange, el cual tiene cuatro métodos principales para definir estos rangos:

1. **IDBKeyRange.lowerBound(indexKey)**: Devuelve un rango que incluye todos los valores mayores o iguales a indexKey.
2. **IDBKeyRange.upperBound(indexKey)**: Devuelve un rango que incluye todos los valores menores o iguales a indexKey.
3. **IDBKeyRange.bound(lowerIndexKey, upperIndexKey)**: Devuelve un rango de valores comprendidos entre lowerIndexKey y upperIndexKey, incluyendo ambos límites.
4. **IDBKeyRange.only(indexKey)**: Devuelve un rango que incluye únicamente el valor exacto de indexKey. Este método es útil para obtener un valor específico en lugar de un rango.

---

[TutorialsPoint - IndexedDB - Ranges](https://www.tutorialspoint.com/indexeddb/indexeddb_ranges.htm)


## Cursores

---

Crear un cursor 

``` Javascript
let transaction = db.transaction('telepizzaWorkers', 'readonly');
let objectStore = transaction.objectStore('telepizzaWorkers');
let request = objectStore.openCursor();  // abrir cursor
```

¿Cómo usarlo?

``` Javascript
request.onsuccess = (event) => {
    let cursor = event.target.result;
    if (cursor) {
        console.log(cursor.key, cursor.value);  // Acceder clave y valor
        cursor.continue();  // Avanzar al siguiente
    }
}
```

Direccion del cursor 
 
La dirección en la que el cursor debe moverse

``` Javascript
objectStore.openCursor(null, 'next');        // Ascendente (default)
objectStore.openCursor(null, 'prev');        // Descendente
objectStore.openCursor(null, 'nextunique');  // Ascendente sin duplicados
```


Ejemplo

``` Javascript
request.onsuccess = (event) => {
    let db = event.target.result;

    // 2. Iniciar una transacción de lectura en el objeto de almacenamiento "estudiantes"
    let transaction = db.transaction("estudiantes", "readonly");
    let objectStore = transaction.objectStore("estudiantes");

    // 3. Crear y usar el cursor
    let cursorRequest = objectStore.openCursor();

    cursorRequest.onsuccess = (event) => {
        let cursor = event.target.result;
        if (cursor) {
            // 4. Procesar cada registro
            console.log(`ID: ${cursor.key}, Nombre: ${cursor.value.nombre}, Calificación: ${cursor.value.calificacion}`);
            cursor.continue();  // Avanzar al siguiente registro
        } else {
            console.log("Todos los registros han sido leídos.");
        }
    };

    cursorRequest.onerror = (event) => {
        console.error("Error al abrir el cursor:", event.target.error);
    };
};
```