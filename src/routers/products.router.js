import { Router } from 'express';
import ProductModel from '../models/product.model.js';

const router = Router();

router.get('/', async (req, res) => {
  const { page = 1, limit = 10, group, sort } = req.query; // sort: asc | desc
  const opts = { page, limit, sort: { price: sort || 'asc' } };
  const criteria = {};
  if (group) {
    criteria.group = group;
  }
  const result = await ProductModel.paginate(criteria, opts);
  console.log(result);
  res.render('products', buildResponse({ ...result, group, sort }));
  /*const response = buildResponse({ ...result, group, sort });
  res.json(response); */
});

const buildResponse = (data) => {
  return {
    status: 'success',
    payload: data.docs.map(product => product.toJSON()),
    totalPages: data.totalPages,
    prevPage: data.prevPage,
    nextPage: data.nextPage,
    page: data.page,
    hasPrevPage: data.hasPrevPage,
    hasNextPage: data.hasNextPage,
    prevLink: data.hasPrevPage ? `http://localhost:8080/products?limit=${data.limit}&page=${data.prevPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
    nextLink: data.hasNextPage ? `http://localhost:8080/products?limit=${data.limit}&page=${data.nextPage}${data.group ? `&group=${data.group}` : ''}${data.sort ? `&sort=${data.sort}` : ''}` : '',
  };
};
export default router;