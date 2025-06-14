const Budget = require('../models/Budget');

exports.addBudgetItem = async (req, res) => {
  try {
    const { category, amount, type, date } = req.body;
    const userId = req.user.id; // from auth middleware

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

exports.getBudgetItems = async (req, res) => {
  try {
    const userId = req.user.id;
    const budgetItems = await Budget.find({ userId }).sort({ date: -1 });
    res.json(budgetItems);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getMonthlySummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const { month, year } = req.query; // Expect month (1-12) and year from frontend

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const budgetItems = await Budget.find({
     userId,
      date: { $gte: startDate, $lt: endDate }
    });

    let totalIncome = 0;
    let totalExpense = 0;

    budgetItems.forEach(item => {
      if (item.type === 'income') totalIncome += item.amount;
      else if (item.type === 'expense') totalExpense += item.amount;
    });

    const balance = totalIncome - totalExpense;

    res.json({ totalIncome, totalExpense, balance });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
