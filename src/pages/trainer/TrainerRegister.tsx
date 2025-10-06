// TrainerRegister.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Button,
  Stepper,
  Step,
  StepLabel,
  TextField,
  Typography,
  IconButton,
  MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { register } from "../../services/authService";

const steps = ["Hesap bilgileri", "Kişisel bilgiler", "Ekstra bilgiler"];

export default function TrainerRegisterPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    email: "",
    username: "",
    password: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    experience: "",
    awards: "",
    profileImage: null,
  });
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
      setProfilePreview(URL.createObjectURL(files[0]));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      handleSubmit();
    } else {
      setActiveStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      const fd = new FormData();
      Object.keys(formData).forEach((key) => {
        fd.append(key, formData[key]);
      });

      await register("Trainer", fd);

      alert("Kayıt başarılı! Login sayfasına yönlendiriliyorsunuz.");
      navigate("/trainer/login");
    } catch (err: any) {
      alert(err.response?.data || "Kayıt başarısız!");
    }
  };

  const removeProfilePhoto = () => {
    setProfilePreview(null);
    setFormData({ ...formData, profileImage: null });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
         <Typography
          variant="h4"
          className="text-primary"
          sx={{ fontWeight: 700, mb: 4, textAlign: "center" }}
        >
          PT kayıt
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    "&.Mui-active": { color: "#828af4ff" },
                    "&.Mui-completed": { color: "#828af4ff" },
                    "&.MuiStepIcon-root": { color: "#828af4ff" },
                  },
                }}
                sx={{
                  "& .MuiStepLabel-label": {
                    color: "#828af4ff",
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
          <Box>
            <TextField fullWidth label="Email" name="email" margin="normal" value={formData.email} onChange={handleChange} />
            <TextField fullWidth label="Kullanıcı adı" name="username" margin="normal" value={formData.username} onChange={handleChange} />
            <TextField fullWidth type="Password" label="Şifre" name="password" margin="normal" value={formData.password} onChange={handleChange} />
          </Box>
        )}

        {activeStep === 1 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="İsim" name="firstName" margin="normal" value={formData.firstName} onChange={handleChange} />
            <TextField label="Soyisim" name="lastName" margin="normal" value={formData.lastName} onChange={handleChange} />
            <TextField label="Yaş" type="number" name="age" margin="normal" value={formData.age} onChange={handleChange} />
           
            <TextField
      select
      label="Cinsiyet"
      name="gender" margin="normal"
      value={formData.gender} onChange={handleChange}
    >
      <MenuItem value="erkek">Erkek</MenuItem>
      <MenuItem value="kadın">Kadın</MenuItem>
    </TextField>
           
          </Box>
        )}

        {activeStep === 2 && (
          <Box className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField label="Tecrübe" name="experience" margin="normal" value={formData.experience} onChange={handleChange} />
            <TextField label="Ödüller" name="awards" margin="normal" value={formData.awards} onChange={handleChange} />

            {/* Profil fotoğrafı */}
            <Box className="mt-2">
              <Button variant="outlined" component="label">
                Profil Resmi Yükle
                <input type="file" name="profileImage" hidden onChange={handleChange} />
              </Button>
              {profilePreview && (
                <Box className="relative mt-2 inline-block">
                  <img src={profilePreview} alt="Profile Preview" className="w-[120px] h-[120px] rounded-lg object-cover" />
                  <IconButton size="small" className="absolute top-[-8px] right-[-8px] bg-white" onClick={removeProfilePhoto}>
                    <CloseIcon fontSize="small" className="text-red-500" />
                  </IconButton>
                </Box>
              )}
            </Box>
          </Box>
        )}

        {/* Buttons */}
        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button sx={{color: "#828af4ff"}} disabled={activeStep === 0} onClick={handleBack}>
            Geri
          </Button>
          <Button variant="contained" sx={{ bgcolor: "var(--primary)", "&:hover": { bgcolor: "#dc2626" } }} onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Kayıt ol" : "İleri"}
          </Button>
        </Box>

        {/* Go to Login sağ altta */}
        <Box className="flex justify-end mt-2">
          <Button sx={{color: "#828af4ff"}} className=" normal-case" onClick={() => navigate("/trainer/login")}>
            Hesabın var mı?
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
