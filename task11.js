const axios = require('axios');

/**
 * Función que busca un libro por ISBN y devuelve una Promesa.
 * @param {number} isbn - El ISBN del libro a buscar.
 * @returns {Promise} - Una Promesa que se resolverá con los datos del libro
 * o se rechazará con un error.
 */
function searchBookByISBN(isbn) {
  const url = `http://localhost:5000/isbn/${isbn}`;
  // axios.get ya devuelve una Promesa, así que simplemente la retornamos.
  return axios.get(url);
}

// --- Demostración de uso ---

// 1. Buscando un libro que SÍ existe (ej. ISBN 2)
const isbnToFind = 2;
console.log(`Buscando libro con ISBN: ${isbnToFind}...`);

searchBookByISBN(isbnToFind)
  .then(response => {
    // .then() se ejecuta si la Promesa se resuelve exitosamente.
    console.log("Libro encontrado exitosamente:");
    console.log(response.data);
  })
  .catch(error => {
    // .catch() se ejecuta si la Promesa es rechazada (hubo un error).
    if (error.response && error.response.status === 404) {
      console.error("Error: Libro no encontrado.");
    } else {
      console.error("Ocurrió un error:", error.message);
    }
  });

// 2. Buscando un libro que NO existe (ej. ISBN 99) para probar el error.
const nonExistentISBN = 99;
console.log(`\nBuscando libro con ISBN: ${nonExistentISBN}...`);

searchBookByISBN(nonExistentISBN)
    .then(response => {
        console.log("Libro encontrado exitosamente:", response.data);
    })
    .catch(error => {
        if (error.response && error.response.status === 404) {
            console.error("Error: Libro con ISBN 99 no encontrado, tal como se esperaba.");
        } else {
            console.error("Ocurrió un error inesperado:", error.message);
        }
    });