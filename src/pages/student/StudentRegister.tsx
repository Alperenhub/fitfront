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

const steps = ["Account Info", "Personal Info", "Body Measurements", "Photos"];

export default function StudentRegister() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<any>({
    OtherPhotos: [],
  });
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

  // Fotoğraf silme
  const removePhoto = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      OtherPhotos: prev.OtherPhotos.filter(
        (_: File, i: number) => i !== index
      ),
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
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Step Content */}
        {activeStep === 0 && (
          <Stack spacing={2}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              onChange={(e) => updateField("Email", e.target.value)}
            />
            <TextField
              label="Username"
              fullWidth
              onChange={(e) => updateField("Username", e.target.value)}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              onChange={(e) => updateField("Password", e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 1 && (
          <Stack spacing={2}>
            <TextField
              label="First Name"
              fullWidth
              onChange={(e) => updateField("FirstName", e.target.value)}
            />
            <TextField
              label="Last Name"
              fullWidth
              onChange={(e) => updateField("LastName", e.target.value)}
            />
            <TextField
              label="Age"
              type="number"
              fullWidth
              onChange={(e) => updateField("Age", e.target.value)}
            />
            <TextField
              label="Weight"
              type="number"
              fullWidth
              onChange={(e) => updateField("Weight", e.target.value)}
            />
            <TextField
              label="Height"
              type="number"
              fullWidth
              onChange={(e) => updateField("Height", e.target.value)}
            />
            <TextField
              label="Gender"
              fullWidth
              onChange={(e) => updateField("Gender", e.target.value)}
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              onChange={(e) => updateField("Description", e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 2 && (
          <Stack spacing={2}>
            <TextField
              label="Arm"
              type="number"
              fullWidth
              onChange={(e) => updateField("Arm", e.target.value)}
            />
            <TextField
              label="Waist"
              type="number"
              fullWidth
              onChange={(e) => updateField("Waist", e.target.value)}
            />
            <TextField
              label="Leg"
              type="number"
              fullWidth
              onChange={(e) => updateField("Leg", e.target.value)}
            />
            <TextField
              label="Shoulder"
              type="number"
              fullWidth
              onChange={(e) => updateField("Shoulder", e.target.value)}
            />
          </Stack>
        )}

        {activeStep === 3 && (
          <Stack spacing={2}>
            <Button variant="outlined" component="label">
              Upload Profile Photo
              <input
                type="file"
                hidden
                onChange={(e) =>
                  updateField("ProfilePhotoUrl", e.target.files?.[0])
                }
              />
            </Button>

            <Button variant="outlined" component="label">
              Upload Other Photos
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => {
                  const files = e.target.files;
                  if (files && files.length > 0) {
                    updateField("OtherPhotos", [
                      ...(formData.OtherPhotos || []),
                      ...Array.from(files),
                    ]);
                  }
                }}
              />
            </Button>

            {/* Önizleme */}
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
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              sx={{ bgcolor: "var(--primary)", "&:hover": { bgcolor: "#dc2626" } }}
              onClick={handleNext}
            >
              Register
            </Button>
          ) : (
            <Button
              variant="contained"
              sx={{ bgcolor: "var(--primary)", "&:hover": { bgcolor: "#dc2626" } }}
              onClick={handleNext}
            >
              Next
            </Button>
          )}
        </Box>

        <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/student/login")}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
}
