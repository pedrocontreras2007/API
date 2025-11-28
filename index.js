import dotenv from "dotenv";
import express from "express";
import http from "http";
import cors from "cors";
import bodyParser from "body-parser";
//Importamos el middleware de la base de datos
import DB from "./middleware/db.js";

import harvestRouterFactory from "./routes/harvest.routes.js";
import inventoryRouterFactory from "./routes/inventory.routes.js";
import lossesRouterFactory from "./routes/losses.routes.js";

//import tenantRouterFactory from "./routes/tenants.routes.js";

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const initServer = () => {
    const app = express(); // Crea una instancia de la aplicación Express
    const server = http.createServer(app); // Crea un servidor HTTP con la aplicación Express
    const db = new DB(); // Crea una instancia de la clase DB para manejar la conexión a la base de datos
    const dConnection = {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        port: process.env.DB_PORT,
    }
    db.setDataConnection(dConnection); // Configura la conexión a la base de datos usando las variables de entorno
    
    app.use(bodyParser.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON
    app.use(express.json()); // Middleware para parsear el cuerpo de las solicitudes como JSON
    app.use(express.urlencoded({ extended: true })); // Middleware para parsear cuerpos de solicitudes con URL-encoded
    
    app.use(cors({
    origin: 'http://localhost:4200',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'], // <--- Agregados PUT y DELETE
    allowHeaders: ['Content-Type', 'Authorizations', 'X-Requested-With', 'Accept', 'Origin'],
    credentials: true
    })); // Habilita CORS para permitir solicitudes desde otros dominios
   
    const harvestRouter = harvestRouterFactory(db);
    app.use("/api/harvests", harvestRouter);

    const inventoryRouter = inventoryRouterFactory(db);
    app.use("/api/inventory", inventoryRouter);

    const lossesRouter = lossesRouterFactory(db);
    app.use("/api/losses", lossesRouter);

    //ESTO DE TENANTS ES DE LA API PARA EL TPV 
    //const tenantRouter = tenantRouterFactory(db); // Crea el router para las rutas de tenants, pasando la instancia de la base de datos

    //app.use("/tenants", tenantRouter); // Usa el router de tenants para las rutas que comienzan con /tenants
    
    /* Configuramos una ruta para los propietarios*/
    app.get("/", (req, res) => {
        res.status(200).json({ message: "API REST funcionando correctamente" });
    });

    server.listen(process.env.APP_PORT, () => {
        console.log("Servidor funcionando en el puerto " + process.env.APP_PORT);
    });
}
initServer(); // Inicia el servidor