import { Router } from "express";
import ProductManager from "../utils/productManager.js";
const router = Router();
const productManager = new ProductManager("./products.json");

router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;
    console.log("Solicitud GET a /products recibida");
    let products = await productManager.getProducts();
    console.log(products);

    if (limit && !isNaN(parseInt(limit, 10))) {
      const limitNumber = parseInt(limit, 10);
      products = products.slice(0, limitNumber);
    }

    res.render("home", { layout: "main", products: products });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

export default router;
