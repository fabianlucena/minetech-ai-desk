import sequelize, { DataTypes } from 'sequelize';
import { companyStatusValues } from '../categories/company_status.js';

export default (sequelize) => {
  const Company = sequelize.define('Company', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    name: { type: DataTypes.STRING, allowNull: false, unique: true },
    clientCode: { type: DataTypes.STRING, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true },
    status: { type: DataTypes.ENUM(...companyStatusValues), allowNull: false },
  }, {
    tableName: 'companies',
    schema: 'ia_desk',
    timestamps: false,
  });

  Company.associate = (models) => {
    Company.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Company.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Company.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return Company;
};