import express from 'express';
import InventoryService from '../services/inventory.services.js';

const router = express.Router();

export default (db) => {
    const service = InventoryService(db);

    // GET: Ver todo el inventario
    router.get('/', async (req, res) => {
        const response = await service.findAll();
        res.status(response.status).json(response);
    });

    // POST: Crear nuevo item
    router.post('/', async (req, res) => {
        const response = await service.create(req.body);
        res.status(response.status).json(response);
    });

    // PUT: Actualizar item (ej. editar cantidad)
    router.put('/:id', async (req, res) => {
        const response = await service.update(req.params.id, req.body);
        res.status(response.status).json(response);
    });

    // DELETE: Borrar item
    router.delete('/:id', async (req, res) => {
        const response = await service.delete(req.params.id);
        res.status(response.status).json(response);
    });

    return router;
}