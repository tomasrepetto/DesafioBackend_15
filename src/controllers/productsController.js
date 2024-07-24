// src/controllers/productsController.js
import productsServices from '../services/productsServices.js';
import { CustomError } from '../middleware/errorHandler.js';

export const getProductsController = async (req, res, next) => {
    try {
        const products = await productsServices.getProductsServices();
        res.status(200).json(products);
    } catch (error) {
        next(new CustomError('ValidationError', 'Error al obtener productos'));
    }
};

export const addProductController = async (req, res, next) => {
    const { title, price, ...rest } = req.body;
    if (!title || !price) {
        return next(new CustomError('MissingFieldsError', 'Todos los campos son requeridos'));
    }
    try {
        const product = await productsServices.addProductService({ title, price, ...rest });
        res.status(201).json(product);
    } catch (error) {
        next(new CustomError('ValidationError', error.message));
    }
};

export const getProductsByIdController = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await productsServices.getProductsByIdService(pid);
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        res.status(200).json(product);
    } catch (error) {
        next(new CustomError('ValidationError', 'Error al obtener producto por ID'));
    }
};

export const deleteProductsByIdController = async (req, res, next) => {
    const { pid } = req.params;
    try {
        const product = await productsServices.deleteProductsByIdService(pid);
        if (product) {
            return res.json({ message: 'Producto eliminado', product });
        }
        res.status(404).json({ message: `No se pudo eliminar el producto con id ${pid}` });
    } catch (error) {
        next(new CustomError('ValidationError', 'Error al eliminar producto'));
    }
};

export const modificarProductsController = async (req, res, next) => {
    const { pid } = req.params;
    const { _id, ...rest } = req.body;
    try {
        const product = await productsServices.modificarProductsService(pid, rest);
        if (product) {
            return res.json({ message: 'Producto actualizado', product });
        }
        res.status(404).json({ message: `No se pudo actualizar el producto con id ${pid}` });
    } catch (error) {
        next(new CustomError('ValidationError', 'Error al actualizar producto'));
    }
};








