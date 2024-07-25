import { Router } from 'express';
import { getProductsController, getProductsByIdController, addProductController, deleteProduct, modificarProductsController } from '../controllers/productsController.js';
import { generateMockMusicProducts } from '../middleware/mocking.js';
import passport from 'passport';

const router = Router();

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockMusicProducts(100);
    res.status(200).json(mockProducts);
});

router.get('/', getProductsController);
router.get('/:pid', getProductsByIdController);
router.post('/', addProductController);
router.put('/:pid', modificarProductsController);
router.delete('/:id', passport.authenticate('jwt', { session: false }), deleteProduct);

export default router;