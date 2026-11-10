import { useState, useRef } from 'react';
import { Paper, Box, Typography, Button } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';

function sizeInMB(size) {
  if (size < 1000)
    return size + ' B';

  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(size) / Math.log(1000));
  return (size / Math.pow(1000, i)).toFixed(2) + ' ' + units[i];
}

export default function FileUploadField({
  onFileSelect
}) {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      setFile(selectedFile);
      if (onFileSelect) onFileSelect(selectedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    handleFile(droppedFile);
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    handleFile(selectedFile);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    setFile(null);
    if (inputRef.current) inputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return <Paper
    elevation={0}
    onClick={handleClick}
    onDragOver={handleDragOver}
    onDragLeave={handleDragLeave}
    onDrop={handleDrop}
    sx={{
      border: '2px dashed',
      borderColor: isDragging ? 'primary.main' : 'grey.400',
      borderRadius: 3,
      p: 4,
      textAlign: 'center',
      bgcolor: isDragging ? 'action.hover' : 'background.default',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      '&:hover': {
        borderColor: 'primary.main',
        bgcolor: 'action.hover',
      },
    }}
  >
    <input
      type="file"
      ref={inputRef}
      onChange={handleInputChange}
      style={{ display: 'none' }}
    />

    {file ? (
      <Box display="flex" gap={1}>
        <Typography variant="subtitle1" fontWeight="medium" color="text.primary">
          {file.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {sizeInMB(file.size)}
        </Typography>
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={handleRemove}
          sx={{ mt: 1 }}
        >
          Quitar archivo
        </Button>
      </Box>
    ) : (
      <Box display="flex" gap={1.5}>
        <CloudUploadIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
        <Typography variant="body1" color="text.secondary">
          Arrastra y suelta tu archivo aquí
        </Typography>
        <Typography variant="body2" color="text.disabled">
          o
        </Typography>
        <Button
          variant="contained"
          component="span"
          size="small"
          sx={{ pointerEvents: 'none' }} // Deja que el click global del Paper maneje la apertura
        >
          Seleccionar archivo
        </Button>
      </Box>
    )}
  </Paper>;
}