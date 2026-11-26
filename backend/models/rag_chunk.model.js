import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const RagChunk = sequelize.define('RagChunk', {
    id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
    uuid: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4 },
    createdAt: { field: 'created_at', type: DataTypes.DATE, defaultValue: DataTypes.NOW, allowNull: false },
    documentId: { field: 'document_id', type: DataTypes.BIGINT, allowNull: false },
    index: { field: 'index', type: DataTypes.INTEGER, allowNull: false },
    content: { field: 'content', type: DataTypes.TEXT, allowNull: false },
    embedding: { field: 'embedding', type: DataTypes.JSON, allowNull: false },
    metadata: { field: 'metadata', type: DataTypes.JSON, allowNull: false },
  }, {
    tableName: 'rag_chunks',
    schema: 'ia_desk',
    timestamps: false,
  });

  RagChunk.associate = (models) => {
    RagChunk.belongsTo(models.RagDocument, {
      foreignKey: 'documentId',
      as: 'document',
    });
  };

  return RagChunk;
};