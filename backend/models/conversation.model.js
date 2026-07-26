import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const Conversation = sequelize.define('Conversation', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    requesterId: { field: 'requester_id', type: DataTypes.BIGINT, allowNull: false },
    clientId: { field: 'client_id', type: DataTypes.BIGINT, allowNull: true },
    lastMessageAt: { field: 'last_message_at', type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'conversations',
    schema: 'ia_desk',
    timestamps: false,
  });

  Conversation.associate = (models) => {
    Conversation.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Conversation.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Conversation.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Conversation.belongsTo(models.Requester, {
      foreignKey: 'requesterId',
      as: 'requester',
    });

    Conversation.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });
  };

  return Conversation;
};