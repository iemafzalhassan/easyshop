const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const AppError = require('../api/v1/utils/AppError');
const User = require('../api/v1/models/user.model');

class AuthService {
  static async hashPassword(password) {
    const salt = await bcrypt.genSalt(10); // Use same salt rounds as model
    return bcrypt.hash(password, salt);
  }

  static generateToken(userId, tokenVersion) {
    const payload = {
      userId,
      timestamp: Date.now()
    };

    // Only include version if it's provided
    if (tokenVersion !== undefined) {
      payload.version = tokenVersion;
    }

    return jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { 
        expiresIn: process.env.JWT_EXPIRE || '7d',
        algorithm: 'HS256'
      }
    );
  }

  static async createUser(userData) {
    // Let the model middleware handle password hashing
    const user = new User(userData);
    await user.save();
    
    // Remove password from response
    user.password = undefined;
    return user;
  }

  static async findUserByEmail(email) {
    return User.findOne({ email }).select('+password');
  }

  static async findUserById(id) {
    return User.findById(id).select('-password');
  }

  static async validatePassword(user, password) {
    if (!user || !password) {
      throw new AppError('Invalid credentials', 401);
    }
    
    // Use the model's comparePassword method
    const isValid = await user.comparePassword(password);
    if (!isValid) {
      throw new AppError('Invalid credentials', 401);
    }

    return true;
  }

  static async verifyCredentials(email, password) {
    try {
      // Find user by email
      const user = await this.findUserByEmail(email);
      if (!user) {
        throw new AppError('Invalid credentials', 401);
      }

      // Validate password
      await this.validatePassword(user, password);

      // Remove password from response
      user.password = undefined;

      // Generate token with version
      const token = this.generateToken(user._id, user.tokenVersion);

      return { user, token };
    } catch (error) {
      throw error;
    }
  }

  static async updateUser(userId, updates) {
    // Don't allow password updates through this method
    delete updates.password;
    delete updates.role;
    delete updates.email; // Email updates should be handled separately with verification

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updates },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new AppError('User not found', 404);
    }

    return user;
  }

  static async changePassword(userId, currentPassword, newPassword) {
    // Find user with password
    const user = await User.findById(userId).select('+password');
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Validate current password
    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      throw new AppError('Current password is incorrect', 401);
    }

    // Update password
    user.password = newPassword;
    await user.save();

    // Generate new token with incremented version
    user.tokenVersion += 1;
    await user.save();

    const token = this.generateToken(user._id, user.tokenVersion);

    // Remove password from response
    user.password = undefined;

    return { user, token };
  }

  static async invalidateTokens(userId) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Increment token version to invalidate all existing tokens
    user.tokenVersion += 1;
    await user.save();
  }

  static async login(email, password) {
    const user = await this.findUserByEmail(email);
    await this.validatePassword(user, password);
    
    const token = this.generateToken(user._id, user.tokenVersion);
    user.password = undefined;
    
    return { user, token };
  }

  static verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      throw new AppError('Invalid or expired token');
    }
  }

  static async refreshToken(userId) {
    const user = await this.findUserById(userId);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    return this.generateToken(user._id, user.tokenVersion);
  }
}

module.exports = AuthService;
