const express = require('express');
const jwt = require('jsonwebtoken'); // Importamos la librería JWT
const app = express();

let jwtSecret = "mi_clave_secreta_super_segura"; // Una clave secreta para firmar los tokens

// Una "base de datos" simple de libros en formato JSON
let books = {
    1: {"author": "Chinua Achebe", "title": "Things Fall Apart", "reviews": { "review1": "Un clásico absoluto.", "review2": "Lectura obligatoria." } },
    2: {"author": "Hans Christian Andersen", "title": "Fairy tales", "reviews": {} },
    3: {"author": "Dante Alighieri", "title": "The Divine Comedy", "reviews": {} },
    4: {"author": "Unknown", "title": "The Epic Of Gilgamesh", "reviews": {} },
    5: {"author": "Unknown", "title": "The Book Of Job", "reviews": {} },
    6: {"author": "Unknown", "title": "One Thousand and One Nights", "reviews": {} },
    7: {"author": "Njál's Saga", "title": "Unknown", "reviews": {} },
    8: {"author": "Jane Austen", "title": "Pride and Prejudice", "reviews": {} },
    9: {"author": "Honoré de Balzac", "title": "Le Père Goriot", "reviews": {} },
    10: {"author": "Samuel Beckett", "title": "Molloy, Malone Dies, The Unnamable, a trilogy", "reviews": {} }
};

// ... tu objeto `books` aquí arriba ...

let users = []; // Array para almacenar usuarios registrados

// Middleware para procesar JSON
app.use(express.json());

// TAREA 1: Endpoint para obtener la lista de todos los libros
// Este es el endpoint que probarás en Postman para la primera tarea.
app.get('/', (req, res) => {
  // Se envía la lista de libros con formato JSON para que sea fácil de leer
  res.send(JSON.stringify(books, null, 4));
});

// TAREA 2: Endpoint para obtener detalles de un libro por ISBN
app.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn; // Obtiene el ISBN de los parámetros de la ruta
  if (books[isbn]) {
    res.send(books[isbn]); // Envía los detalles del libro si se encuentra
  } else {
    res.status(404).json({message: "Libro no encontrado"}); // Mensaje de error si no se encuentra
  }
});

// TAREA 3: Endpoint para obtener la lista de libros por autor
app.get('/author/:author', function (req, res) {
  const authorName = req.params.author;
  const booksByAuthor = [];
  const bookKeys = Object.keys(books); // Obtenemos todas las claves (ISBNs) de los libros

  bookKeys.forEach(key => {
    if (books[key].author === authorName) {
      // Si el autor del libro coincide, lo agregamos a nuestra lista de resultados
      // También incluimos el ISBN para tener la información completa
      booksByAuthor.push({
        isbn: key,
        title: books[key].title,
        reviews: books[key].reviews
      });
    }
  });

  if (booksByAuthor.length > 0) {
    res.send(booksByAuthor); // Enviamos la lista de libros encontrados
  } else {
    res.status(404).json({message: "No se encontraron libros de este autor"});
  }
});

// TAREA 4: Endpoint para obtener detalles de un libro por título
app.get('/title/:title', function (req, res) {
  const titleName = req.params.title;
  const booksByTitle = [];
  const bookKeys = Object.keys(books); // Obtenemos todas las claves (ISBNs)

  bookKeys.forEach(key => {
    if (books[key].title === titleName) {
      // Si el título del libro coincide, lo agregamos a la lista de resultados
      booksByTitle.push({
        isbn: key,
        author: books[key].author,
        reviews: books[key].reviews
      });
    }
  });

  if (booksByTitle.length > 0) {
    res.send(booksByTitle); // Enviamos la lista de libros encontrados
  } else {
    res.status(404).json({message: "No se encontraron libros con este título"});
  }
});

// TAREA 5: Endpoint para obtener las reseñas de un libro por ISBN
app.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  if (books[isbn]) {
    res.send(books[isbn].reviews); // Envía solo las reseñas del libro encontrado
  } else {
    res.status(404).json({message: "Libro no encontrado"});
  }
});

// TAREA 6: Endpoint para registrar un nuevo usuario
app.post("/register", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    // Verificamos si el usuario ya existe
    const doesExist = users.filter((user) => user.username === username).length > 0;
    if (doesExist) {
      return res.status(409).json({message: "El usuario ya existe."});
    } else {
      // Si no existe, lo agregamos al array de usuarios
      users.push({"username": username, "password": password});
      return res.status(201).json({message: "Usuario registrado exitosamente. Ahora puedes iniciar sesión."});
    }
  }
  return res.status(400).json({message: "No se proporcionó usuario y/o contraseña."});
});

// TAREA 7: Endpoint para iniciar sesión
app.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).json({message: "Usuario y/o contraseña no proporcionados."});
  }

  // Buscamos un usuario que coincida con el nombre y la contraseña
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Si el usuario existe, creamos un token JWT
    let accessToken = jwt.sign({
      username: username
    }, jwtSecret, { expiresIn: '1h' }); // El token expira en 1 hora

    // Enviamos el token al cliente
    res.send({message: "Inicio de sesión exitoso", token: accessToken});
  } else {
    // Si las credenciales son incorrectas
    return res.status(401).json({message: "Credenciales inválidas."});
  }
});

// TAREA 8: Endpoint para agregar o modificar la reseña de un libro
app.put("/review/:isbn", (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: "No autorizado: Token no proporcionado o en formato incorrecto."});
  }
  
  const token = authHeader.split(' ')[1]; // Extraemos el token del encabezado 'Bearer <token>'
  const isbn = req.params.isbn;
  const reviewText = req.body.review;

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({message: "Token inválido."}); // Error si el token no es válido
    }

    // El token es válido, 'user' contiene el payload (ej. { username: 'user_test1' })
    const username = user.username;

    if (books[isbn]) {
      // Agrega o modifica la reseña usando el nombre de usuario como clave
      books[isbn].reviews[username] = reviewText;
      return res.status(200).json({message: `La reseña para el libro con ISBN ${isbn} ha sido agregada/modificada.`});
    } else {
      return res.status(404).json({message: "Libro no encontrado."});
    }
  });
});

// TAREA 9: Endpoint para eliminar la reseña de un libro
app.delete("/review/:isbn", (req, res) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({message: "No autorizado: Token no proporcionado o en formato incorrecto."});
  }

  const token = authHeader.split(' ')[1];
  const isbn = req.params.isbn;

  jwt.verify(token, jwtSecret, (err, user) => {
    if (err) {
      return res.status(403).json({message: "Token inválido."});
    }

    const username = user.username;

    if (books[isbn]) {
      // Verifica si el usuario actual tiene una reseña para este libro
      if (books[isbn].reviews[username]) {
        // Elimina la reseña del usuario
        delete books[isbn].reviews[username];
        return res.status(200).json({message: `La reseña del usuario ${username} para el libro con ISBN ${isbn} ha sido eliminada.`});
      } else {
        return res.status(404).json({message: "No se encontró una reseña de este usuario para el libro."});
      }
    } else {
      return res.status(404).json({message: "Libro no encontrado."});
    }
  });
});


// Configurar el puerto en el que escuchará el servidor
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ Servidor "The Book Nook" corriendo en el puerto ${PORT}`);
});