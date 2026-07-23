import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const UserPassword = sequelize.define('UserPassword', {
    id: { field: 'id', type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    passwordHash: { field: 'password_hash', type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'user_passwords',
    schema: 'auth',
    timestamps: false,
  });

  UserPassword.associate = (models) => {
    UserPassword.belongsTo(models.User, {
      foreignKey: 'id',
      as: 'user',
    });

    UserPassword.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    UserPassword.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    UserPassword.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  }

  return UserPassword;
};