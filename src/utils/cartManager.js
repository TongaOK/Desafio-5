import fs from "fs";

class CartManager {
  constructor(path) {
    this.path = path;
    this.cartIdCounter = 1;
  }

  async addCart(cart) {
    const newCart = { id: this.cartIdCounter++, products: [] };
    const carts = await getJSONFromFile(this.path);
    carts.push(newCart);

    return saveJSONToFile(this.path, carts);
  }

  async getCarts() {
    return await getJSONFromFile(this.path);
  }

  async getCartById(id) {
    const carts = await this.getCarts();
    const cartById = carts.find((c) => c.id === id);
    if (!cartById) {
      console.log("Cart not found");
      return null;
    } else {
      console.log("Cart found", cartById);
      return cartById;
    }
  }
  async addProductToCart(id, productId) {
    const carts = await this.getCarts();
    const cartIndex = carts.findIndex((c) => c.id === id);
    if (cartIndex === -1) {
      return { error: `Carrito no encontrado, ID: ${id}` };
    }
    const productIndex = carts[cartIndex].products.findIndex(
      (cartProduct) => cartProduct.id === productId
    );
    if (productIndex === -1) {
      carts[cartIndex].products.push({
        id: productId,
        quantity: 1,
      });
    } else {
      carts[cartIndex].products[productIndex].quantity++;
    }
    await saveJSONToFile(this.path, carts);
  }
}

const existFile = async (path) => {
  try {
    await fs.promises.access(path);
    return true;
  } catch (error) {
    return false;
  }
};

const getJSONFromFile = async (path) => {
  if (!(await existFile(path))) {
    return [];
  }

  let content;

  try {
    content = await fs.promises.readFile(path, "utf-8");
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser leído.`);
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`El archivo ${path} no tiene un formato JSON válido.`);
  }
};

const saveJSONToFile = async (path, data) => {
  const content = JSON.stringify(data, null, "\t");
  try {
    await fs.promises.writeFile(path, content, "utf-8");
  } catch (error) {
    throw new Error(`El archivo ${path} no pudo ser escrito.`);
  }
};

export default CartManager;
