import { v4 as uuidv4 } from 'uuid';

export default (db) => ({
    async findAll() {
        const query = 'SELECT * FROM inventory_items ORDER BY name ASC';
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

    async create(data) {
        const id = uuidv4();
        const query = `
            INSERT INTO inventory_items 
            (id, name, quantity, unit, category, recorded_by, recorded_by_partner_name) 
            VALUES 
            ('${id}', '${data.name}', ${data.quantity}, '${data.unit}', '${data.category}', 
             '${data.recordedBy}', '${data.recordedByPartnerName || ''}');
        `;
        try {
            const results = await db.mysqlquery(query);
            const success = results.data.affectedRows > 0;
            return { success, status: success ? 201 : 500, data: { id }, error: null };
        } catch (error) {
            return { success: false, status: 500, data: {}, error: error.message };
        }
    },

    // Función para editar stock (ej. cuando se gasta fertilizante o se rompe una herramienta)
    async update(id, data) {
        const query = `
            UPDATE inventory_items SET 
            name='${data.name}', quantity=${data.quantity}, unit='${data.unit}', 
            category='${data.category}' 
            WHERE id='${id}';
        `;
        try {
            const results = await db.mysqlquery(query);
            const success = results.data.affectedRows > 0;
            return { success, status: success ? 200 : 404, data: results, error: null };
        } catch (error) {
            return { success: false, status: 500, error: error.message };
        }
    },

    async delete(id) {
        const query = `DELETE FROM inventory_items WHERE id = '${id}';`;
        try {
            const results = await db.mysqlquery(query);
            const success = results.data.affectedRows > 0;
            return { success: true, status: success ? 200 : 404, data: results.data, error: null };
        } catch (error) {
            return { success: false, status: 500, error: error.message };
        }
    }
}); 