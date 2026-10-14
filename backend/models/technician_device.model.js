import { DataTypes } from 'sequelize';
import { senderTypeValues } from '../categories/sender_types.js';

export default (sequelize) => {
  const TechnicianDevice = sequelize.define('TechnicianDevice', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },

    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true, allowNull: false },
    technicianId: { field: 'technician_id', type: DataTypes.BIGINT, allowNull: false },
    deviceId: { field: 'device_id', type: DataTypes.STRING, allowNull: false },
    token: { field: 'token', type: DataTypes.STRING, allowNull: false },
    type: { field: 'type', type: DataTypes.ENUM(...senderTypeValues), allowNull: false },

    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: true },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, allowNull: true },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: true },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
  }, {
    tableName: 'technician_devices',
    schema: 'ia_desk',
    timestamps: false,
  });

  TechnicianDevice.associate = (models) => {
    TechnicianDevice.belongsTo(models.User, {
      foreignKey: 'technicianId',
      as: 'technician',
    });

    TechnicianDevice.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device',
    });

    TechnicianDevice.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    TechnicianDevice.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    TechnicianDevice.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return TechnicianDevice;
};