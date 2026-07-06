import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Role = sequelize.define('Role', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    title: { type: DataTypes.STRING, allowNull: false, unique: true },
    description: { type: DataTypes.STRING, allowNull: true },
    isAsignable: { field: 'is_asignable', type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'roles',
    schema: 'auth',
    timestamps: false,
  });

  Role.associate = (models) => {
    Role.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Role.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Role.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Role.belongsToMany(models.User, {
      as: 'users',
      through: models.RoleXUser,
      foreignKey: 'roleId',
      otherKey: 'userId'
    });
  };

  return Role;
};