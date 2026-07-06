import sequelize, { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Session = sequelize.define('Session', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    authorizationToken: { field: 'authorization_token', type: DataTypes.STRING, allowNull: false, unique: true },
    expiresAt: { field: 'expires_at', type: DataTypes.DATE, allowNull: false },
    autoLoginToken: { field: 'auto_login_token', type: DataTypes.STRING, allowNull: false, unique: true },
    lastUsedAt: { field: 'last_used_at', type: DataTypes.DATE, allowNull: false },
    closedAt: { field: 'closed_at', type: DataTypes.DATE, allowNull: true },
    userId: { field: 'user_id', type: DataTypes.BIGINT, allowNull: false },
    deviceId: { field: 'device_id', type: DataTypes.BIGINT, allowNull: false },
    dataJson: { field: 'data_json', type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'sessions',
    schema: 'auth',
    timestamps: false,
  });

  Session.associate = (models) => {
    Session.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Session.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user',
    });

    Session.belongsTo(models.Device, {
      foreignKey: 'deviceId',
      as: 'device',
    });
  }

  return Session;
};