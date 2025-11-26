import { v4 as uuidv4 } from 'uuid';

export default (db) => ({
    // Obtener historial de cosechas
    async findAll() {
        const query = 'SELECT * FROM harvests ORDER BY date DESC';
        try {
            const results = await db.mysqlquery(query);
            return { 
                success: true, 
                status: results.data.length > 0 ? 200 : 404, 
                data: results.data, 
                error: null 
            };
        } catch (error) {
            return { success: false, status: 500, data: [], error: error.message };
        }
    },

    // Registrar una nueva cosecha
    async create(data) {
        const id = uuidv4();
        // Usamos || '' y || 0 para evitar errores si envían datos vacíos
        const query = `
            INSERT INTO harvests 
            (id, crop, category, quantity, date, recorded_by, recorded_by_partner_name, purchase_price_clp, sale_price_clp) 
            VALUES 
            ('${id}', '${data.crop}', '${data.category}', ${data.quantity}, '${data.date}', 
             '${data.recordedBy}', '${data.recordedByPartnerName || ''}', 
             ${data.purchasePriceClp || 0}, ${data.salePriceClp || 0});
        `;
        try {
            const results = await db.mysqlquery(query);
            const success = results.data.affectedRows > 0;
            return { 
                success, 
                status: success ? 201 : 500, 
                data: { id }, 
                error: null 
            };
        } catch (error) {
            return { success: false, status: 500, data: {}, error: error.message };
        }
    },

    // Eliminar cosecha (por si hubo error de digitación)
    async delete(id) {
        const query = `DELETE FROM harvests WHERE id = '${id}';`;
        try {
            const results = await db.mysqlquery(query);
            const success = results.data.affectedRows > 0;
            return { 
                success: true, 
                status: success ? 200 : 404, 
                data: results.data, 
                error: null 
            };
        } catch (error) {
            return { success: false, status: 500, error: error.message };
        }
    }
});