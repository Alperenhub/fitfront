import { useState, useEffect } from "react";
import {
  Button,
  Typography,
  Box,
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { handleLogout } from "../../functions/Logout";
import { useNavigate } from "react-router";
import api from "../../utils/api";

// TrainerCode response interface
export interface ITrainerCodeResponse {
  id: number;
  code: string;
  durationInMonths: number;
  quota: number;
  isUsed: boolean;
  createdAt: string;
  expiresAt?: string;
  trainer?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  };
  students?: {
    id: number;
    username: string;
    firstName: string;
    lastName: string;
  }[];
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const logout = () => handleLogout("admin", navigate);

  const [codes, setCodes] = useState<ITrainerCodeResponse[]>([]);
  const [duration, setDuration] = useState<number>(1);
  const [quota, setQuota] = useState<number>(1);

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [editDuration, setEditDuration] = useState<number>(1);
  const [editQuota, setEditQuota] = useState<number>(1);

  // Kodları çek
  const fetchCodes = async () => {
    try {
      const res = await api.get<ITrainerCodeResponse[]>("/TrainerCode/list");
      setCodes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  // Kod oluştur
  const generateCode = async () => {
    try {
      const res = await api.post<ITrainerCodeResponse>("/TrainerCode/generate", {
        durationInMonths: duration,
        quota,
      });
      setCodes((prev) => [...prev, res.data]);
    } catch (err) {
      console.error(err);
    }
  };

  // Kod sil
  const deleteCode = async (id: number) => {
    if (!confirm("Bu kodu silmek istediğinize emin misiniz?")) return;
    try {
      await api.delete(`/TrainerCode/delete/${id}`);
      setCodes((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Düzenleme başlat
  const startEdit = (code: ITrainerCodeResponse) => {
    setEditId(code.id);
    setEditDuration(code.durationInMonths);
    setEditQuota(code.quota);
    setEditOpen(true);
  };

  // Düzenlemeyi kaydet
  const saveEdit = async () => {
    if (!editId) return;
    try {
      const res = await api.put<ITrainerCodeResponse>(
        `/TrainerCode/update/${editId}`,
        { durationInMonths: editDuration, quota: editQuota }
      );
      setCodes((prev) =>
        prev.map((c) => (c.id === editId ? res.data : c))
      );
      setEditOpen(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box p={4}>
      <Typography variant="h2" mb={2}>
        Admin Paneli
      </Typography>

      <Button onClick={logout} variant="contained" color="error" sx={{ mb: 3 }}>
        Çıkış Yap
      </Button>

      <Box mb={4}>
        <Typography variant="h5">Yeni Kod Oluştur</Typography>
        <TextField
          type="number"
          label="Süre (Ay)"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          sx={{ mr: 2, width: 150 }}
        />
        <TextField
          type="number"
          label="Kota"
          value={quota}
          onChange={(e) => setQuota(Number(e.target.value))}
          sx={{ mr: 2, width: 150 }}
        />
        <Button variant="contained" color="primary" onClick={generateCode}>
          Oluştur
        </Button>
      </Box>

      <Box>
        <Typography variant="h5" mb={1}>
          Kod Listesi
        </Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Id</TableCell>
              <TableCell>Kod</TableCell>
              <TableCell>Süre</TableCell>
              <TableCell>Kota</TableCell>
              <TableCell>Kullanıldı mı?</TableCell>
              <TableCell>Trainer</TableCell>
              <TableCell>Öğrenciler</TableCell>
              <TableCell>Oluşturulma Tarihi</TableCell>
              <TableCell>Bitiş Tarihi</TableCell>
              <TableCell>İşlem</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {codes.map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.code}</TableCell>
                <TableCell>{c.durationInMonths}</TableCell>
                <TableCell>{c.quota}</TableCell>
                <TableCell>{c.isUsed ? "Evet" : "Hayır"}</TableCell>
                <TableCell>
                  {c.trainer ? `${c.trainer.firstName} ${c.trainer.lastName}` : "-"}
                </TableCell>
                <TableCell>
                  {c.students && c.students.length > 0
                    ? c.students.map((s) => s.username).join(", ")
                    : "-"}
                </TableCell>
                <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                <TableCell>
                  {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "-"}
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="small"
                    sx={{ mr: 1 }}
                    onClick={() => startEdit(c)}
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    size="small"
                    onClick={() => deleteCode(c.id)}
                  >
                    Sil
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={editOpen} onClose={() => setEditOpen(false)}>
        <DialogTitle>Kodu Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            label="Süre (Ay)"
            value={editDuration}
            onChange={(e) => setEditDuration(Number(e.target.value))}
            sx={{ mt: 2, mr: 2 }}
          />
          <TextField
            type="number"
            label="Kota"
            value={editQuota}
            onChange={(e) => setEditQuota(Number(e.target.value))}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Vazgeç</Button>
          <Button onClick={saveEdit} variant="contained" color="primary">
            Kaydet
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
