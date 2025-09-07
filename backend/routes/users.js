const express = require('express');
const router = express.Router();
const UserController = require('../controllers/userController');
const { validateParams, idParamSchema } = require('../middleware/validation');

// GET /api/users - Get all users
router.get('/', UserController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get('/:id', validateParams(idParamSchema), UserController.getUserById);

// POST /api/users - Create new user
router.post('/', UserController.createUser);

// PUT /api/users/:id - Update user
router.put('/:id', validateParams(idParamSchema), UserController.updateUser);

// DELETE /api/users/:id - Delete user
router.delete('/:id', validateParams(idParamSchema), UserController.deleteUser);

module.exports = router;