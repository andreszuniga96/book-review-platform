const axios = require('axios');

// Definimos la URL de la API que devuelve todos los libros
const API_URL = 'http://localhost:5000/';

/**
 * Función que obtiene la lista de libros usando un callback.
 * @param {function} callback - La función a llamar cuando la operación termine.
 * Recibirá (error, data).
 */
function getAllBooks(callback) {
  axios.get(API_URL)
    .then(response => {
      // Si la solicitud es exitosa, llamamos al callback sin error y con los datos.
      callback(null, response.data);
    })
    .catch(error => {
      // Si hay un error, llamamos al callback con el error.
      const errorMessage = "Hubo un error al obtener la lista de libros: " + (error.message || "Error desconocido");
      callback(new Error(errorMessage), null);
    });
}

// --- Demostración de uso ---
console.log("Solicitando la lista de libros...");

getAllBooks((error, books) => {
  if (error) {
    // Si el callback nos devuelve un error, lo mostramos.
    console.error(error.message);
  } else {
    // Si no hay error, mostramos la lista de libros.
    console.log("Lista de libros obtenida exitosamente:");
    console.log(books);
  }
});