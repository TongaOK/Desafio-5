import { Router } from "express";
import CartModel from "../models/cart.model.js";

const router = Router();

router.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await CartModel.findById(cartId).populate("products.product");
    console.log(cart.products);
    const products = cart.products.map(product =>  product.toJSON())

    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.render('carts', {products: products});
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al cargar el carrito' });
  }
});

router.delete('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const productIndex = cart.products.findIndex(
      (product) => product.product.toString() === req.params.pid
    );
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.json({ message: 'Producto eliminado del carrito' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.put('/:cid', async (req, res) => {
  const cartId = req.params.cid;
  const { products } = req.body;

  try {
    const cart = await CartModel.findById(cartId).populate("products.product");
    console.log(cart);
    if (!cart) {
      return res.status(404).json({ error: 'Carrito no encontrado' });
    }

    console.log(cart)
    cart.products = products;
    await cart.save();

    res.json({ message: 'Carrito actualizado con nuevos productos' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al actualizar el carrito' });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const product = cart.products.find(
      (product) => product.product.toString() === req.params.pid
    );

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado en el carrito' });
    }

    product.quantity = req.body.quantity;
    await cart.save();

    res.json({ message: 'Cantidad del producto actualizada en el carrito' });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

router.delete('/:cid', async (req, res) => {
  try {
    const cart = await CartModel.findById(req.params.cid);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    cart.products = [];
    await cart.save();

    res.json({ message: 'Todos los productos eliminados del carrito' });
  } catch (error) {
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

export default router;
