import mysql from 'mysql2/promise'; // Importa el módulo mysql2 en modo promesa

// Define la clase DB para manejar la conexión y consultas a MySQL
export default class DB {
    constructor() {
        this.pool = null; // Inicializa el pool de conexiones como null
    }

    // Método para establecer los datos de conexión y crear el pool
    setDataConnection(data){
        this.dataConnection = data; // Guarda los datos de conexión
        this.pool = mysql.createPool({
            ...this.dataConnection, // Expande los datos de conexión
            waitForConnections: true, // Espera si no hay conexiones disponibles
            connectionLimit: 10, // Límite máximo de conexiones simultáneas
            queueLimit: 0, // Sin límite de cola de espera
            multipleStatements: true // Permite ejecutar múltiples sentencias SQL
        });
    }

    // Método para ejecutar una consulta SQL
    async mysqlquery(query) {
        const connection = await this.pool.getConnection(); // Obtiene una conexión del pool
        try {
            const qSQL = connection.format(query); // Formatea la consulta SQL
            const [results] = await connection.query(qSQL); // Ejecuta la consulta y obtiene los resultados
            return {success: true, data: results}; // Devuelve los resultados si todo sale bien
        }catch (error) {
            return {success: false, error: error.message}; // Devuelve el error si ocurre alguno
        }finally{
            if(connection){
                connection.release(); // Libera la conexión de vuelta al pool
            } 
        }
    }
}