import { DataTypes } from 'sequelize';
import { requesterTypeValues } from '../categories/requester_types.js';

export default (sequelize) => {
  const Requester = sequelize.define('Requester', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    clientId: { field: 'client_id', type: DataTypes.BIGINT, allowNull: true },
    displayName: { field: 'display_name', type: DataTypes.STRING, allowNull: true },
    phone: { field: 'phone', type: DataTypes.STRING, allowNull: false, unique: true },
    email: { field: 'email', type: DataTypes.STRING, allowNull: true },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, allowNull: true, defaultValue: true },
    type: { field: 'type', type: DataTypes.ENUM(...requesterTypeValues), allowNull: false },
  }, {
    tableName: 'requesters',
    schema: 'ia_desk',
    timestamps: false,
  });

  Requester.associate = (models) => {
    Requester.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Requester.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Requester.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Requester.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });
  };

  return Requester;
};