import sequelize from 'sequelize';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('User', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    displayName: { field: 'display_name', type: DataTypes.STRING, allowNull: false },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true },
    canLogin: { field: 'can_login', type: DataTypes.BOOLEAN, defaultValue: true },
    lastLoginAt: { field: 'last_login_at', type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'users',
    schema: 'auth',
    timestamps: false,
  });
};