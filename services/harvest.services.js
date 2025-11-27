import { v4 as uuidv4 } from 'uuid';

export default (db) => ({
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

    async create(data) {
        const id = uuidv4();
        const queryInsert = `
            INSERT INTO harvests 
            (id, crop, category, quantity, date, recorded_by, recorded_by_partner_name, purchase_price_clp, sale_price_clp) 
            VALUES 
            ('${id}', '${data.crop}', '${data.category}', ${data.quantity}, '${data.date}', 
             '${data.recordedBy}', '${data.recordedByPartnerName || ''}', 
             ${data.purchasePriceClp || 0}, ${data.salePriceClp || 0});
        `;

        // Lógica para AUMENTAR inventario al cosechar
        // Asumimos que 'crop' es el nombre del item en inventario
        const queryUpdateStock = `
            UPDATE inventory_items 
            SET quantity = quantity + ${data.quantity} 
            WHERE name = '${data.crop}';
        `;

        try {
            const results = await db.mysqlquery(queryInsert);
            const success = results.data.affectedRows > 0;

            if (success) {
                // Si la cosecha se guardó, aumentamos el inventario
                // Nota: Esto solo funcionará si el item ya existe en inventory_items con ese nombre.
                await db.mysqlquery(queryUpdateStock);
            }

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

    async delete(id) {
        // Al eliminar una cosecha, deberíamos RESTAR ese stock del inventario porque nunca existió realmente
        try {
            const getHarvest = await db.mysqlquery(`SELECT * FROM harvests WHERE id = '${id}'`);
            if (getHarvest.data.length === 0) return { success: false, status: 404, error: "Harvest not found" };
            
            const harvestData = getHarvest.data[0];

            const queryDelete = `DELETE FROM harvests WHERE id = '${id}';`;
            const results = await db.mysqlquery(queryDelete);
            
            if (results.data.affectedRows > 0) {
                const reduceStock = `UPDATE inventory_items SET quantity = quantity - ${harvestData.quantity} WHERE name = '${harvestData.crop}'`;
                await db.mysqlquery(reduceStock);
            }

            return { 
                success: true, 
                status: 200, 
                data: results.data, 
                error: null 
            };
        } catch (error) {
            return { success: false, status: 500, error: error.message };
        }
    }
});