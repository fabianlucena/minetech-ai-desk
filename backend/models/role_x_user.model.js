import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const RoleXUser = sequelize.define('RoleXUser', {
    roleId: { field: 'role_id', type: DataTypes.BIGINT, primaryKey: true },
    userId: { field: 'user_id', type: DataTypes.BIGINT, primaryKey: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
  }, {
    tableName: 'roles_x_users',
    schema: 'auth',
    timestamps: false,
  });

  RoleXUser.associate = (models) => {
    RoleXUser.belongsTo(models.Role, {
      foreignKey: 'roleId',
      as: 'role',
    });

    RoleXUser.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    RoleXUser.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    RoleXUser.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    RoleXUser.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return RoleXUser;
};