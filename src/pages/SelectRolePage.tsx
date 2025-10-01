import { Box, Grid, Typography } from "@mui/material";
import { Link } from "react-router-dom";

export default function SelectRolePage() {
  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Üstte ortalanmış FitCoach yazısı */}
      <Typography
      className="text-primary"
        variant="h3"
        sx={{
          position: "absolute",
          top: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontWeight: "bold",
          zIndex: 10,
        }}
      >
        FITCOACH
      </Typography>

      <Grid container sx={{ minHeight: "100vh" }}>
        {/* Trainer */}
        <Grid size={{xs:12, md:6}} sx={{ pl: 2 }}>
          <Box
            component={Link}
            to="/trainer/login"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundImage: "url(/images/tralog.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              textDecoration: "none",
              overflow: "hidden",
              // borderRadius: 2,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(2px)",
                transition: "all 0.3s ease",
              },
              "&:hover": {
                transform: "scale(1.05)",
              },
              transition: "transform 0.3s ease",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "primary.main",
                fontWeight: "bold",
                zIndex: 1,
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              PT Girişi
            </Typography>
          </Box>
        </Grid>

        {/* Student */}
        <Grid size={{xs:12, md:6}} sx={{ pr: 2 }}>
          <Box
            component={Link}
            to="/student/login"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              backgroundImage: "url(/images/fitlog.jpg)",
              backgroundSize: "cover",
              backgroundPosition: "center",
              position: "relative",
              textDecoration: "none",
              overflow: "hidden",
              // borderRadius: 2,
              "&::after": {
                content: '""',
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                bgcolor: "rgba(0,0,0,0.4)",
                backdropFilter: "blur(2px)",
                transition: "all 0.3s ease",
              },
              "&:hover": {
                transform: "scale(1.05)",
              },
              transition: "transform 0.3s ease",
            }}
          >
            <Typography
              variant="h3"
              sx={{
                color: "secondary.main",
                fontWeight: "bold",
                zIndex: 1,
                textAlign: "center",
                transition: "all 0.3s ease",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Öğrenci Girişi
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
