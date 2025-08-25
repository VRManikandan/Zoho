import React, { useState } from 'react';
// import { Card, Tabs, Form, Input, Button, Switch, Select, Typography, Row, Col, Divider, message } from 'antd';
import { Save as SaveIcon, Person as PersonIcon, AccountBalance as AccountBalanceIcon, Mail as MailIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { useOrganization } from '../context/OrganizationContext';

// const { Title, Text } = Typography;
// const { Option } = Select;
// const { TextArea } = Input;

const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [generalForm] = Form.useForm();
  const [financialForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const { organization } = useOrganization();

  const handleGeneralSave = async (values) => {
    setLoading(true);
    try {
      // Save general settings
      message.success('General settings saved successfully!');
    } catch (error) {
      message.error('Failed to save general settings');
    } finally {
      setLoading(false);
    }
  };

  const handleFinancialSave = async (values) => {
    setLoading(true);
    try {
      // Save financial settings
      message.success('Financial settings saved successfully!');
    } catch (error) {
      message.error('Failed to save financial settings');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSave = async (values) => {
    setLoading(true);
    try {
      // Save email settings
      message.success('Email settings saved successfully!');
    } catch (error) {
      message.error('Failed to save email settings');
    } finally {
      setLoading(false);
    }
  };

  const items = [
    {
      key: 'general',
      label: (
        <span>
          <PersonIcon />
          General
        </span>
      ),
      children: (
        <Card>
          <Form
            form={generalForm}
            layout="vertical"
            onFinish={handleGeneralSave}
            initialValues={organization}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="name"
                  label="Company Name"
                  rules={[{ required: true, message: 'Please input company name!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="email"
                  label="Company Email"
                  rules={[
                    { required: true, message: 'Please input company email!' },
                    { type: 'email', message: 'Please enter a valid email!' }
                  ]}
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="phone"
                  label="Company Phone"
                  rules={[{ required: true, message: 'Please input company phone!' }]}
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="website"
                  label="Company Website"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="address"
              label="Company Address"
              rules={[{ required: true, message: 'Please input company address!' }]}
            >
              <TextArea rows={3} />
            </Form.Item>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="gst_number"
                  label="GST Number"
                >
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="pan_number"
                  label="PAN Number"
                >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveIcon />}>
                Save General Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'financial',
      label: (
        <span>
          <AccountBalanceIcon />
          Financial
        </span>
      ),
      children: (
        <Card>
          <Form
            form={financialForm}
            layout="vertical"
            onFinish={handleFinancialSave}
            initialValues={organization}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="currency"
                  label="Default Currency"
                  rules={[{ required: true, message: 'Please select currency!' }]}
                >
                  <Select>
                    <Option value="USD">USD - US Dollar</Option>
                    <Option value="EUR">EUR - Euro</Option>
                    <Option value="GBP">GBP - British Pound</Option>
                    <Option value="INR">INR - Indian Rupee</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="fiscal_year_start"
                  label="Fiscal Year Start"
                  rules={[{ required: true, message: 'Please select fiscal year start!' }]}
                >
                  <Select>
                    <Option value="01-01">January 1st</Option>
                    <Option value="04-01">April 1st</Option>
                    <Option value="07-01">July 1st</Option>
                    <Option value="10-01">October 1st</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="timezone"
                  label="Timezone"
                  rules={[{ required: true, message: 'Please select timezone!' }]}
                >
                  <Select>
                    <Option value="UTC">UTC</Option>
                    <Option value="America/New_York">Eastern Time</Option>
                    <Option value="America/Chicago">Central Time</Option>
                    <Option value="America/Denver">Mountain Time</Option>
                    <Option value="America/Los_Angeles">Pacific Time</Option>
                    <Option value="Asia/Kolkata">India Standard Time</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="date_format"
                  label="Date Format"
                  rules={[{ required: true, message: 'Please select date format!' }]}
                >
                  <Select>
                    <Option value="MM/DD/YYYY">MM/DD/YYYY</Option>
                    <Option value="DD/MM/YYYY">DD/MM/YYYY</Option>
                    <Option value="YYYY-MM-DD">YYYY-MM-DD</Option>
                  </Select>
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveIcon />}>
                Save Financial Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
    {
      key: 'email',
      label: (
        <span>
          <MailIcon />
          Email & Notifications
        </span>
      ),
      children: (
        <Card>
          <Form
            form={emailForm}
            layout="vertical"
            onFinish={handleEmailSave}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="smtp_host"
                  label="SMTP Host"
                  rules={[{ required: true, message: 'Please input SMTP host!' }]}
                >
                  <Input placeholder="smtp.gmail.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smtp_port"
                  label="SMTP Port"
                  rules={[{ required: true, message: 'Please input SMTP port!' }]}
                >
                  <Input placeholder="587" />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="smtp_username"
                  label="SMTP Username"
                  rules={[{ required: true, message: 'Please input SMTP username!' }]}
                >
                  <Input placeholder="your-email@gmail.com" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="smtp_password"
                  label="SMTP Password"
                  rules={[{ required: true, message: 'Please input SMTP password!' }]}
                >
                  <Input.Password placeholder="App Password" />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item
              name="from_email"
              label="From Email"
              rules={[
                { required: true, message: 'Please input from email!' },
                { type: 'email', message: 'Please enter a valid email!' }
              ]}
            >
              <Input placeholder="noreply@company.com" />
            </Form.Item>

            <Divider>Notification Preferences</Divider>

            <Row gutter={16}>
              <Col span={12}>
                <Form.Item
                  name="invoice_notifications"
                  label="Invoice Notifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  name="payment_notifications"
                  label="Payment Notifications"
                  valuePropName="checked"
                >
                  <Switch />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading} icon={<SaveIcon />}>
                Save Email Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <Title level={3}>Settings</Title>
      <Text type="secondary">Manage your organization settings and preferences</Text>
      
      <div style={{ marginTop: '24px' }}>
        <Tabs
          defaultActiveKey="general"
          items={items}
          size="large"
          tabPosition="top"
        />
      </div>
    </div>
  );
};

export default Settings;
