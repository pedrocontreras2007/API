import express from 'express'; // Importa express para crear rutas
import Tenants from '../services/tenants.services.js'; // Importa el servicio de tenants
const router = express.Router(); // Crea una instancia de router de express

export default(db) => {
    const Tenants = Tenants(db); // Inicializa el servicio de tenants con la base de datos

    /** Ruta para obtener todos los datos de tenants **/
    router.get('/', async (req, res) => {
        const qData = await Tenant.findAll(); // Llama al método para obtener todos los tenants
        let data = qData.data; // Obtiene los datos
        let status = qData.status; // Obtiene el status de la respuesta
        let message = qData.message; // Obtiene el mensaje de la respuesta
        res.status(status).json({ data, message }); // Devuelve la respuesta en formato JSON
    });

    /** Ruta para obtener un tenant por ID **/
    router.get('/:id', (req, res) => {
        // Aquí se implementaría la lógica para obtener un tenant por su ID
    });

    /** Ruta para insertar datos y crear nuevo registro **/
    router.post('/', (req, res) => {
        // Aquí se implementaría la lógica para crear un nuevo tenant
    });

    /** Ruta para actualizar datos/registro (total) **/
    router.put('/', (req, res) => {
        // Aquí se implementaría la lógica para actualizar completamente un tenant
    });

    /** Ruta para actualizar datos/registro (parcial) **/
    router.patch('/', (req, res) => {
        // Aquí se implementaría la lógica para actualizar parcialmente un tenant
    });

    /** Ruta para eliminar un registro **/
    router.delete('/', (req, res) => {
        // Aquí se implementaría la lógica para eliminar un tenant
    });

    return router; // Retorna el router configurado
}