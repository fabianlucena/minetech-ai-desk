import sequelize, { DataTypes } from 'sequelize';
import { senderTypeValues } from '../categories/sender_types.js';

export default (sequelize) => {
  const TicketMessage = sequelize.define('TicketMessage', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    ticketId: { field: 'ticket_id', type: DataTypes.BIGINT, allowNull: false },
    senderType: { field: 'sender_type', type: DataTypes.ENUM(...senderTypeValues), allowNull: false },
    senderId: { field: 'sender_id', type: DataTypes.BIGINT, allowNull: false },
    message: { field: 'message', type: DataTypes.TEXT, allowNull: false },
  }, {
    tableName: 'ticket_messages',
    schema: 'ia_desk',
    timestamps: false,
  });

  TicketMessage.associate = (models) => {
    TicketMessage.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    TicketMessage.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    TicketMessage.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    TicketMessage.belongsTo(models.Ticket, {
      foreignKey: 'ticketId',
      as: 'ticket',
    });
  };

  return TicketMessage;
};