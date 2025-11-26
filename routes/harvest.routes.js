import express from 'express';
import HarvestService from '../services/harvest.services.js';

const router = express.Router();

export default (db) => {
    const service = HarvestService(db);

    // GET: Obtener historial
    router.get('/', async (req, res) => {
        const response = await service.findAll();
        res.status(response.status).json(response);
    });

    // POST: Registrar nueva cosecha
    router.post('/', async (req, res) => {
        const response = await service.create(req.body);
        res.status(response.status).json(response);
    });

    // DELETE: Borrar registro por ID
    router.delete('/:id', async (req, res) => {
        const response = await service.delete(req.params.id);
        res.status(response.status).json(response);
    });

    return router;
}