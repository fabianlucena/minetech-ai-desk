import sequelize, { DataTypes } from 'sequelize';
import { ticketStatusValues } from '../categories/ticket_status.js';

export default (sequelize) => {
  const Ticket = sequelize.define('Ticket', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    clientId: { field: 'client_id', type: DataTypes.BIGINT, allowNull: false },
    requesterId: { field: 'requester_id', type: DataTypes.BIGINT, allowNull: false },
    technicianId: { field: 'technician_id', type: DataTypes.BIGINT, allowNull: true },
    turnId: { field: 'turn_id', type: DataTypes.BIGINT, allowNull: true },
    status: { field: 'status', type: DataTypes.ENUM(...ticketStatusValues), allowNull: false },
    parentTicketId: { field: 'parent_ticket_id', type: DataTypes.BIGINT, allowNull: true },
    resolvedAt: { field: 'resolved_at', type: DataTypes.DATE, allowNull: true },
  }, {
    tableName: 'tickets',
    schema: 'ia_desk',
    timestamps: false,
  });

  Ticket.associate = (models) => {
    Ticket.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    Ticket.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    Ticket.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });

    Ticket.belongsTo(models.Client, {
      foreignKey: 'clientId',
      as: 'client',
    });

    Ticket.belongsTo(models.Requester, {
      foreignKey: 'requesterId',
      as: 'requester',
    });

    Ticket.belongsTo(models.Technician, {
      foreignKey: 'technicianId',
      as: 'technician',
    });

    Ticket.belongsTo(models.Turn, {
      foreignKey: 'turnId',
      as: 'turn',
    });

    Ticket.belongsTo(models.Ticket, {
      foreignKey: 'parentTicketId',
      as: 'parentTicket',
    });
  };

  return Ticket;
};