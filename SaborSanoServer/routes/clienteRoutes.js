const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/authMiddleware');
const {
  createCliente,
  getMiPerfil
} = require('../controllers/clienteController');

// POST /api/clientes - Registrar un nuevo cliente (público)
router.post('/', createCliente);

// GET /api/clientes/mi-perfil - Obtener perfil del cliente autenticado (protegido)
router.get('/mi-perfil', authenticate, getMiPerfil);

module.exports = router;
