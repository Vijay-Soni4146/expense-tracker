const db = require("../config/database");

class Category {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.created_at = data.created_at;
  }

  // Get all categories
  static async findAll() {
    try {
      const result = await db.execute("SELECT * FROM categories ORDER BY name");
      const categories = result[0]; 
      if (!Array.isArray(categories)) {
        console.error("Unexpected query result:", categories);
        return [];
      }
      return categories.map((category) => new Category(category));
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }

  // Find category by ID
  static async findById(id) {
    try {
      const result = await db.execute("SELECT * FROM categories WHERE id = ?", [
        id,
      ]);
      const categories = result[0];
      return categories.length > 0 ? new Category(categories[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find category: ${error.message}`);
    }
  }

  // Find category by name
  static async findByName(name) {
    try {
      const result = await db.execute(
        "SELECT * FROM categories WHERE name = ?",
        [name]
      );
      const categories = result[0];
      return categories.length > 0 ? new Category(categories[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find category by name: ${error.message}`);
    }
  }

  // Create new category
  static async create(categoryData) {
    try {
      const { name } = categoryData;

      const result = await db.execute(
        "INSERT INTO categories (name) VALUES (?)",
        [name]
      );

      const newCategory = await Category.findById(result.insertId);
      return newCategory;
    } catch (error) {
      throw new Error(`Failed to create category: ${error.message}`);
    }
  }

  // Update category
  async update(categoryData) {
    try {
      const { name } = categoryData;

      await db.execute("UPDATE categories SET name = ? WHERE id = ?", [
        name,
        this.id,
      ]);

      this.name = name;
      return this;
    } catch (error) {
      throw new Error(`Failed to update category: ${error.message}`);
    }
  }

  // Delete category
  async delete() {
    try {
      const result = await db.execute("DELETE FROM categories WHERE id = ?", [
        this.id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete category: ${error.message}`);
    }
  }

  // Check if category exists
  static async exists(id) {
    try {
      const result = await db.execute(
        "SELECT id FROM categories WHERE id = ?",
        [id]
      );
      const categories = result[0];
      return categories.length > 0;
    } catch (error) {
      throw new Error(`Failed to check category existence: ${error.message}`);
    }
  }
}

module.exports = Category;
