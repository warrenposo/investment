import emailjs from '@emailjs/browser';

// EmailJS configuration - using fallback values for browser environment
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_vosj7ec';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || 'your_template_id';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || 'mxYuvAK0YpSZG6gVA';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface InvestmentNotificationData {
  userName: string;
  userEmail: string;
  planName: string;
  amount: string;
  transactionId: string;
}

export interface WithdrawalRequestData {
  userName: string;
  userEmail: string;
  amount: string;
  method: string;
  accountDetails: string;
  requestId: string;
}

export interface DepositConfirmationData {
  userName: string;
  userEmail: string;
  amount: string;
  method: string;
  transactionId: string;
}

class EmailService {
  // Send contact form email
  async sendContactEmail(data: ContactFormData): Promise<boolean> {
    try {
      const templateParams = {
        from_name: data.name,
        from_email: data.email,
        phone: data.phone || 'Not provided',
        subject: data.subject,
        message: data.message,
        to_email: 'info@valora-capital.com',
        company_name: 'Valora Capital'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'contact_template', // Template ID for contact form
        templateParams
      );

      console.log('Contact email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending contact email:', error);
      return false;
    }
  }

  // Send investment confirmation email
  async sendInvestmentConfirmation(data: InvestmentNotificationData): Promise<boolean> {
    try {
      const templateParams = {
        user_name: data.userName,
        user_email: data.userEmail,
        plan_name: data.planName,
        investment_amount: data.amount,
        transaction_id: data.transactionId,
        company_name: 'Valora Capital',
        support_email: 'info@valora-capital.com'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'investment_template', // Template ID for investment confirmation
        templateParams
      );

      console.log('Investment confirmation email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending investment confirmation email:', error);
      return false;
    }
  }

  // Send withdrawal request email
  async sendWithdrawalRequest(data: WithdrawalRequestData): Promise<boolean> {
    try {
      const templateParams = {
        user_name: data.userName,
        user_email: data.userEmail,
        withdrawal_amount: data.amount,
        withdrawal_method: data.method,
        account_details: data.accountDetails,
        request_id: data.requestId,
        company_name: 'Valora Capital',
        support_email: 'info@valora-capital.com'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'withdrawal_template', // Template ID for withdrawal request
        templateParams
      );

      console.log('Withdrawal request email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending withdrawal request email:', error);
      return false;
    }
  }

  // Send deposit confirmation email
  async sendDepositConfirmation(data: DepositConfirmationData): Promise<boolean> {
    try {
      const templateParams = {
        user_name: data.userName,
        user_email: data.userEmail,
        deposit_amount: data.amount,
        deposit_method: data.method,
        transaction_id: data.transactionId,
        company_name: 'Valora Capital',
        support_email: 'info@valora-capital.com'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'deposit_template', // Template ID for deposit confirmation
        templateParams
      );

      console.log('Deposit confirmation email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending deposit confirmation email:', error);
      return false;
    }
  }

  // Send welcome email for new users
  async sendWelcomeEmail(userName: string, userEmail: string): Promise<boolean> {
    try {
      const templateParams = {
        user_name: userName,
        user_email: userEmail,
        company_name: 'Valora Capital',
        support_email: 'info@valora-capital.com',
        dashboard_url: `${window.location.origin}/dashboard`
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'welcome_template', // Template ID for welcome email
        templateParams
      );

      console.log('Welcome email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending welcome email:', error);
      return false;
    }
  }

  // Send password reset email
  async sendPasswordResetEmail(userName: string, userEmail: string, resetLink: string): Promise<boolean> {
    try {
      const templateParams = {
        user_name: userName,
        user_email: userEmail,
        reset_link: resetLink,
        company_name: 'Valora Capital',
        support_email: 'info@valora-capital.com'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'password_reset_template', // Template ID for password reset
        templateParams
      );

      console.log('Password reset email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending password reset email:', error);
      return false;
    }
  }

  // Send account verification email
  async sendVerificationEmail(userName: string, userEmail: string, verificationLink: string): Promise<boolean> {
    try {
      const templateParams = {
        user_name: userName,
        user_email: userEmail,
        verification_link: verificationLink,
        company_name: 'Valora Capital',
        support_email: 'info@valora-capital.com'
      };

      const response = await emailjs.send(
        EMAILJS_SERVICE_ID,
        'verification_template', // Template ID for account verification
        templateParams
      );

      console.log('Verification email sent successfully:', response);
      return true;
    } catch (error) {
      console.error('Error sending verification email:', error);
      return false;
    }
  }
}

// Create and export a singleton instance
const emailService = new EmailService();
export default emailService;
