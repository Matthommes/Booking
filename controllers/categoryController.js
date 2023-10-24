const getAllCategories = (req, res) => {
  res.json({ message: "Categories" });
};

const createCategory = (req, res) => {
  res.json({
    message: "Created new category",
  });
};
module.exports = { getAllCategories, createCategory };
