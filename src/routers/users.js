import { Router } from 'express';
import { UserDTO } from '../dto/userDTO.js';
import { auth } from '../config/auth.js';

const router = Router();

router.get('/current', auth, (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.json(userDTO);
});

export default router;