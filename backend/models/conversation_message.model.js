import { DataTypes } from 'sequelize';
import { senderTypeValues } from '../categories/sender_types.js';

export default (sequelize) => {
  const ConversationMessage = sequelize.define('ConversationMessage', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, allowNull: true },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: true },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },

    conversationId: { field: 'conversation_id', type: DataTypes.BIGINT, allowNull: false },
    text: { field: 'text', type: DataTypes.TEXT, allowNull: true },
    media: { field: 'media', type: DataTypes.BLOB('long'), allowNull: true },
    externalMessageId: { field: 'external_message_id', type: DataTypes.STRING, allowNull: true },

    senderType: { field: 'sender_type', type: DataTypes.ENUM(...senderTypeValues), allowNull: false },
    senderId: { field: 'sender_id', type: DataTypes.BIGINT, allowNull: true },
    receiverType: { field: 'receiver_type', type: DataTypes.ENUM(...senderTypeValues), allowNull: true },
    receiverId: { field: 'receiver_id', type: DataTypes.BIGINT, allowNull: true },

    receivedAt: { field: 'received_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    sentAt: { field: 'sent_at', type: DataTypes.DATE, allowNull: true },
    deliveredAt: { field: 'delivered_at', type: DataTypes.DATE, allowNull: true },
    readAt: { field: 'read_at', type: DataTypes.DATE, allowNull: true },
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