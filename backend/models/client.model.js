import sequelize, { DataTypes } from 'sequelize';
import { clientStatusValues } from '../categories/client_status.js';

export default (sequelize) => {
  const Client = sequelize.define('Client', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    name: { field: 'name', type: DataTypes.STRING, allowNull: false, unique: true },
    clientCode: { field: 'client_code', type: DataTypes.STRING, allowNull: false, unique: true },
    token: { field: 'token', type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true },
    status: { field: 'status', type: DataTypes.ENUM(...clientStatusValues), allowNull: false },
  }, {
    tableName: 'clients',
    schema: 'ia_desk',
    timestamps: false,
  });

  Client.associate = (models) => {
    Client.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Client.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Client.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return Client;
};