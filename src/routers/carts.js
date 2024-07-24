import { Router } from 'express';
import { authorize, auth } from '../middleware/authMiddleware.js';
import { purchase } from '../controllers/purchaseController.js';
import { addProductInCart, createCart, deleteCart, deleteProductsInCart, getCartsById, updateCart, updateProductsInCart } from '../controllers/cartsController.js';

const router = Router();

router.get('/:cid', getCartsById);
router.post('/', createCart); 
router.post('/:cid/product/:pid', addProductInCart);
router.delete('/:cid/products/:pid', deleteProductsInCart);
router.put('/:cid', updateCart);
router.put('/:cid/products/:pid', updateProductsInCart);
router.delete('/:cid', deleteCart);

router.post('/:cid/purchase', auth, authorize(['user']), purchase);

export default router;