const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/admin');
const goal = require('../model/Goals');


 // Import your Goal model


// Define the route to create a Goal
router.post('/create', isAdmin, async (req, res, next) => {
    const { name } = req.body;
    try {
        // Create a new Goal object
        const newGoal = new goal({
            name
        });

        // Save the Goal to the database
        const Goal = await newGoal.save();

        // Send response
        res.status(201).json({ success: true, Goal });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to fetch all Goals
router.get('/get-goal', async (req, res, next) => {
    try {
        // Fetch all Goals from the database
        const Goals = await goal.find();

        // Send response with Goal data
        res.status(200).json({ success: true, Goals });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to update a Goal
router.put('/update/:GoalId', isAdmin, async (req, res, next) => {
    const { name } = req.body;
    const { GoalId } = req.params;
    try {
        // Find the Goal by ID
        let Goal = await goal.findById(GoalId);

        if (!Goal) {
            return res.status(404).json({ success: false, message: 'Goal not found' });
        }

        // Update Goal fields
        Goal.name = name;

        // Save the updated Goal to the database
        Goal = await Goal.save();

        // Send response
        res.status(200).json({ success: true, Goal });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

// Define the route to delete a Goal
router.delete('/delete/:GoalId', isAdmin, async (req, res, next) => {
    const { GoalId } = req.params;
    try {
        // Find the Goal by ID and delete it
        const Goal = await goal.findByIdAndDelete(GoalId);

        if (!Goal) {
            return res.status(404).json({ success: false, message: 'Goal not found' });
        }

        // Send response
        res.status(200).json({ success: true, message: 'Goal deleted successfully' });
    } catch (error) {
        // Handle errors
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
