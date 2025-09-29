import { Button, Container, Typography, Stack } from "@mui/material";
import { Link } from "react-router-dom";

export default function SelectRolePage() {
  return (
    <Container maxWidth="sm" sx={{ textAlign: "center", mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Fitback App
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        Rolünü seç ve giriş yap
      </Typography>
      <Stack spacing={2} mt={4}>
        <Button
          component={Link}
          to="/student/login"
          variant="contained"
          color="primary"
        >
          Student
        </Button>
        <Button
          component={Link}
          to="/trainer/login"
          variant="contained"
          color="secondary"
        >
          Trainer
        </Button>
      </Stack>
    </Container>
  );
}
