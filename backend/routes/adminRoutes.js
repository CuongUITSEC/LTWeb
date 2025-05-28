const express = require('express');
const User = require('../models/User');
const { authMiddleware, isAdmin } = require('../middleware/authMiddleware');
const router = express.Router();

// @route  GET /api/admin/users
// @desc   Get all users
// @access Private/Admin
router.get("/", authMiddleware, isAdmin, async (req, res) => {
    try {
        const users = await User.find().select("-password"); // Exclude password field
        res.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route POST /api/admin/users/
// @desc  Create a new user (admin only)
// @access Private/Admin
router.post("/", authMiddleware, isAdmin, async (req, res) => {
    const { name, email, password, isAdmin } = req.body;

    try {
        const user = new User({
            name,
            email,
            password,
            role: role || 'customer', 
            //isAdmin
        });

        const createdUser = await user.save();
        res.status(201).json({message: "User created successfully",createdUser});
    } catch (error) {
        console.error('Error creating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// @route PUT /api/admin/users/:id
// @desc  Update a user (admin only)
// @access Private/Admin
router.put("/:id", authMiddleware, isAdmin, async (req, res) => {
    const { name, email, password, role } = req.body;

    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password; // Hashing should be handled in the User model
        }
        user.role = role || user.role;

        const updatedUser = await user.save();
        res.json({ message: "User updated successfully", updatedUser });
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
// @route DELETE /api/admin/users/:id
// @desc  Delete a user (admin only)
// @access Private/Admin
router.delete("/:id", authMiddleware, isAdmin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        await user.remove();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});
module.exports = router;