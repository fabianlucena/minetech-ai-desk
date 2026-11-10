import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, FileUploadField } from '../components/fields/index.jsx';
import useToast from '../contexts/useToast.jsx';
import useRagDocument from '../services/useRagDocument.jsx';

const defaultData = {
  isActive: true,
};

export default function RagDocumentPage() {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const { getRagDocument, updateRagDocument, createRagDocument } = useRagDocument();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});

  const load = useCallback(async () => {
    try {
      const res = await getRagDocument(uuid);
      const data = {
        ...defaultData,
        ...res,
        roles: res.roles.map(role => role.uuid) || [],
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el usuario');
      console.error('Error al obtener el usuario:', error);
    }
  }, [uuid, addError, getRagDocument]);

  useEffect(() => {
    function _load() { load(); }

    if (uuid)
      _load();
  }, [uuid, load]);

  async function onSubmit() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateRagDocument(uuid, {
          fileName: data.fileName,
        });
        addInfo('Documento actualizado correctamente');
      } else {
        await createRagDocument(data);
        addInfo('Documento creado correctamente');
      }

      navigate(-1);
    } catch (error) {
      if (uuid) {
        console.error('Error al actualizar documento:', error);
        addError('Error al actualizar documento: ' + (error.data?.message || error.message || error.data?.error));
      } else {
        console.error('Error al crear documento:', error);
        addError('Error al crear documento: ' + (error.data?.message || error.message || error.data?.error));
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!uuid && !data.file)
      return 'Seleccione el archivo que desea cargar';
  }

  return <Form
    disabled={disabled}
    onSubmit={onSubmit}
    onCancelGoBack={true}
    validationError={getValidationError()}
    unchangedData={JSON.stringify(data) === JSON.stringify(unchangedData)}
    {...(uuid ? {
        title: 'Modificar documento',
        description: 'Modifique los datos del documento',
        disabledMessage: 'Actualizando documento...',
      } : {
        title: 'Crear nuevo documento',
        description: 'Por favor, ingrese los datos del nuevo documento',
        disabledMessage: 'Creando documento...',
      })
    }
  >
    {uuid && <>
      <SwitchField
        label="Activo"
        disabled={disabled}
        checked={data.isActive}
        onChange={(e) => setData({...data, isActive: e.target.checked})}
      />
      <TextField
        label="Nombre"
        disabled={disabled}
        required
        autoFocus
        value={data.fileName}
        onChange={(e) => setData({...data, fileName: e.target.value})}
      />
      <TextField
        label="Ruta"
        disabled={true}
        required
        value={data.filePath}
        onChange={(e) => setData({...data, filePath: e.target.value})}
      />
      <TextField
        label="Tipo de archivo"
        disabled={true}
        required
        value={data.mimeType}
        onChange={(e) => setData({...data, mimeType: e.target.value})}
      />
      <TextField
        label="Tamaño del archivo"
        disabled={true}
        required
        value={data.fileSize}
        onChange={(e) => setData({...data, fileSize: e.target.value})}
      />
      <TextField
        label="Checksum"
        disabled={true}
        required
        value={data.checksum}
        onChange={(e) => setData({...data, checksum: e.target.value})}
      />
      <TextField
        label="Estado"
        disabled={true}
        required
        value={data.status}
        onChange={(e) => setData({...data, status: e.target.value})}
      />
    </> || <>
      <FileUploadField
        onFileSelect={(file) => setData({...data, file})}
      />
    </>}
  </Form>;
}
