const axios = require('axios');

/**
 * Función asíncrona que busca libros por autor.
 * @param {string} author - El nombre del autor a buscar.
 */
async function searchByAuthor(author) {
  const url = `http://localhost:5000/author/${author}`;
  
  try {
    // 'await' pausa la ejecución hasta que la Promesa de axios se resuelva.
    const response = await axios.get(url);
    
    // Si la solicitud es exitosa, se ejecuta esta parte.
    console.log(`Libros encontrados para el autor "${author}":`);
    console.log(response.data);
  } catch (error) {
    // Si la Promesa es rechazada (error), se ejecuta el bloque catch.
    if (error.response && error.response.status === 404) {
      console.error(`Error: No se encontraron libros para el autor "${author}".`);
    } else {
      console.error("Ocurrió un error:", error.message);
    }
  }
}

// --- Demostración de uso ---

// Buscando un autor que SÍ tiene libros en la lista.
searchByAuthor('Jane Austen');

// Buscando un autor que NO tiene libros para probar el error.
// searchByAuthor('Gabriel Garcia Marquez');