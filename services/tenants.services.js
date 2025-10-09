import { v4 as uuidv4 } from 'uuid'; // Importa la función para generar UUIDs 

// Exporta una función que recibe la instancia de la base de datos
export default (db) => ({
    // Método para obtener todos los registros de la tabla tenants
    async findAll() {
        let query = 'SELECT * FROM tenants'; // Consulta SQL para obtener todos los tenants
        try {
            const results = await db.mysqlquery(query); // Ejecuta la consulta usando el método mysqlquery del objeto db
            const totalCount = results.length; // Obtiene el total de registros encontrados
            return { success: true, status: 200, data: results, totalCount, error: null }; // Devuelve los resultados y el total
        }catch (error) {
            return { success: false, status: 500, data: [], totalCount: 0, error: error.message }; // Devuelve el mensaje de error si ocurre alguno
        }
    }
});