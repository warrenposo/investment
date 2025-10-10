# Email Setup Guide for Valora Capital

This guide will help you set up real email functionality using EmailJS for your Valora Capital platform.

## 📧 EmailJS Setup (Recommended)

### Step 1: Create EmailJS Account
1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account
3. Verify your email address

### Step 2: Add Email Service
1. In your EmailJS dashboard, go to "Email Services"
2. Click "Add New Service"
3. Choose your email provider:
   - **Gmail** (Recommended for testing)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

### Step 3: Configure Gmail Service
1. Select "Gmail" as your service
2. Connect your Gmail account
3. Authorize EmailJS to send emails on your behalf
4. Note down your **Service ID** (e.g., `service_abc123`)

### Step 4: Create Email Templates
Create the following templates in EmailJS:

#### 1. Contact Form Template (`contact_template`)
**Subject:** New Contact Form Submission - {{subject}}
**Body:**
```
Hello Valora Capital Team,

You have received a new contact form submission:

Name: {{from_name}}
Email: {{from_email}}
Phone: {{phone}}
Subject: {{subject}}

Message:
{{message}}

Please respond within 2 hours as promised.

Best regards,
Valora Capital System
```

#### 2. Investment Confirmation Template (`investment_template`)
**Subject:** Investment Confirmation - {{plan_name}}
**Body:**
```
Dear {{user_name}},

Thank you for your investment in {{plan_name}}!

Investment Details:
- Plan: {{plan_name}}
- Amount: {{investment_amount}}
- Transaction ID: {{transaction_id}}

Your investment is being processed and you will receive updates via email.

If you have any questions, please contact us at {{support_email}}.

Best regards,
{{company_name}} Team
```

#### 3. Withdrawal Request Template (`withdrawal_template`)
**Subject:** Withdrawal Request - {{request_id}}
**Body:**
```
Dear {{user_name}},

Your withdrawal request has been received and is being processed.

Withdrawal Details:
- Amount: {{withdrawal_amount}}
- Method: {{withdrawal_method}}
- Account Details: {{account_details}}
- Request ID: {{request_id}}

Processing time: 24-48 hours

You will receive another email once the withdrawal is completed.

Best regards,
{{company_name}} Team
```

#### 4. Deposit Confirmation Template (`deposit_template`)
**Subject:** Deposit Confirmation - {{transaction_id}}
**Body:**
```
Dear {{user_name}},

Your deposit request has been received.

Deposit Details:
- Amount: {{deposit_amount}}
- Method: {{deposit_method}}
- Transaction ID: {{transaction_id}}

Please complete the payment using the provided instructions. You will receive confirmation once the payment is verified.

Best regards,
{{company_name}} Team
```

#### 5. Welcome Email Template (`welcome_template`)
**Subject:** Welcome to {{company_name}}!
**Body:**
```
Dear {{user_name}},

Welcome to {{company_name}}! We're excited to have you join our community of successful investors.

Your account has been created successfully. You can now:
- Access your dashboard: {{dashboard_url}}
- View investment plans
- Make deposits and withdrawals
- Track your portfolio performance

If you have any questions, please contact us at {{support_email}}.

Best regards,
{{company_name}} Team
```

### Step 5: Get Your Public Key
1. Go to "Account" in your EmailJS dashboard
2. Copy your **Public Key** (e.g., `user_abc123def456`)

### Step 6: Configure Environment Variables
Create a `.env.local` file in your project root:

```env
# EmailJS Configuration
REACT_APP_EMAILJS_SERVICE_ID=your_service_id_here
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id_here
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key_here

# Company Information
REACT_APP_COMPANY_NAME=Valora Capital
REACT_APP_COMPANY_EMAIL=info@valora-capital.com
REACT_APP_COMPANY_PHONE=+12137274788
REACT_APP_COMPANY_ADDRESS=Guildford, Surrey, United Kingdom
```

### Step 7: Test Your Setup
1. Start your development server: `npm run dev`
2. Go to the Contact page
3. Fill out and submit the contact form
4. Check your email for the message

## 🔧 Alternative: SMTP Setup (Advanced)

If you prefer to use SMTP directly, you can configure it in the email service:

### Gmail SMTP Configuration
```env
REACT_APP_SMTP_HOST=smtp.gmail.com
REACT_APP_SMTP_PORT=587
REACT_APP_SMTP_USER=your_email@gmail.com
REACT_APP_SMTP_PASS=your_app_password_here
```

**Note:** You'll need to:
1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password
3. Use the App Password instead of your regular password

## 📱 Email Features Implemented

### ✅ Contact Form
- Sends emails when users submit contact forms
- Includes all form data (name, email, phone, subject, message)
- Shows success/error status to users

### ✅ Investment Notifications
- Sends confirmation emails when users select investment plans
- Includes plan details and transaction ID
- Professional email templates

### ✅ Withdrawal Requests
- Sends emails when users request withdrawals
- Includes withdrawal amount, method, and account details
- Generates unique request IDs

### ✅ Deposit Confirmations
- Sends emails when users initiate deposits
- Includes deposit amount, method, and transaction ID
- Works with cryptocurrency and traditional payments

### ✅ User Management
- Welcome emails for new users
- Password reset functionality
- Account verification emails

## 🚀 Production Considerations

### Security
- Never commit your `.env.local` file to version control
- Use environment variables for all sensitive data
- Consider using a dedicated email service for production

### Monitoring
- Set up email delivery monitoring
- Track email open rates and click rates
- Monitor for failed email deliveries

### Scaling
- Consider upgrading to EmailJS paid plans for higher limits
- Implement email queuing for high-volume scenarios
- Add email templates for different languages

## 🆘 Troubleshooting

### Common Issues
1. **Emails not sending**: Check your EmailJS service configuration
2. **Template errors**: Verify template variable names match exactly
3. **CORS issues**: Ensure your domain is whitelisted in EmailJS
4. **Rate limits**: Check your EmailJS plan limits

### Support
- EmailJS Documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
- EmailJS Support: [https://www.emailjs.com/support/](https://www.emailjs.com/support/)

## 📊 Email Analytics

Consider implementing:
- Email open tracking
- Click-through rates
- Bounce rate monitoring
- User engagement metrics

This will help you optimize your email communications and improve user experience.
