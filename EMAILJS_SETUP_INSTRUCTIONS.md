# EmailJS Quick Setup for Valora Capital

## ✅ Your Credentials Are Configured!
- **Service ID:** service_vosj7ec
- **Public Key:** mxYuvAK0YpSZG6gVA

## 📝 Next Steps: Create Email Templates

### 1. Go to EmailJS Dashboard
Visit: https://dashboard.emailjs.com/admin/templates

### 2. Create These Templates:

#### Template 1: Contact Form (`contact_template`)
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

#### Template 2: Investment Confirmation (`investment_template`)
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

#### Template 3: Withdrawal Request (`withdrawal_template`)
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

#### Template 4: Deposit Confirmation (`deposit_template`)
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

#### Template 5: Welcome Email (`welcome_template`)
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

## 🔧 Environment Setup

### Create .env.local file:
1. Create a file named `.env.local` in your project root
2. Copy the content from `env.local.example`
3. Restart your development server: `npm run dev`

## 🧪 Test Your Setup

### Test Contact Form:
1. Go to `/contact` page
2. Fill out the contact form
3. Submit the form
4. Check your email for the message

### Test Dashboard Emails:
1. Go to `/dashboard` page
2. Try the "Deposit Funds" button
3. Try the "Withdraw Funds" button
4. Try selecting an investment plan

## 🚨 Important Notes

### Template Variables:
Make sure to use EXACTLY these variable names in your templates:
- `{{from_name}}` - User's name
- `{{from_email}}` - User's email
- `{{phone}}` - User's phone
- `{{subject}}` - Message subject
- `{{message}}` - Message content
- `{{user_name}}` - User's name
- `{{user_email}}` - User's email
- `{{plan_name}}` - Investment plan name
- `{{investment_amount}}` - Investment amount
- `{{transaction_id}}` - Transaction ID
- `{{withdrawal_amount}}` - Withdrawal amount
- `{{withdrawal_method}}` - Withdrawal method
- `{{account_details}}` - Account details
- `{{request_id}}` - Request ID
- `{{deposit_amount}}` - Deposit amount
- `{{deposit_method}}` - Deposit method
- `{{company_name}}` - Company name
- `{{support_email}}` - Support email
- `{{dashboard_url}}` - Dashboard URL

### Security:
- Never commit `.env.local` to version control
- Keep your EmailJS credentials secure
- Test with a small amount first

## 🎉 You're Ready!

Once you've created the templates and set up the environment file, your email system will be fully functional!

### Features Available:
✅ Contact form emails
✅ Investment confirmation emails
✅ Withdrawal request emails
✅ Deposit confirmation emails
✅ Welcome emails
✅ Professional email templates
✅ Error handling and validation
✅ Loading states and user feedback

Your Valora Capital platform now has professional email functionality! 🚀📧
