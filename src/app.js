import express from "express";
import { __dirname } from "./utilities.js";
import path from "path";
import handlebars from "express-handlebars";

import productsRouter from "./routers/products.router.js";
import cartsRouter from "./routers/carts.router.js";
import homeRouter from "./routers/home.router.js";
import RTPRouter from "./routers/realtimeproducts.router.js";
import dotenv from 'dotenv';
dotenv.config();



const app = express();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.engine('handlebars', handlebars.engine({
    defaultLayout: 'main',
    runtimeOptions: {
      allowProtoMethodsByDefault: true,
    },
  }));
//app.engine("handlebars", handlebars.engine());
console.log(__dirname);
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "handlebars");

app.use("/", homeRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/realtimeproducts", RTPRouter);


export default app;
