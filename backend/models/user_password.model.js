import sequelize from 'sequelize';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('UserPassword', {
    userId: { field: 'user_id', type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    passwordHash: { field: 'password_hash', type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'user_passwords',
    schema: 'auth',
    timestamps: false,
  });
};