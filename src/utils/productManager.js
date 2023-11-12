import fs from "fs";
import { v4 as uuidv4 } from 'uuid';

class ProductManager {
  constructor(path) {
    this.path = path;
    
  }

  async addProduct(product) {
    try {
      const { title, description, price, thumbnail, code, stock } = product;
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        throw new Error("Todos los campos son obligatorios.");
      }
      const products = await getJSONFromFile(this.path);
      if (products.some((p) => p.code === code)) {
        console.log(`Ya se encuentra agregado ese code: ${code}`);
      } else {
        const id = uuidv4();
        // console.log( "Id: ", this.productIdCounter)
        const newProduct = {
          title,
          description,
          price,
          thumbnail,
          code,
          stock,
          id,
        };
        products.push(newProduct);
        await saveJSONToFile(this.path, products);
        return newProduct; // si borramos esta linea, funciona igual (xq f5?)
      }
    } catch (error) {
      console.error(`Error al agregar un producto: ${error.message}`);
    }
  }

  async getProducts() {
    return await getJSONFromFile(this.path);
  }

  async getProductById(id) {
    const products = await this.getProducts();
    const productById = products.find((p) => p.id === id);
    if (!productById) {
      console.log("Product not found");
      return null;
    } else {
      console.log("Product found", productById);
      return productById;
    }
  }

  async updateProduct(
    newTitle,
    newDescription,
    newPrice,
    newThumbnail,
    newCode,
    newStock,
    id
  ) {
    try {
      if (
        !newTitle ||
        !newDescription ||
        !newPrice ||
        !newThumbnail ||
        !newCode ||
        !newStock ||
        !id
      ) {
        throw new Error(
          "Todos los campos son obligatorios para actualizar el producto."
        );
      }

      const products = await getJSONFromFile(this.path);
      const index = products.findIndex((p) => p.id === id);

      if (index === -1) {
        return { error: `Producto no encontrado, ID: ${id}` };
      } else {
        products[index] = {
          title: newTitle,
          description: newDescription,
          price: newPrice,
          thumbnail: newThumbnail,
          code: newCode,
          stock: newStock,
          id: id,
        };

        await saveJSONToFile(this.path, products);

        return products[index];
      }
    } catch (error) {
      console.error(error);
      return { error: "Ocurrió un error al actualizar el producto." };
    }
  }

  async deleteProduct(id) {
    const products = await this.getProducts();
    let index = products.findIndex((p) => p.id === id);
    if (index > -1) {
      products.splice(index, 1);
      await saveJSONToFile(this.path, products);
      console.log("Se ha borrado correctamente el producto");
    } else {
      console.log("No se ha podido borrar el producto");
    }
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

export default ProductManager;
