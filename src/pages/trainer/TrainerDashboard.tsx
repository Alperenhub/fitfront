import { useEffect, useState } from "react";
import {
  Button,
  Container,
  TextField,
  Typography,
  Alert,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";
import { handleLogout } from "../../functions/Logout";
import { useNavigate } from "react-router";
import { validateTrainerCode } from "../../services/trainerCodeService";
import type { ITrainerCodeResponse } from "../../Interfaces/ITrainerCode";
import api from "../../utils/api";

export default function TrainerDashboard() {
  const navigate = useNavigate();
  const logout = () => handleLogout("trainer", navigate);

  const [code, setCode] = useState("");
  const [codeData, setCodeData] = useState<ITrainerCodeResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchActiveCode = async () => {
    try {
      const res = await api.get<ITrainerCodeResponse>("/Trainer/active-code");
      if (res.data) {
        setCodeData(res.data);
        setCode(res.data.code); // input alanına da yaz
        setError(null); // eski error varsa temizle
      }
    } catch (err) {
      console.log("Henüz aktif bir kod yok.");
      setCodeData(null);
    }
  };
  fetchActiveCode();
}, []);


  const handleSubmit = async () => {
    try {
      const data = await validateTrainerCode(code);

      // expire check
      if (data.expiresAt && new Date(data.expiresAt) < new Date()) {
        setError("Kodun süresi dolmuş.");
        setCodeData(null);
        return;
      }

      // quota check
      if (data.quota <= 0) {
        setError("Kodun kotası dolmuş.");
        setCodeData(null);
        return;
      }

      setCodeData(data);
      setError(null);
    } catch (err) {
      setError("Geçersiz kod!");
      setCodeData(null);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, Trainer!
      </Typography>

      <TextField
        label="Kod girin"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        sx={{ mt: 2, mb: 2 }}
        fullWidth
      />

      <Button variant="contained" onClick={handleSubmit}>
        Kodu Doğrula
      </Button>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      {codeData && (
        <Box mt={3} mb={2}>
    <Typography variant="h6">
      Kod: {codeData.code} | Kota: {codeData.quota} | Bitiş Tarihi: {codeData.expiresAt ? new Date(codeData.expiresAt).toLocaleDateString() : "-"}
    </Typography>

          {/* Kodu kullanan öğrencileri göster */}
          <Typography variant="h6" sx={{ mb: 1 }}>
            Bu kodu kullanan öğrenciler:
          </Typography>
          {codeData.students && codeData.students.length > 0 ? (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Kullanıcı Adı</TableCell>
                  <TableCell>Ad</TableCell>
                  <TableCell>Soyad</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {codeData.students.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.id}</TableCell>
                    <TableCell>{s.username}</TableCell>
                    <TableCell>{s.firstName}</TableCell>
                    <TableCell>{s.lastName}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            
            <Typography>Henüz öğrenci yok.</Typography>
          )}
        </Box>
      )}

      <Button
        onClick={logout}
        variant="contained"
        color="error"
        sx={{ mt: 4 }}
      >
        Çıkış Yap
      </Button>
    </Container>
  );
}
