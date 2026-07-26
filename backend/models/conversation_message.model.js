import { DataTypes } from 'sequelize';
import { senderTypeValues } from '../categories/sender_types.js';

export default (sequelize) => {
  const ConversationMessage = sequelize.define('ConversationMessage', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    conversationId: { field: 'conversation_id', type: DataTypes.BIGINT, allowNull: false },
    senderType: { field: 'sender_type', type: DataTypes.ENUM(...senderTypeValues), allowNull: false },
    senderId: { field: 'sender_id', type: DataTypes.BIGINT, allowNull: false },
    text: { field: 'text', type: DataTypes.TEXT, allowNull: true },
    media: { field: 'media', type: DataTypes.BLOB('long'), allowNull: true },
    receiverType: { field: 'receiver_type', type: DataTypes.ENUM(...senderTypeValues), allowNull: true },
    receiverId: { field: 'receiver_id', type: DataTypes.BIGINT, allowNull: true },
    sentAt: { field: 'sent_at', type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'conversation_messages',
    schema: 'ia_desk',
    timestamps: false,
  });

  ConversationMessage.associate = (models) => {
    ConversationMessage.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    ConversationMessage.belongsTo(models.Conversation, {
      foreignKey: 'conversationId',
      as: 'conversation',
    });
  };

  return ConversationMessage;
};