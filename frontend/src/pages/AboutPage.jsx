import { Container, Box, Typography, Divider, Paper } from "@mui/material";

export default function AboutPage() {
  return <Container sx={{ py: 4 }}>
    <Paper elevation={0} sx={{ p: 4 }}>
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Acerca del Sistema de Gestión Unificada de Consultas Inteligentes
      </Typography>

      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        Plataforma de soporte técnico centralizada y asistida por IA, diseñada para MineTech y sus clientes.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Visión General */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Visión General
      </Typography>
      <Typography paragraph>
        El Sistema de <strong>Gestión Unificada de Consultas Inteligentes</strong> centraliza, automatiza y
        profesionaliza la atención de soporte técnico en MineTech. Evita la comunicación directa entre clientes
        y técnicos fuera de horario, mejora la calidad del servicio y garantiza trazabilidad completa de cada interacción.
      </Typography>
      <Typography paragraph>
        La plataforma unifica todos los canales en un único punto de entrada, aplica inteligencia artificial para
        resolver consultas simples y deriva automáticamente aquellas que requieren intervención humana.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* Propósito */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Propósito del Sistema
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>Centralizar todas las consultas en un único número oficial de WhatsApp.</li>
        <li>Automatizar respuestas mediante IA cuando sea posible.</li>
        <li>Derivar inteligentemente las consultas al operador de turno.</li>
        <li>Registrar y auditar cada interacción.</li>
        <li>Proteger al personal técnico evitando su exposición fuera de horario.</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Cómo funciona */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Cómo Funciona
      </Typography>

      <Typography variant="h6" fontWeight={500} gutterBottom>
        1. Punto único de entrada
      </Typography>
      <Typography paragraph>
        Todos los clientes y operadores de campo se comunican a través de un único número de WhatsApp Business API,
        eliminando el contacto directo con los técnicos.
      </Typography>

      <Typography variant="h6" fontWeight={500} gutterBottom>
        2. Validación del cliente
      </Typography>
      <Typography paragraph>El sistema verifica automáticamente:</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>Identidad del cliente.</li>
        <li>Estado del servicio.</li>
        <li>Datos del dispositivo y horario.</li>
      </Box>

      <Typography variant="h6" fontWeight={500} gutterBottom>
        3. Motor de IA y base de conocimiento
      </Typography>
      <Typography paragraph>
        Utiliza documentación interna y modelos de IA para analizar la intención, buscar respuestas y resolver
        automáticamente cuando la confianza es alta.
      </Typography>

      <Typography variant="h6" fontWeight={500} gutterBottom>
        4. Derivación transparente al operador
      </Typography>
      <Typography paragraph>
        El sistema identifica quién está de turno y envía la consulta por el canal interno correspondiente.
      </Typography>

      <Typography variant="h6" fontWeight={500} gutterBottom>
        5. Auditoría completa
      </Typography>
      <Typography paragraph>
        Cada interacción queda registrada para métricas reales y mejora continua.
      </Typography>

      <Box
        sx={{
          bgcolor: "primary.light",
          color: "primary.contrastText",
          p: 2,
          borderRadius: 2,
          my: 3,
        }}
      >
        <Typography>
          <strong>Resultado:</strong> soporte técnico ordenado, medible y escalable, con una experiencia profesional
          para el cliente y protección para el equipo técnico.
        </Typography>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Beneficios */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Beneficios para la Empresa
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>Reducción del 40–60% de la carga operativa.</li>
        <li>Eliminación del contacto directo entre clientes y técnicos.</li>
        <li>Respuestas más rápidas y consistentes.</li>
        <li>Auditoría completa para control interno.</li>
        <li>Sistema escalable y moderno.</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Tecnologías */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Tecnologías Utilizadas
      </Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>WhatsApp Business API (Meta Cloud API)</li>
        <li>Node.js + n8n</li>
        <li>PostgreSQL</li>
        <li>Qdrant / ChromaDB</li>
        <li>Modelos de IA (GPT-40 mini, Claude, Llama 3)</li>
        <li>React + Material UI</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Arquitectura */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Arquitectura del Sistema
      </Typography>
      <Typography paragraph>El sistema combina:</Typography>
      <Box component="ul" sx={{ pl: 3 }}>
        <li>Backend inteligente.</li>
        <li>Motor de IA.</li>
        <li>Panel web para operadores.</li>
        <li>Base de datos robusta.</li>
        <li>Vector DB para búsqueda semántica.</li>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* Objetivo */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Objetivo Final
      </Typography>
      <Typography paragraph>
        Brindar un soporte técnico moderno, eficiente y escalable, garantizando calidad de servicio y protección del personal técnico.
      </Typography>

      <Divider sx={{ my: 3 }} />

      {/* MineTech */}
      <Typography variant="h5" fontWeight={600} gutterBottom>
        Sobre MineTech
      </Typography>
      <Typography paragraph>
        MineTech es una empresa dedicada a soluciones tecnológicas para la seguridad industrial. Este sistema
        representa su compromiso con la innovación y la excelencia en la atención al cliente.
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 4 }}>
        <a href="https://www.minetech.com" target="_blank" rel="noopener noreferrer">© MineTech — Sistema de Gestión Unificada de Consultas Inteligentes.</a>
      </Typography>

      <Divider sx={{ my: 3 }} />

      <Typography variant="h5" fontWeight={600} gutterBottom>
        Desarrollo
      </Typography>
      <Typography paragraph>
        Desarrollado por <a href="mailto:fabian@minetech.com">Ing. Fabian Lucena</a> por cuenta y orden de MineTech.
      </Typography>
    </Paper>
  </Container>;
}