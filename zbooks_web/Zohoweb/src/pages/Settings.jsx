import React, { useState } from "react";
import {
  Card,
  Grid,
  TextField,
  Button,
  Typography,
  Switch,
  FormControlLabel,
  MenuItem,
  Snackbar,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import PersonIcon from "@mui/icons-material/Person";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import MailIcon from "@mui/icons-material/Mail";

const currencies = ["USD", "EUR", "GBP", "INR"];
const timezones = ["UTC", "America/New_York", "America/Chicago", "Asia/Kolkata"];
const dateFormats = ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"];

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });

  const [general, setGeneral] = useState({
    name: "",
    email: "",
    phone: "",
    website: "",
    address: "",
  });

  const [financial, setFinancial] = useState({
    currency: "USD",
    timezone: "Asia/Kolkata",
    date_format: "YYYY-MM-DD",
  });

  const [email, setEmail] = useState({
    smtp_host: "",
    smtp_port: "",
    smtp_username: "",
    smtp_password: "",
    from_email: "",
    invoice_notifications: true,
    payment_notifications: true,
  });

  const handleSave = async (type) => {
    setLoading(true);
    try {
      // Simulate API call
      setTimeout(() => {
        setSnackbar({ open: true, message: `${type} settings saved successfully!` });
        setLoading(false);
      }, 1000);
    } catch (error) {
      setSnackbar({ open: true, message: `Failed to save ${type} settings.` });
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        Settings
      </Typography>

      {/* General Settings */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <PersonIcon sx={{ mr: 1 }} /> General
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Name"
              fullWidth
              required
              value={general.name}
              onChange={(e) => setGeneral({ ...general, name: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Email"
              type="email"
              required
              fullWidth
              value={general.email}
              onChange={(e) => setGeneral({ ...general, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Phone"
              fullWidth
              value={general.phone}
              onChange={(e) => setGeneral({ ...general, phone: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Company Website"
              fullWidth
              value={general.website}
              onChange={(e) => setGeneral({ ...general, website: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Company Address"
              fullWidth
              multiline
              rows={3}
              value={general.address}
              onChange={(e) => setGeneral({ ...general, address: e.target.value })}
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ mt: 2 }}
          disabled={loading}
          onClick={() => handleSave("General")}
        >
          Save General Settings
        </Button>
      </Card>

      {/* Financial Settings */}
      <Card sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <AccountBalanceIcon sx={{ mr: 1 }} /> Financial
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Default Currency"
              select
              fullWidth
              value={financial.currency}
              onChange={(e) =>
                setFinancial({ ...financial, currency: e.target.value })
              }
            >
              {currencies.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Timezone"
              select
              fullWidth
              value={financial.timezone}
              onChange={(e) =>
                setFinancial({ ...financial, timezone: e.target.value })
              }
            >
              {timezones.map((tz) => (
                <MenuItem key={tz} value={tz}>
                  {tz}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Date Format"
              select
              fullWidth
              value={financial.date_format}
              onChange={(e) =>
                setFinancial({ ...financial, date_format: e.target.value })
              }
            >
              {dateFormats.map((df) => (
                <MenuItem key={df} value={df}>
                  {df}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ mt: 2 }}
          disabled={loading}
          onClick={() => handleSave("Financial")}
        >
          Save Financial Settings
        </Button>
      </Card>

      {/* Email & Notifications */}
      <Card sx={{ p: 2 }}>
        <Typography variant="subtitle1" gutterBottom>
          <MailIcon sx={{ mr: 1 }} /> Email & Notifications
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="SMTP Host"
              fullWidth
              value={email.smtp_host}
              onChange={(e) =>
                setEmail({ ...email, smtp_host: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="SMTP Port"
              fullWidth
              value={email.smtp_port}
              onChange={(e) =>
                setEmail({ ...email, smtp_port: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="SMTP Username"
              fullWidth
              value={email.smtp_username}
              onChange={(e) =>
                setEmail({ ...email, smtp_username: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="SMTP Password"
              type="password"
              fullWidth
              value={email.smtp_password}
              onChange={(e) =>
                setEmail({ ...email, smtp_password: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="From Email"
              type="email"
              fullWidth
              value={email.from_email}
              onChange={(e) =>
                setEmail({ ...email, from_email: e.target.value })
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={email.invoice_notifications}
                  onChange={(e) =>
                    setEmail({
                      ...email,
                      invoice_notifications: e.target.checked,
                    })
                  }
                />
              }
              label="Invoice Notifications"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControlLabel
              control={
                <Switch
                  checked={email.payment_notifications}
                  onChange={(e) =>
                    setEmail({
                      ...email,
                      payment_notifications: e.target.checked,
                    })
                  }
                />
              }
              label="Payment Notifications"
            />
          </Grid>
        </Grid>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          sx={{ mt: 2 }}
          disabled={loading}
          onClick={() => handleSave("Email")}
        >
          Save Email Settings
        </Button>
      </Card>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        message={snackbar.message}
      />
    </div>
  );
};

export default Settings;
