import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Technician = sequelize.define('Technician', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    fullName: { type: DataTypes.STRING, allowNull: false, unique: true },
    phone: { type: DataTypes.STRING, allowNull: false },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'technicians',
    schema: 'desk',
    timestamps: false,
  });

  Technician.associate = (models) => {
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

    Technician.hasMany(models.Turn, {
      foreignKey: 'technicianId',
      as: 'turns',
    });

    Technician.hasMany(models.Ticket, {
      foreignKey: 'technicianId',
      as: 'tickets',
    });
  };

  return Technician;
};