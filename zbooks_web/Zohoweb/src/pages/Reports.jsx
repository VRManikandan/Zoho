import React, { useState } from 'react';
// import { Card, Row, Col, Select, DatePicker, Button, Table, Typography, Statistic, Space } from 'antd';
import { Download as DownloadIcon } from '@mui/icons-material';

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { RangePicker } = DatePicker;

const Reports = () => {
  const [reportType, setReportType] = useState('profit_loss');
  const [dateRange, setDateRange] = useState(null);

  const reportTypes = [
    { value: 'profit_loss', label: 'Profit & Loss' },
    { value: 'balance_sheet', label: 'Balance Sheet' },
    { value: 'cash_flow', label: 'Cash Flow' },
    { value: 'sales', label: 'Sales Report' },
    { value: 'purchase', label: 'Purchase Report' },
    { value: 'inventory', label: 'Inventory Report' }
  ];

  const mockData = {
    profit_loss: [
      { account: 'Sales Revenue', amount: 50000, type: 'income' },
      { account: 'Cost of Goods Sold', amount: -30000, type: 'expense' },
      { account: 'Gross Profit', amount: 20000, type: 'income' },
      { account: 'Operating Expenses', amount: -15000, type: 'expense' },
      { account: 'Net Profit', amount: 5000, type: 'income' }
    ]
  };

  const columns = [
    {
      title: 'Account',
      dataIndex: 'account',
      key: 'account',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount, record) => (
        <Text style={{ color: record.type === 'income' ? '#52c41a' : '#ff4d4f' }}>
          ${Math.abs(amount).toLocaleString()}
        </Text>
      )
    }
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Reports & Analytics</Title>
      
      <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Revenue"
              value={50000}
              prefix="$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={45000}
              prefix="$"
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Net Profit"
              value={5000}
              prefix="$"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Profit Margin"
              value={10}
              suffix="%"
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
      </Row>

      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={4} style={{ margin: 0 }}>Generate Report</Title>
          <Space>
            <Select
              value={reportType}
              onChange={setReportType}
              style={{ width: 200 }}
            >
              {reportTypes.map(type => (
                <Option key={type.value} value={type.value}>{type.label}</Option>
              ))}
            </Select>
            <RangePicker
              value={dateRange}
              onChange={setDateRange}
              placeholder={['Start Date', 'End Date']}
            />
            <Button type="primary" icon={<DownloadIcon />}>
              Generate Report
            </Button>
          </Space>
        </div>

        {reportType === 'profit_loss' && (
          <div>
            <Title level={5}>Profit & Loss Statement</Title>
            <Table
              columns={columns}
              dataSource={mockData.profit_loss}
              rowKey="account"
              pagination={false}
              summary={(pageData) => {
                const total = pageData.reduce((sum, record) => sum + record.amount, 0);
                return (
                  <Table.Summary.Row>
                    <Table.Summary.Cell index={0}>
                      <Text strong>Total</Text>
                    </Table.Summary.Cell>
                    <Table.Summary.Cell index={1}>
                      <Text strong style={{ color: total >= 0 ? '#52c41a' : '#ff4d4f' }}>
                        ${total.toLocaleString()}
                      </Text>
                    </Table.Summary.Cell>
                  </Table.Summary.Row>
                );
              }}
            />
          </div>
        )}
      </Card>
    </div>
  );
};

export default Reports;
