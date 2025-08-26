import React, { useState } from "react";
import { Card, Grid, Typography, Button } from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";

const Reports = () => {
  // Default mock data for profit & loss
  const [reportType, setReportType] = useState("profit_loss");

  const mockData = {
    profit_loss: [
      { account: "Sales", amount: 50000, type: "income" },
      { account: "Expenses", amount: -45000, type: "expense" },
    ],
  };

  return (
    <div style={{ padding: 24 }}>
      <Typography variant="h5" gutterBottom>
        Reports & Analytics
      </Typography>

      {/* Summary Cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Revenue
            </Typography>
            <Typography variant="h6" color="success.main">
              $50,000
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Total Expenses
            </Typography>
            <Typography variant="h6" color="error.main">
              $45,000
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Net Profit
            </Typography>
            <Typography variant="h6" color="success.main">
              $5,000
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ p: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Profit Margin
            </Typography>
            <Typography variant="h6" color="success.main">
              10%
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Generate Report Section */}
      <Card sx={{ p: 2 }}>
        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Typography variant="h6" sx={{ flex: 1 }}>
            Generate Report
          </Typography>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            Generate
          </Button>
        </div>

        {/* Profit & Loss Report */}
        {reportType === "profit_loss" && (
          <div>
            <Typography variant="subtitle1" gutterBottom>
              Profit & Loss Statement
            </Typography>
            {mockData.profit_loss.map((row) => (
              <div
                key={row.account}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "8px 0",
                }}
              >
                <Typography>{row.account}</Typography>
                <Typography
                  color={
                    row.type === "income" ? "success.main" : "error.main"
                  }
                >
                  ${Math.abs(row.amount).toLocaleString()}
                </Typography>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #eee",
                paddingTop: 8,
                marginTop: 8,
              }}
            >
              <Typography fontWeight={600}>Total</Typography>
              <Typography
                fontWeight={600}
                color={
                  mockData.profit_loss.reduce((s, r) => s + r.amount, 0) >= 0
                    ? "success.main"
                    : "error.main"
                }
              >
                $
                {mockData.profit_loss
                  .reduce((s, r) => s + r.amount, 0)
                  .toLocaleString()}
              </Typography>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
