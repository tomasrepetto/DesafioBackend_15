import { Router } from 'express';
import { getProductsController, getProductsByIdController, addProductController, deleteProduct, modificarProductsController } from '../controllers/productsController.js';
import { generateMockMusicProducts } from '../middleware/mocking.js';
import passport from 'passport';
import { auth, authorize } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/mockingproducts', (req, res) => {
    const mockProducts = generateMockMusicProducts(100);
    res.status(200).json(mockProducts);
});

router.get('/', getProductsController);
router.get('/:pid', getProductsByIdController);
router.post('/', auth, authorize(['premium']), addProductController); // Solo usuarios premium pueden crear productos
router.put('/:pid', auth, authorize(['premium']), modificarProductsController); // Solo usuarios premium pueden modificar productos
router.delete('/:id', auth, authorize(['premium']), deleteProduct); // Solo usuarios premium pueden eliminar productos

export default router;

