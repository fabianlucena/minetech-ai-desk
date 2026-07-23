import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Technician = sequelize.define('Technician', {
    id: { field: 'id', type: DataTypes.BIGINT, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    phone: { field: 'phone', type: DataTypes.STRING, allowNull: false, unique: true },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true },
    color: { field: 'color', type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'technicians',
    schema: 'ia_desk',
    timestamps: false,
  });

  Technician.associate = (models) => {
    Technician.belongsTo(models.User, {
      foreignKey: 'id',
      as: 'user',
    });

    Technician.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Technician.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Technician.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Technician.hasMany(models.Shift, {
      foreignKey: 'technicianId',
      as: 'shifts',
    });

    Technician.hasMany(models.Ticket, {
      foreignKey: 'technicianId',
      as: 'tickets',
    });
  };

  return Technician;
};