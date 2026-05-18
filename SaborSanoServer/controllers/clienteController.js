const { Cliente } = require('../models');

// Función para generar un ID único de cliente
const generarIdCliente = async () => {
  let idCliente;
  let existe = true;
  let intentos = 0;
  const maxIntentos = 10;

  // Generar ID hasta encontrar uno que no exista
  while (existe && intentos < maxIntentos) {
    // Formato: CLI + timestamp (últimos 8 dígitos) + número aleatorio (3 dígitos)
    const timestamp = Date.now().toString().slice(-8);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    idCliente = `CLI${timestamp}${random}`;

    // Verificar si el ID ya existe
    const clienteExistente = await Cliente.findByPk(idCliente);
    existe = !!clienteExistente;
    intentos++;
  }

  if (intentos >= maxIntentos) {
    throw new Error('No se pudo generar un ID único después de varios intentos');
  }

  return idCliente;
};

// Crear un nuevo cliente
const createCliente = async (req, res, next) => {
  try {
    const { nombre, dni, telefono, email, direccion } = req.body;

    // Validar campos requeridos
    if (!nombre || !dni || !telefono || !email || !direccion) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos son requeridos',
        required: ['nombre', 'dni', 'telefono', 'email', 'direccion']
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'El formato del email no es válido'
      });
    }

    // Generar ID único para el cliente
    const idCliente = await generarIdCliente();

    // Crear el cliente
    const cliente = await Cliente.create({
      idCliente,
      nombre,
      dni,
      telefono,
      email,
      direccion
    });

    res.status(201).json({
      success: true,
      message: 'Cliente registrado correctamente',
      data: cliente
    });
  } catch (error) {
    // Manejar errores de duplicados (dni o email únicos)
    if (error.name === 'SequelizeUniqueConstraintError') {
      const field = error.errors[0].path;
      return res.status(409).json({
        success: false,
        message: `El ${field === 'dni' ? 'DNI' : 'email'} ya está registrado`,
        field: field
      });
    }
    
    // Manejar errores de validación
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Error de validación',
        errors: error.errors.map(e => ({
          field: e.path,
          message: e.message
        }))
      });
    }

    next(error);
  }
};

// Obtener perfil del cliente autenticado
const getMiPerfil = async (req, res, next) => {
  try {
    // El cliente ya está en req.cliente gracias al middleware authenticate
    const cliente = req.cliente;

    // Excluir información sensible si es necesario (aunque en este caso no hay contraseñas)
    const clienteData = {
      idCliente: cliente.idCliente,
      nombre: cliente.nombre,
      dni: cliente.dni,
      telefono: cliente.telefono,
      email: cliente.email,
      direccion: cliente.direccion
    };

    res.json({
      success: true,
      data: clienteData
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCliente,
  getMiPerfil
};
