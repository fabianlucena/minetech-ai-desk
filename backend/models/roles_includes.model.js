import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const RoleIncludes = sequelize.define('RoleIncludes', {
    roleId: { field: 'role_id', type: DataTypes.BIGINT, primaryKey: true },
    includeId: { field: 'include_id', type: DataTypes.BIGINT, primaryKey: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
  }, {
    tableName: 'roles_includes',
    schema: 'auth',
    timestamps: false,
  });

  RoleIncludes.associate = (models) => {
    RoleIncludes.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    RoleIncludes.belongsTo(models.Role, {
      foreignKey: 'includeId',
      as: 'include',
    });

    RoleIncludes.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    RoleIncludes.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return RoleIncludes;
};