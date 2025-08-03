const axios = require('axios');

/**
 * Función asíncrona que busca libros por su título.
 * @param {string} title - El título del libro a buscar.
 */
async function searchByTitle(title) {
  // Nota: Axios codifica automáticamente los espacios y otros caracteres especiales en la URL.
  const url = `http://localhost:5000/title/${title}`;
  
  try {
    // Usamos 'await' para esperar la respuesta de la API.
    const response = await axios.get(url);
    
    console.log(`Libro encontrado por el título "${title}":`);
    console.log(response.data);
  } catch (error) {
    // Manejamos cualquier error que ocurra durante la solicitud.
    if (error.response && error.response.status === 404) {
      console.error(`Error: No se encontró ningún libro con el título "${title}".`);
    } else {
      console.error("Ocurrió un error:", error.message);
    }
  }
}

// --- Demostración de uso ---

// Buscando un libro con un título que sí existe.
searchByTitle('Things Fall Apart');

// Buscando un libro con un título que no existe para probar el error.
// searchByTitle('Cien Años de Soledad');