import { Container, Box, Typography, Button, Paper } from "@mui/material";

export default function HomePage() {
  return <Container sx={{ py: 6 }}>
    <Paper elevation={0} sx={{ p: 4, textAlign: "center" }}>
      
      {/* HERO */}
      <Typography variant="h3" fontWeight={700} gutterBottom>
        Bienvenido al Sistema de Consultas Inteligentes de MineTech
      </Typography>

      <Typography variant="h6" color="text.secondary" gutterBottom>
        Una plataforma moderna que centraliza y optimiza la atención de soporte técnico.
      </Typography>

      {/* Descripción */}
      <Typography variant="body1" sx={{ mt: 3 }}>
        Este sistema permite a MineTech brindar una experiencia de soporte más rápida,
        organizada y profesional. A través de inteligencia artificial y un flujo de
        atención centralizado, cada consulta es gestionada de manera eficiente y segura.
      </Typography>

      {/* Beneficios principales */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          ¿Qué ofrece este sistema?
        </Typography>

        <Box component="ul" sx={{ pl: 3, textAlign: "left", maxWidth: 600, margin: "0 auto" }}>
          <li>Atención centralizada mediante WhatsApp.</li>
          <li>Respuestas rápidas y consistentes.</li>
          <li>Derivación automática al operador de turno.</li>
          <li>Auditoría completa de todas las interacciones.</li>
          <li>Mayor seguridad y profesionalismo en la comunicación.</li>
        </Box>
      </Box>

      {/* Botón principal */}
      <Box
        sx={{
          mt: 4,
          display: "flex",
          justifyContent: "center",
          gap: 2,
          flexWrap: "wrap"
        }}
      >
        <Button variant="contained" size="large" href="/about">
          Conocer más sobre el sistema
        </Button>
        <Button variant="contained" size="large" href="/LOGIN">
          Ingresar al sistema
        </Button>
      </Box>

      {/* Créditos */}
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 6 }}
      >
        Minetech IA Desk es propiedad de{" "} 
        <a href="https://www.minetech.com" target="_blank" rel="noopener noreferrer">
          MineTech
        </a>
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 1 }}
      >
        Desarrollado por{" "}
        <a href="mailto:fabian@minetech.com">Ing. Fabian Lucena</a> por cuenta y orden de MineTech.
      </Typography>
    </Paper>
  </Container>;
}
