// StudentRegister.tsx
import {
  Box,
  Button,
  Container,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  Stack,
  IconButton,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CloseIcon from "@mui/icons-material/Close";
import api from "../../utils/api";

const steps = ["Hesap Bilgiler", "Kişisel Bilgiler", "Vücut Ölçüleri", "Fotoğraf Ekle"];

export default function StudentRegister() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({ OtherPhotos: [], ProfilePhotoUrl: null });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "OtherPhotos" && Array.isArray(formData[key])) {
          formData[key].forEach((file: File) => fd.append("OtherPhotos", file));
        } else if (formData[key] !== undefined && formData[key] !== null) {
          fd.append(key, formData[key]);
        }
      });

      try {
        await api.post("/Student/register", fd);
        navigate("/student/login");
      } catch (err) {
        console.error(err);
        alert("Register failed");
      }
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const removeProfilePhoto = () => {
    setProfilePreview(null);
    updateField("ProfilePhotoUrl", null);
  };

  const removePhoto = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      OtherPhotos: prev.OtherPhotos.filter((_ : File, i: number) => i !== index),
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <Box>
        <Typography
          variant="h4"
          className="text-primary"
          sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
        >
          Student Register
        </Typography>

       <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
  {steps.map((label, index) => (
    <Step key={label}>
      <StepLabel
        StepIconProps={{
          sx: {
            "&.Mui-active": {
              color: "#828af4ff", // aktif adım
            },
            "&.Mui-completed": {
              color: "#828af4ff", // tamamlanmış adımlar
            },
            "&.MuiStepIcon-root": {
              color: "#828af4ff", // varsayılan renk
            },
          },
        }}
        sx={{
          "& .MuiStepLabel-label": {
            color: "#828af4ff", // label yazısı
            fontWeight: index === activeStep ? "bold" : "normal",
          },
        }}
      >
        {label}
      </StepLabel>
    </Step>
  ))}
</Stepper>




        {/* Step Content */}
        {activeStep === 0 && (
          <Stack spacing={2}>
            <TextField label="Email" type="email" fullWidth onChange={(e) => updateField("Email", e.target.value)} />
            <TextField label="Kullanıcı adı" fullWidth onChange={(e) => updateField("Username", e.target.value)} />
            <TextField label="Şifre" type="password" fullWidth onChange={(e) => updateField("Password", e.target.value)} />
          </Stack>
        )}

        {activeStep === 1 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="İsim" onChange={(e) => updateField("FirstName", e.target.value)} />
            <TextField label="Soyisim" onChange={(e) => updateField("LastName", e.target.value)} />
            <TextField label="Yaş" type="number" onChange={(e) => updateField("Age", e.target.value)} />
            <TextField label="Kilo" type="number" onChange={(e) => updateField("Weight", e.target.value)} />
            <TextField label="Boy" type="number" onChange={(e) => updateField("Height", e.target.value)} />
            <TextField label="Cinsiyet" onChange={(e) => updateField("Gender", e.target.value)} />
            <TextField label="Bir rahatsızlığın varsa yazınız..." multiline rows={3} onChange={(e) => updateField("Description", e.target.value)} />
          </Box>
        )}

        {activeStep === 2 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Kol" type="number" onChange={(e) => updateField("Arm", e.target.value)} />
            <TextField label="Bel" type="number" onChange={(e) => updateField("Waist", e.target.value)} />
            <TextField label="Bacak" type="number" onChange={(e) => updateField("Leg", e.target.value)} />
            <TextField label="Omuz" type="number" onChange={(e) => updateField("Shoulder", e.target.value)} />
          </Box>
        )}

        {activeStep === 3 && (
          <Stack spacing={2}>
            {/* Profil fotoğrafı */}
            <Button variant="outlined" component="label">
              Profil Fotoğrafı Yükleyin
              <input
                type="file"
                hidden
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    updateField("ProfilePhotoUrl", file);
                    setProfilePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </Button>
            {profilePreview && (
              <Box className="relative mt-2 inline-block">
                <img src={profilePreview} alt="Profile Preview" className="w-[120px] h-[120px] rounded-lg object-cover" />
                <IconButton size="small" className="absolute top-[-8px] right-[-8px] bg-white" onClick={removeProfilePhoto}>
                  <Typography className="text-primary">Sil</Typography>
                </IconButton>
              </Box>
            )}

            {/* Diğer fotoğraflar */}
            <Button variant="outlined" component="label">
              Fotoğraf yükleyin
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    updateField("OtherPhotos", [...(formData.OtherPhotos || []), ...Array.from(files)]);
                  }
                }}
              />
            </Button>

            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 2,
                mt: 2,
              }}
            >
              {formData.OtherPhotos &&
                formData.OtherPhotos.map((file: File, index: number) => (
                  <Box
                    key={index}
                    sx={{
                      position: "relative",
                      width: 100,
                      height: 100,
                      borderRadius: 2,
                      overflow: "hidden",
                      boxShadow: 2,
                    }}
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt="preview"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 2,
                        right: 2,
                        bgcolor: "rgba(0,0,0,0.6)",
                        color: "white",
                        "&:hover": { bgcolor: "rgba(0,0,0,0.8)" },
                      }}
                      onClick={() => removePhoto(index)}
                    >
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </Box>
                ))}
            </Box>
          </Stack>
        )}

        {/* Buttons */}
        <Box mt={4} display="flex" justifyContent="space-between">
          <Button sx={{color:"#828af4ff"}} disabled={activeStep === 0} onClick={handleBack}>
            Geri
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button variant="contained" sx={{ bgcolor: "var(--primary)", "&:hover": { bgcolor: "#dc2626" } }} onClick={handleNext}>
              Kayıt ol
            </Button>
          ) : (
            <Button variant="contained" sx={{ bgcolor: "var(--primary)", "&:hover": { bgcolor: "#dc2626" } }} onClick={handleNext}>
              İleri
            </Button>
          )}
        </Box>

        {/* Go to Login sağ altta */}
        <Box className="flex justify-end mt-2">
          <Button sx={{color:"#828af4ff"}} className=" normal-case" onClick={() => navigate("/student/login")}>
            Hesabın var mı?
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
