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
        // 1. Insertamos el registro de la merma
        const queryInsert = `
            INSERT INTO losses 
            (id, product_name, quantity, reason, date, recorded_by, recorded_by_partner_name) 
            VALUES 
            ('${id}', '${data.productName}', ${data.quantity}, '${data.reason}', '${data.date}', 
             '${data.recordedBy}', '${data.recordedByPartnerName || ''}');
        `;

        // 2. Actualizamos el inventario restando la cantidad
        // IMPORTANTE: Asumimos que 'product_name' en losses coincide con 'name' en inventory_items
        const queryUpdateStock = `
            UPDATE inventory_items 
            SET quantity = quantity - ${data.quantity} 
            WHERE name = '${data.productName}';
        `;

        try {
            // Ejecutamos la inserción de la merma
            const results = await db.mysqlquery(queryInsert);
            const success = results.data.affectedRows > 0;

            if (success) {
                // Si la merma se guardó, ejecutamos la resta en inventario
                await db.mysqlquery(queryUpdateStock);
            }

            return { success, status: success ? 201 : 500, data: { id }, error: null };
        } catch (error) {
            return { success: false, status: 500, data: {}, error: error.message };
        }
    },

    async delete(id) {
        // NOTA: Si eliminas una merma, ¿debería devolverse el stock al inventario?
        // Si fue un error de dedo, sí. Aquí recuperamos los datos antes de borrar para restaurar stock.
        try {
            // 1. Obtener la merma para saber cuánto devolver
            const getLoss = await db.mysqlquery(`SELECT * FROM losses WHERE id = '${id}'`);
            if (getLoss.data.length === 0) return { success: false, status: 404, error: "Loss not found" };
            
            const lossData = getLoss.data[0];

            // 2. Eliminar la merma
            const queryDelete = `DELETE FROM losses WHERE id = '${id}';`;
            const results = await db.mysqlquery(queryDelete);
            
            // 3. Devolver el stock al inventario (opcional, pero recomendado)
            if (results.data.affectedRows > 0) {
                const restoreStock = `UPDATE inventory_items SET quantity = quantity + ${lossData.quantity} WHERE name = '${lossData.product_name}'`;
                await db.mysqlquery(restoreStock);
            }

            return { success: true, status: 200, data: results.data, error: null };
        } catch (error) {
            return { success: false, status: 500, error: error.message };
        }
    }
});