import sequelize from 'sequelize';

import { DataTypes } from 'sequelize';

export default (sequelize) => {
  return sequelize.define('RoleXInclude', {
    roleId: { field: 'role_id', type: DataTypes.BIGINT, primaryKey: true },
    includeId: { field: 'include_id', type: DataTypes.BIGINT, primaryKey: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
  }, {
    tableName: 'roles_includes',
    schema: 'auth',
    timestamps: false,
  });
};