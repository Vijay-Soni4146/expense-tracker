const db = require("../config/database");

class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
    this.email = data.email;
    this.status = data.status;
    this.created_at = data.created_at;
  }

  // Get all users
  static async findAll() {
    try {
      const result = await db.execute("SELECT * FROM users ORDER BY name");
      const users = result[0];
      if (!Array.isArray(users)) {
        console.error("Unexpected query result:", users);
        return [];
      }
      return users.map((user) => new User(user));
    } catch (error) {
      console.error("Database query error:", error);
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const result = await db.execute("SELECT * FROM users WHERE id = ?", [id]);
      const users = result[0];
      return users.length > 0 ? new User(users[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find user: ${error.message}`);
    }
  }

  // Find user by email
  static async findByEmail(email) {
    try {
      const result = await db.execute("SELECT * FROM users WHERE email = ?", [
        email,
      ]);
      const users = result[0];
      return users.length > 0 ? new User(users[0]) : null;
    } catch (error) {
      throw new Error(`Failed to find user by email: ${error.message}`);
    }
  }

  // Create new user
  static async create(userData) {
    try {
      const { name, email, status = 1 } = userData; // Default to 1 (active)

      const result = await db.execute(
        "INSERT INTO users (name, email, status) VALUES (?, ?, ?)",
        [name, email, status]
      );

      const newUser = await User.findById(result.insertId);
      return newUser;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Update user
  async update(userData) {
    try {
      const updates = [];
      const params = [];

      Object.keys(userData).forEach((key) => {
        if (["name", "email", "status"].includes(key)) {
          updates.push(`${key} = ?`);
          params.push(userData[key]);
        }
      });

      if (updates.length === 0) {
        throw new Error("No valid fields to update");
      }

      params.push(this.id);

      await db.execute(
        `UPDATE users SET ${updates.join(", ")} WHERE id = ?`,
        params
      );
      Object.assign(this, userData);
      return this;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user
  async delete() {
    try {
      const result = await db.execute("DELETE FROM users WHERE id = ?", [
        this.id,
      ]);
      return result.affectedRows > 0;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Check if user exists
  static async exists(id) {
    try {
      const result = await db.execute("SELECT id FROM users WHERE id = ?", [
        id,
      ]);
      const users = result[0];
      return users.length > 0;
    } catch (error) {
      throw new Error(`Failed to check user existence: ${error.message}`);
    }
  }
}

module.exports = User;
