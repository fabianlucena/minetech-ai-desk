import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Form from '../components/Form.jsx';
import { TextField, SwitchField, FileUploadField } from '../components/fields/index.jsx';
import useToast from '../contexts/useToast.jsx';
import useRagDocument from '../services/useRagDocument.jsx';
import Button from '../components/buttons/SecondaryButton.jsx';
import usePermissions from '../contexts/usePermissions';
import { DownloadIcon } from '../components/icons/index.jsx';

const defaultData = {
  isActive: true,
};

export default function RagDocumentPage({
  edit = false,
}) {
  const navigate = useNavigate();
  const { uuid } = useParams();
  const { addInfo, addError } = useToast();
  const { getRagDocument, updateRagDocument, createRagDocument, getRagDocumentsStatus, downloadRagDocument } = useRagDocument();
  const [disabled, setDisabled] = useState(false);
  const [data, setData] = useState({...defaultData});
  const [unchangedData, setUnchangedData] = useState({...defaultData});
  const readOnly = !edit && !!uuid;
  const [status, setStatus] = useState([]);
  const { hasPermission } = usePermissions();

  const getStatusNameByValue = useCallback((value) => {
    return status?.find(s => s.value === value)?.name ?? value;
  }, [status]);

  const getStatusColorByValue = useCallback((value) => {
    return status?.find(s => s.value === value)?.color ?? 'red';
  }, [status]);

  const loadStatus = useCallback(async () => {
    try {
      setStatus(await getRagDocumentsStatus());
    } catch (error) {
      addError('Error al obtener los estados de los documentos');
      console.error('Error al obtener los estados de los documentos:', error);
    }
  }, [getRagDocumentsStatus, addError]);  

  const load = useCallback(async () => {
    try {
      const res = await getRagDocument(uuid, { query: { includeChunksCount: 1 }});
      const data = {
        ...defaultData,
        ...res,
      };
      setData(data);
      setUnchangedData(data);
    } catch (error) {
      addError('Error al obtener el documento: ' + (error.data?.message || error.data?.error || error.message));
      console.error('Error al obtener el documento:', error);
    }
  }, [uuid, addError, getRagDocument]);

  useEffect(() => {
    function _load() {
      loadStatus();
      load();
    }

    if (uuid)
      _load();
  }, [uuid, load, loadStatus]);

  async function onSubmit() {
    setDisabled(true);
    try {
      if (uuid) {
        await updateRagDocument(uuid, {
          isActive: data.isActive,
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
        addError('Error al actualizar documento: ' + (error.data?.message || error.data?.error || error.message));
      } else {
        console.error('Error al crear documento:', error);
        addError('Error al crear documento: ' + (error.data?.message || error.data?.error || error.message ));
      }
    }
    setDisabled(false);
  }

  function getValidationError() {
    if (!uuid && !data.file)
      return 'Seleccione el archivo que desea cargar';
  }

  const downloadRagDocumentHandler = useCallback(async (item) => {
    if (!item?.uuid) {
      addError('No se proporcionó un UUID válido para descargar el documento');
      return;
    }
    
    try {
      await downloadRagDocument(item.uuid, { fileName: item.fileName });
    } catch (error) {
      addError('Error al descargar el documento');
      console.error('Error al descargar el documento:', error);
    }
  }, [addError, downloadRagDocument]);

  return <Form
    disabled={disabled}
    onSubmit={edit && onSubmit}
    onCancelGoBack={true}
    validationError={getValidationError()}
    unchangedData={JSON.stringify(data) === JSON.stringify(unchangedData)}
    footer={hasPermission('ragDocuments.download') && uuid &&<Button
      secondary onClick={() => downloadRagDocumentHandler(data)}
    >
      <DownloadIcon color="primary" />
      Descargar documento
    </Button>}
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
        readOnly={readOnly}
        checked={data.isActive}
        onChange={(e) => setData({...data, isActive: e.target.checked})}
      />
      <TextField
        label="Nombre"
        disabled={disabled}
        readOnly
        required
        autoFocus
        value={data.fileName}
        onChange={(e) => setData({...data, fileName: e.target.value})}
      />
      <TextField
        label="Tipo de archivo"
        readOnly
        disabled={disabled}
        value={data.mimeType}
        defaultValue="N/A"
      />
      <TextField
        label="Tamaño del archivo"
        readOnly
        disabled={disabled}
        value={data.fileSize}
      />
      <TextField
        label="Checksum"
        readOnly
        disabled={disabled}
        value={data.checksum}
      />
      <TextField
        label="Estado"
        readOnly
        disabled={disabled}
        value={getStatusNameByValue(data.status) || 'Desconocido'}
        color={getStatusColorByValue(data.status) || 'red'}
      />
      <TextField
        label="Fragmentos"
        readOnly
        disabled={disabled}
        value={data.chunksCount}
      />
    </> || <>
      <FileUploadField
        onFileSelect={(file) => setData({...data, file})}
      />
    </>}
  </Form>;
}
