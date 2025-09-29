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
} from "@mui/material";
import { register } from "../../services/authService";

const steps = ["Account Info", "Personal Info", "Extra Info"];

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

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    const { name, value, files } = e.target;
    if (files) {
      setFormData({ ...formData, [name]: files[0] });
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

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5 }}>
        <Typography variant="h5" gutterBottom>
          Trainer Register
        </Typography>
        <Stepper activeStep={activeStep} sx={{ mb: 3 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {activeStep === 0 && (
          <Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              margin="normal"
              value={formData.email}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Username"
              name="username"
              margin="normal"
              value={formData.username}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="password"
              label="Password"
              name="password"
              margin="normal"
              value={formData.password}
              onChange={handleChange}
            />
          </Box>
        )}

        {activeStep === 1 && (
          <Box>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              margin="normal"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              margin="normal"
              value={formData.lastName}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              type="number"
              label="Age"
              name="age"
              margin="normal"
              value={formData.age}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Gender"
              name="gender"
              margin="normal"
              value={formData.gender}
              onChange={handleChange}
            />
          </Box>
        )}

        {activeStep === 2 && (
          <Box>
            <TextField
              fullWidth
              label="Experience"
              name="experience"
              margin="normal"
              value={formData.experience}
              onChange={handleChange}
            />
            <TextField
              fullWidth
              label="Awards"
              name="awards"
              margin="normal"
              value={formData.awards}
              onChange={handleChange}
            />
            <Button variant="contained" component="label" sx={{ mt: 2 }}>
              Upload Profile Image
              <input
                type="file"
                name="profileImage"
                hidden
                onChange={handleChange}
              />
            </Button>
          </Box>
        )}

        <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
          <Button disabled={activeStep === 0} onClick={handleBack}>
            Back
          </Button>
          <Button variant="contained" onClick={handleNext}>
            {activeStep === steps.length - 1 ? "Register" : "Next"}
          </Button>
        </Box>

        <Button
          fullWidth
          sx={{ mt: 2 }}
          onClick={() => navigate("/trainer/login")}
        >
          Go to Login
        </Button>
      </Box>
    </Container>
  );
}
