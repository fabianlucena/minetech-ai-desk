import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const RagDocument = sequelize.define('RagDocument', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    createdById: { field: 'created_by_id', type: DataTypes.BIGINT, allowNull: false },
    updatedAt: { field: 'updated_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    updatedById: { field: 'updated_by_id', type: DataTypes.BIGINT, allowNull: false },
    deletedAt: { field: 'deleted_at', type: DataTypes.DATE, allowNull: true },
    deletedById: { field: 'deleted_by_id', type: DataTypes.BIGINT, allowNull: true },
    isActive: { field: 'is_active', type: DataTypes.BOOLEAN, defaultValue: true },
    fileName: { field: 'file_name', type: DataTypes.STRING, allowNull: false },
    filePath: { field: 'file_path', type: DataTypes.TEXT, allowNull: false },
    mimeType: { field: 'mime_type', type: DataTypes.STRING, allowNull: false },
    fileSize: { field: 'file_size', type: DataTypes.BIGINT, allowNull: false },
    checksum: { field: 'checksum', type: DataTypes.STRING, allowNull: false },
    status: { field: 'status', type: DataTypes.STRING, allowNull: false },
  }, {
    tableName: 'rag_documents',
    schema: 'ia_desk',
    timestamps: false,
  });

  RagDocument.associate = (models) => {
    RagDocument.belongsTo(models.User, {
      foreignKey: 'createdById',
      as: 'createdBy',
    });

    RagDocument.belongsTo(models.User, {
      foreignKey: 'updatedById',
      as: 'updatedBy',
    });

    RagDocument.belongsTo(models.User, {
      foreignKey: 'deletedById',
      as: 'deletedBy',
    });
  };

  return RagDocument;
};