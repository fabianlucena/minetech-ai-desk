import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Setting = sequelize.define('Setting', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    key: { field: 'key', type: DataTypes.STRING, allowNull: false, unique: true },
    value: { field: 'value', type: DataTypes.JSONB, allowNull: false },
    description: { field: 'description', type: DataTypes.STRING, allowNull: true },
  }, {
    tableName: 'settings',
    schema: 'ia_desk',
    timestamps: false,
  });

  Setting.associate = (models) => {
    Setting.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Setting.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Setting.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return Setting;
};