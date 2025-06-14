const Budget = require('../models/Budget');

// Add new budget item
exports.addBudgetItem = async (req, res) => {
  try {
    const { category, amount, type, date } = req.body;
    const userId = req.user.id;

    const budgetItem = new Budget({
      userId,
      category,
      amount,
      type,
      date
    });

    await budgetItem.save();
    res.status(201).json({ message: 'Budget item added successfully', budgetItem });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// 🔧 Get budget items with optional filtering by month, year, and category
exports.getBudgetItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year, category } = req.query;

    let filter = { userId };

    // Filter by date if month and year are provided
    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    // Filter by category if provided
    if (category) {
      filter.category = category;
    }

    const budgetItems = await Budget.find(filter).sort({ date: -1 });
    res.json(budgetItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get monthly income/expense/balance summary
exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query;

    let filter = { userId };

    if (month && year) {
      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 1);
      filter.date = { $gte: startDate, $lt: endDate };
    }

    const budgetItems = await Budget.find(filter);

    let totalIncome = 0;
    let totalExpense = 0;

    budgetItems.forEach(item => {
      if (item.type === 'income') totalIncome += item.amount;
      else if (item.type === 'expense') totalExpense += item.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (error) {
    console.error("Error in getMonthlySummary:", error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete a budget item
exports.deleteBudgetItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetItemId = req.params.id;

    const deleted = await Budget.findOneAndDelete({ _id: budgetItemId, userId });
    if (!deleted) return res.status(404).json({ error: 'Item not found or unauthorized' });

    res.json({ message: 'Budget item deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update a budget item
exports.updateBudgetItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetItemId = req.params.id;
    const { category, amount, type, date } = req.body;

    const updated = await Budget.findOneAndUpdate(
      { _id: budgetItemId, userId },
      { category, amount, type, date },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Item not found or unauthorized' });

    res.json({ message: 'Budget item updated successfully', budgetItem: updated });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
