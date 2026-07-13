import sequelize, { DataTypes } from 'sequelize';
import { shiftTypeValues } from '../categories/shift_types.js';

export default (sequelize) => {
  const Shift = sequelize.define('Shift', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    technicianId: { field: 'technician_id', type: DataTypes.BIGINT, allowNull: true },
    type: { field: 'type', type: DataTypes.ENUM(...shiftTypeValues), allowNull: true },
    start: { field: 'start', type: DataTypes.DATE, allowNull: false },
    end: { field: 'end', type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'shifts',
    schema: 'ia_desk',
    timestamps: false,
  });

  Shift.associate = (models) => {
    Shift.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Shift.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Shift.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Shift.belongsTo(models.Technician, {
      foreignKey: 'technicianId',
      as: 'technician',
    });
  };

  return Shift;
};