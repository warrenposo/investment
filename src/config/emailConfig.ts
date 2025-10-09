// Email Configuration
// Copy this file to .env.local and add your actual values

export const EMAIL_CONFIG = {
  // EmailJS Configuration (Recommended for React apps)
  EMAILJS: {
    SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_vosj7ec',
    TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id',
    PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'mxYuvAK0YpSZG6gVA',
  },
  
  // SMTP Configuration (Alternative)
  SMTP: {
    HOST: import.meta.env.VITE_SMTP_HOST || 'smtp.gmail.com',
    PORT: import.meta.env.VITE_SMTP_PORT || '587',
    USER: import.meta.env.VITE_SMTP_USER || 'your_email@gmail.com',
    PASS: import.meta.env.VITE_SMTP_PASS || 'your_app_password_here',
  },
  
  // Company Information
  COMPANY: {
    NAME: import.meta.env.VITE_COMPANY_NAME || 'Valora Capital',
    EMAIL: import.meta.env.VITE_COMPANY_EMAIL || 'info@valora-capital.com',
    PHONE: import.meta.env.VITE_COMPANY_PHONE || '+44 7848 179386',
    ADDRESS: import.meta.env.VITE_COMPANY_ADDRESS || 'Guildford, Surrey, United Kingdom',
    WEBSITE: import.meta.env.VITE_COMPANY_WEBSITE || 'https://valora-capital.com',
  }
};

// Email Templates Configuration
export const EMAIL_TEMPLATES = {
  CONTACT: 'contact_template',
  INVESTMENT: 'investment_template',
  WITHDRAWAL: 'withdrawal_template',
  DEPOSIT: 'deposit_template',
  WELCOME: 'welcome_template',
  PASSWORD_RESET: 'password_reset_template',
  VERIFICATION: 'verification_template',
  NOTIFICATION: 'notification_template'
};
