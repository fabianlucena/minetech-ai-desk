import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Device = sequelize.define('Device', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    token: { type: DataTypes.STRING, allowNull: false, unique: true },
  }, {
    tableName: 'devices',
    schema: 'auth',
    timestamps: false,
  });

  return Device;
};