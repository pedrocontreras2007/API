import { v4 as uuidv4 } from 'uuid';

export default (db) => ({
    async findAll() {
        const query = 'SELECT * FROM losses ORDER BY date DESC';
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
            INSERT INTO losses 
            (id, product_name, quantity, reason, date, recorded_by, recorded_by_partner_name) 
            VALUES 
            ('${id}', '${data.productName}', ${data.quantity}, '${data.reason}', '${data.date}', 
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

    async delete(id) {
        const query = `DELETE FROM losses WHERE id = '${id}';`;
        try {
            const results = await db.mysqlquery(query);
            const success = results.data.affectedRows > 0;
            return { success: true, status: success ? 200 : 404, data: results.data, error: null };
        } catch (error) {
            return { success: false, status: 500, error: error.message };
        }
    }
});