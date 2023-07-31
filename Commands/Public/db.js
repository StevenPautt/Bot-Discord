const mysql = require('mysql');

// Crear la conexión a la base de datos
const connection = mysql.createConnection({
  host: 'containers-us-west-62.railway.app',
  user: 'root',
  password: 'nXRnS3cCeqA9qveREbdO',
  database: 'railway',
  port: 5600,
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
