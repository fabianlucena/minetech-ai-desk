import sequelize, { DataTypes } from 'sequelize';
import { turnTypeValues } from '../categories/turn_type.js';

export default (sequelize) => {
  const Turn = sequelize.define('Turn', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    technicianId: { field: 'technician_id', type: DataTypes.BIGINT, allowNull: true },
    turnType: { field: 'turn_type', type: DataTypes.ENUM(...turnTypeValues), allowNull: true },
    startDate: { field: 'start_date', type: DataTypes.DATE, allowNull: false },
    endDate: { field: 'end_date', type: DataTypes.DATE, allowNull: false },
  }, {
    tableName: 'turns',
    schema: 'ia_desk',
    timestamps: false,
  });

  Turn.associate = (models) => {
    Turn.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Turn.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Turn.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Turn.belongsTo(models.Technician, {
      foreignKey: 'technicianId',
      as: 'technician',
    });
  };

  return Turn;
};