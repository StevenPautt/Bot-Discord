const mysql = require('mysql2');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  // Utilizar la URL proporcionada por Railway para la conexión
  uri: process.env.MYSQL_URL,
  database: process.env.MYSQLDATABASE,
});

// Establecer la conexión
connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conexión exitosa a la base de datos MySQL');
});

// Exportar la conexión para usarla en otros archivos
module.exports = connection;
