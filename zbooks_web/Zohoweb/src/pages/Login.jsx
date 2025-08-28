import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  Link,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { Mail, PhoneIphone, Verified, ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

function maskDestination(dest = "") {
  if (!dest) return "";
  const isEmail = dest.includes("@");
  if (isEmail) {
    const [u, d] = dest.split("@");
    const maskedUser =
      u.length <= 2 ? u[0] + "*" : u.slice(0, 2) + "*".repeat(Math.max(1, u.length - 2));
    const domain = d.replace(/(^.).+(\..+$)/, (_, a, tld) => a + "***" + tld);
    return `${maskedUser}@${domain}`;
  }
  // phone
  return dest.replace(/.(?=.{2}$)/g, "*");
}

export default function Login() {
  const navigate = useNavigate();
  const { loginWithOTP } = useAuth();

  // ui state
  const [step, setStep] = useState(1); // 1 = email/mobile, 2 = otp
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  // form fields
  const [destination, setDestination] = useState("");
  const [otp, setOtp] = useState("");

  // resend timer
  const RESEND_SECONDS = 60;
  const [secondsLeft, setSecondsLeft] = useState(RESEND_SECONDS);

  useEffect(() => {
    if (step !== 2) return;
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft, step]);

  const masked = useMemo(() => maskDestination(destination), [destination]);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
      });
      if (!res.ok) throw new Error("Failed to send OTP");
      setStep(2);
      setSecondsLeft(RESEND_SECONDS);
      setToast(`OTP sent to ${masked}`);
    } catch (err) {
      setError(err.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/verify/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination, code: otp }),
      });
      if (!res.ok) throw new Error("OTP verification failed");
      const data = await res.json();
      
      // Use AuthContext to properly set authentication state
      const tokens = { access: data.access, refresh: data.refresh };
      const userData = data.user;
      
      await loginWithOTP(tokens, userData);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (secondsLeft > 0) return;
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/otp/request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ destination }),
      });
      if (!res.ok) throw new Error("Failed to resend OTP");
      setSecondsLeft(RESEND_SECONDS);
      setToast("OTP resent");
    } catch (err) {
      setError(err.message || "Unable to resend");
    } finally {
      setLoading(false);
    }
  };

  const goBackToEmail = () => {
    setStep(1);
    setOtp("");
    setError("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f6f8fb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        p: { xs: 2, md: 4 },
      }}
    >
      <Card sx={{ width: "100%", maxWidth: 980, borderRadius: 3, boxShadow: 4 }}>
        <Grid container>
          {/* Left pane */}
          <Grid item xs={12} md={7}>
            <CardContent sx={{ p: { xs: 3, md: 6 } }}>
              {/* Logo + smart sign-in button placeholder */}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 36,
                      height: 24,
                      borderRadius: "6px",
                      bgcolor: "#e3f2fd",
                      border: "2px solid #64b5f6",
                    }}
                  />
                  <Typography variant="h6" fontWeight={700}>
                    ZBooks
                  </Typography>
                </Box>

                <Button variant="contained" size="small" sx={{ borderRadius: 999 }}>
                  Try smart sign-in ✨
                </Button>
              </Box>

              <Typography variant="h4" sx={{ fontWeight: 700 }}>
                Sign in
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                to access ZBooks
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}

              {step === 1 && (
                <Box component="form" onSubmit={handleRequestOtp}>
                  <TextField
                    fullWidth
                    required
                    label="Email address or mobile number"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    margin="normal"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          {destination.includes("@") ? <Mail /> : <PhoneIphone />}
                        </InputAdornment>
                      ),
                    }}
                  />
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 1.5, py: 1.2 }}
                    disabled={loading || !destination}
                  >
                    {loading ? "Please wait…" : "Next"}
                  </Button>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Sign in using
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Button size="small" variant="outlined">
                        Google
                      </Button>
                      <Button size="small" variant="outlined">
                        Apple
                      </Button>
                      <Button size="small" variant="outlined">
                        LinkedIn
                      </Button>
                    </Box>
                  </Box>

                  <Typography variant="body2" sx={{ mt: 3 }}>
                    Don’t have an account?{" "}
                    <Link underline="hover" href="#">
                      Sign up now
                    </Link>
                  </Typography>
                </Box>
              )}

              {step === 2 && (
                <Box component="form" onSubmit={handleVerify}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                    <IconButton size="small" onClick={goBackToEmail}>
                      <ArrowBack fontSize="small" />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      OTP sent to <b>{masked}</b>{" "}
                      <Link component="button" onClick={goBackToEmail} underline="hover">
                        Change
                      </Link>
                    </Typography>
                  </Box>

                  <TextField
                    fullWidth
                    inputMode="numeric"
                    label="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    margin="normal"
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Verified />
                        </InputAdornment>
                      ),
                    }}
                  />

                  <Typography variant="caption" color="text.secondary">
                    {secondsLeft > 0 ? (
                      <>Resend in {secondsLeft}s</>
                    ) : (
                      <Link component="button" onClick={resendOtp} underline="hover">
                        Resend OTP
                      </Link>
                    )}
                  </Typography>

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2, py: 1.2 }}
                    disabled={loading || otp.length === 0}
                  >
                    {loading ? "Verifying…" : "Verify"}
                  </Button>

                  <Box sx={{ mt: 3 }}>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      Sign in using
                    </Typography>
                    <Button size="small" variant="outlined">
                      Google
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Grid>

          {/* Vertical divider (hidden on mobile) */}
          <Grid
            item
            md={1}
            sx={{
              display: { xs: "none", md: "block" },
              borderRight: "1px solid",
              borderColor: "divider",
            }}
          />

          {/* Right pane */}
          <Grid
            item
            xs={12}
            md={4}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: { xs: 3, md: 4 },
            }}
          >
            <Box sx={{ textAlign: "center" }}>
              <Box
                sx={{
                  width: 220,
                  height: 160,
                  mx: "auto",
                  mb: 2,
                  borderRadius: 4,
                  bgcolor: "#eef5ff",
                  border: "1px dashed #bbdefb",
                }}
              />
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                MFA for all accounts
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Secure online accounts with 2-step verification. Back up OTP secrets and never
                lose access to your account.
              </Typography>
              <Button variant="outlined">Learn more</Button>
            </Box>
          </Grid>
        </Grid>
      </Card>

      <Snackbar
        open={!!toast}
        autoHideDuration={3000}
        onClose={() => setToast("")}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={() => setToast("")} severity="success" sx={{ width: "100%" }}>
          {toast}
        </Alert>
      </Snackbar>
    </Box>
  );
}
