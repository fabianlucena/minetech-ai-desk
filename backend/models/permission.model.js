import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Permission = sequelize.define('Permission', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'permissions',
    schema: 'auth',
    timestamps: false,
  });

  Permission.associate = (models) => {
    Permission.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Permission.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Permission.belongsToMany(models.Role, {
      as: 'roles',
      through: models.PermissionXRole,
      foreignKey: 'permissionId',
      otherKey: 'roleId'
    });
  };

  return Permission;
};