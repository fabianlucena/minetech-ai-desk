import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const PermissionXRole = sequelize.define('PermissionXRole', {
    permissionId: { field: 'permission_id', type: DataTypes.BIGINT, primaryKey: true },
    roleId: { field: 'role_id', type: DataTypes.BIGINT, primaryKey: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
  }, {
    tableName: 'permissions_x_roles',
    schema: 'auth',
    timestamps: false,
  });

  PermissionXRole.associate = (models) => {
    PermissionXRole.belongsTo(models.Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });

    PermissionXRole.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    PermissionXRole.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    PermissionXRole.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return PermissionXRole;
};