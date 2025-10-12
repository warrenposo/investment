import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import emailService from "@/services/emailService";
import SupabaseService from "@/services/supabaseService";
import KycChecker from "@/utils/kycChecker";
import PaymentService from "@/services/paymentService";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import { 
  TrendingUp, 
  DollarSign, 
  Clock, 
  Users, 
  BarChart3, 
  Settings, 
  LogOut,
  Plus,
  Eye,
  EyeOff,
  Wallet,
  Target,
  Calendar,
  CheckCircle,
  AlertCircle,
  Star,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  Smartphone,
  Copy,
  QrCode,
  Shield
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showBalance, setShowBalance] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showInvestModal, setShowInvestModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState({ id: '', name: '', minAmount: 0 });
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [withdrawMethod, setWithdrawMethod] = useState("");
  const [withdrawAccount, setWithdrawAccount] = useState("");
  const [isProcessingWithdraw, setIsProcessingWithdraw] = useState(false);
  const [depositAmount, setDepositAmount] = useState("");
  const [depositMethod, setDepositMethod] = useState("");
  const [selectedCrypto, setSelectedCrypto] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    totalBalance: 0,
    totalInvested: 0,
    totalProfit: 0,
    activeInvestments: 0,
    totalWithdrawals: 0
  });
  const [paymentRequests, setPaymentRequests] = useState<any[]>([]);
  const [paymentHistory, setPaymentHistory] = useState<any[]>([]);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [kycStatus, setKycStatus] = useState({
    status: 'not_started' as 'pending' | 'approved' | 'rejected' | 'not_started',
    canDeposit: false,
    message: '',
    documents: {
      id_front: false,
      id_back: false,
      selfie: false,
      proof_of_address: false
    }
  });
  const [settingsData, setSettingsData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    notifications: true,
    twoFactor: false
  });

  // Initialize user data from localStorage or URL params
  useEffect(() => {
    // Check KYC status if user is authenticated
    checkKycStatus();
  }, []);

  // Check KYC status
  const checkKycStatus = async () => {
    try {
      // Get current Supabase user
      const currentUser = await SupabaseService.getCurrentUser();
      
      if (currentUser) {
        // Get user profile and balance from Supabase
        const userProfile = await SupabaseService.getUserProfile(currentUser.id);
        const userBalance = await SupabaseService.getUserBalance(currentUser.id);
        
        // Check if user is admin
        const isAdmin = currentUser.email === 'warrenokumu98@gmail.com';
        
        // If admin, redirect to admin dashboard
        if (isAdmin) {
          console.log('Dashboard - Admin user detected from Supabase, redirecting to /admin');
          navigate('/admin');
          return;
        }
        
        // Set user data for regular users
        setUserData({
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          email: currentUser.email,
          totalBalance: userBalance?.total_balance || 0,
          totalInvested: userBalance?.total_invested || 0,
          totalProfit: userBalance?.total_profit || 0,
          activeInvestments: userBalance?.active_investments || 0,
          totalWithdrawals: userBalance?.total_withdrawals || 0
        });
        
        // Get KYC status
        const kycStatusData = await KycChecker.canUserDeposit(currentUser.id);
        setKycStatus(kycStatusData);
        
        // Load payment data
        await loadPaymentData(currentUser.id);
        
        console.log('Supabase user loaded:', {
          id: currentUser.id,
          name: `${userProfile.first_name} ${userProfile.last_name}`,
          email: currentUser.email,
          isAdmin: false
        });
      } else {
        // No Supabase user, redirect to sign in
        console.log('Dashboard - No authenticated user, redirecting to signin');
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error checking KYC status:', error);
      // If Supabase fails, redirect to sign in
      navigate('/signin');
    }
  };

  // User's actual investment plans data (starts empty)
  const [investmentPlans, setInvestmentPlans] = useState([]);

  // User's actual recent transactions (starts empty)
  const [recentTransactions, setRecentTransactions] = useState([]);

  const loadPaymentData = async (userId: string) => {
    try {
      const [requests, history] = await Promise.all([
        SupabaseService.getUserPaymentRequests(userId),
        PaymentService.getUserPaymentHistory(userId)
      ]);
      
      setPaymentRequests(requests);
      setPaymentHistory(history);
    } catch (error) {
      console.error('Error loading payment data:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, redirect to home page
      navigate('/');
    }
  };

  const handleWithdrawFunds = () => {
    setShowWithdrawModal(true);
  };

  const handleAccountSettings = () => {
    setShowSettingsModal(true);
  };

  const handleWithdrawSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!withdrawAmount || !withdrawMethod || !withdrawAccount) {
      alert("Please fill in all fields");
      return;
    }

    const amount = parseFloat(withdrawAmount);
    if (amount <= 0 || amount > userData.totalBalance) {
      alert("Invalid withdrawal amount");
      return;
    }

    setIsProcessingWithdraw(true);
    
    try {
      // Generate a request ID
      const requestId = `WD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Send withdrawal request email
      await emailService.sendWithdrawalRequest({
        userName: userData.name,
        userEmail: userData.email,
        amount: formatCurrency(amount),
        method: withdrawMethod,
        accountDetails: withdrawAccount,
        requestId: requestId
      });

      // Simulate API call
      setTimeout(() => {
        setIsProcessingWithdraw(false);
        setShowWithdrawModal(false);
        setWithdrawAmount("");
        setWithdrawMethod("");
        setWithdrawAccount("");
        alert(`Withdrawal request submitted for ${formatCurrency(amount)}. Processing time: 24-48 hours. You will receive email confirmation shortly.`);
      }, 2000);
    } catch (error) {
      console.error('Error processing withdrawal:', error);
      setIsProcessingWithdraw(false);
      alert('Error processing withdrawal request. Please try again.');
    }
  };

  const handleSettingsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate API call
    setTimeout(() => {
      setShowSettingsModal(false);
      alert("Account settings updated successfully!");
    }, 1000);
  };

  const handleInvestNow = async (planId: string, planName: string, minAmount: number) => {
    // Check if user has sufficient balance
    if (userData.totalBalance < minAmount) {
      // Show modal asking user to make deposit first
      setSelectedPlan({ id: planId, name: planName, minAmount });
      setShowInvestModal(true);
      return;
    }

    try {
      // Generate a transaction ID
      const transactionId = `INV-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Send investment confirmation email
      await emailService.sendInvestmentConfirmation({
        userName: userData.name,
        userEmail: userData.email,
        planName: planName,
        amount: "Amount to be determined", // This would come from a form
        transactionId: transactionId
      });

      alert(`Starting investment process for ${planName}. This would typically open an investment form or redirect to a payment page. You will receive email confirmation once the investment is processed.`);
    } catch (error) {
      console.error('Error processing investment:', error);
      alert(`Starting investment process for ${planName}. This would typically open an investment form or redirect to a payment page.`);
    }
  };

  const handleDepositFunds = async () => {
    try {
      const currentUser = await SupabaseService.getCurrentUser();
      if (!currentUser) {
        navigate('/signin');
        return;
      }

      // Check KYC status before allowing deposit
      const kycValidation = await KycChecker.validateDeposit(currentUser.id);
      
      if (!kycValidation.valid) {
        // Show alert and redirect to KYC page
        alert(kycValidation.message);
        if (kycValidation.redirectTo) {
          navigate(kycValidation.redirectTo);
        }
        return;
      }

      setShowDepositModal(true);
    } catch (error) {
      console.error('Error checking KYC status:', error);
      alert('Unable to verify KYC status. Please try again.');
    }
  };

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!depositAmount || !depositMethod) {
      alert("Please fill in all fields");
      return;
    }

    const amount = parseFloat(depositAmount);
    if (amount <= 0) {
      alert("Invalid deposit amount");
      return;
    }

    setIsProcessingPayment(true);

    try {
      const currentUser = await SupabaseService.getCurrentUser();
      if (!currentUser) {
        navigate('/signin');
        return;
      }

      // Create payment request based on method
      let paymentRequest;
      
      if (depositMethod === 'Bitcoin' || depositMethod === 'Ethereum' || depositMethod === 'USDT') {
        const currency = depositMethod === 'Bitcoin' ? 'BTC' : 
                        depositMethod === 'Ethereum' ? 'ETH' : 'USDT';
        
        paymentRequest = await PaymentService.createPaymentRequest(
          currentUser.id,
          currency,
          amount
        );

        // For development, simulate payment confirmation
        await PaymentService.simulatePaymentConfirmation(
          paymentRequest.trackingId,
          currency,
          amount
        );

        // Send deposit confirmation email
        await emailService.sendDepositConfirmation({
          userName: userData.name,
          userEmail: userData.email,
          amount: formatCurrency(amount),
          method: depositMethod,
          transactionId: paymentRequest.id,
          cryptoAddress: paymentRequest.address,
          cryptoAmount: paymentRequest.cryptoAmount
        });

        alert(`Payment request created!\n\nSend ${paymentRequest.cryptoAmount} ${currency} to:\n${paymentRequest.address}\n\nReference: ${paymentRequest.userReference}\n\nYour balance will be updated once the transaction is confirmed on the blockchain.`);
      } else {
        // Traditional payment methods (Card, Bank Transfer)
        const transactionId = `DP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        await emailService.sendDepositConfirmation({
          userName: userData.name,
          userEmail: userData.email,
          amount: formatCurrency(amount),
          method: depositMethod,
          transactionId: transactionId
        });

        alert(`Deposit request submitted for ${formatCurrency(amount)} via ${depositMethod}. Please complete the payment to fund your account. You will receive email confirmation once payment is confirmed.`);
      }

      // Refresh payment data
      await loadPaymentData(currentUser.id);
      
      // Close modal and reset form
      setShowDepositModal(false);
      setDepositAmount("");
      setDepositMethod("");
      setSelectedCrypto("");

    } catch (error) {
      console.error('Error processing deposit:', error);
      alert('Error processing deposit request. Please try again.');
    } finally {
      setIsProcessingPayment(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Address copied to clipboard!");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-500";
      case "Completed": return "bg-blue-500";
      case "Processing": return "bg-yellow-500";
      case "Pending": return "bg-gray-500";
      default: return "bg-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active": return <CheckCircle className="w-4 h-4" />;
      case "Completed": return <CheckCircle className="w-4 h-4" />;
      case "Processing": return <Clock className="w-4 h-4" />;
      case "Pending": return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-lg font-bold text-primary-foreground">
                VC
              </div>
              <div>
                <h1 className="text-xl font-bold">Valora Capital</h1>
                <p className="text-sm text-muted-foreground">Investment Dashboard</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome back,</p>
                <p className="font-semibold">{userData.name}</p>
              </div>
              
              {/* KYC Status Indicator */}
              <div className="flex items-center gap-2">
                {kycStatus.status === 'approved' ? (
                  <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Verified
                  </Badge>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/kyc')}
                    className="text-orange-600 border-orange-200 hover:bg-orange-50"
                  >
                    <Shield className="w-3 h-3 mr-1" />
                    Complete KYC
                  </Button>
                )}
              </div>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        {/* KYC Status Alert */}
        {kycStatus.status !== 'approved' && (
          <Alert className="mb-6 border-orange-200 bg-orange-50">
            <AlertCircle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <div className="flex items-center justify-between">
                <div>
                  <strong>KYC Verification Required:</strong> {kycStatus.message}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/kyc')}
                  className="ml-4 border-orange-300 text-orange-700 hover:bg-orange-100"
                >
                  Complete KYC
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Balance Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
              <Wallet className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? (userData.totalBalance > 0 ? formatCurrency(userData.totalBalance) : "$0.00") : "••••••"}
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {showBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? (userData.totalInvested > 0 ? formatCurrency(userData.totalInvested) : "$0.00") : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Across {userData.activeInvestments} active plans
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Profit</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {showBalance ? (userData.totalProfit > 0 ? formatCurrency(userData.totalProfit) : "$0.00") : "••••••"}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {showBalance ? (userData.totalWithdrawals > 0 ? formatCurrency(userData.totalWithdrawals) : "$0.00") : "••••••"}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Available for withdrawal
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="investments">My Investments</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="plans">Investment Plans</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Active Investments */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5" />
                    Active Investments
                  </CardTitle>
                  <CardDescription>
                    Your currently active investment plans
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {investmentPlans.filter(plan => plan.status === "Active").length > 0 ? (
                    investmentPlans.filter(plan => plan.status === "Active").map((plan) => (
                      <div key={plan.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${plan.color}`}></div>
                          <div>
                            <p className="font-semibold">{plan.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(plan.amount)} • {plan.roi}% {plan.frequency}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-green-600">
                            +{formatCurrency(plan.totalReturn)}
                          </p>
                          <Progress value={plan.progress} className="w-20 h-2 mt-1" />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No Active Investments</p>
                      <p className="text-sm">Start your investment journey by choosing a plan</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Transactions */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" />
                    Recent Transactions
                  </CardTitle>
                  <CardDescription>
                    Your latest investment activities
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentTransactions.length > 0 ? (
                    recentTransactions.slice(0, 4).map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            transaction.type === "Investment" ? "bg-blue-100 text-blue-600" :
                            transaction.type === "Profit" ? "bg-green-100 text-green-600" :
                            "bg-red-100 text-red-600"
                          }`}>
                            {transaction.type === "Investment" ? <Plus className="w-4 h-4" /> :
                             transaction.type === "Profit" ? <TrendingUp className="w-4 h-4" /> :
                             <ArrowDownRight className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-semibold">{transaction.type}</p>
                            <p className="text-sm text-muted-foreground">{transaction.plan}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={`font-semibold ${
                            transaction.amount > 0 ? "text-green-600" : "text-red-600"
                          }`}>
                            {transaction.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(transaction.amount))}
                          </p>
                          <p className="text-sm text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No Recent Transactions</p>
                      <p className="text-sm">Your transaction history will appear here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Manage your investments and account
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Button className="h-20 flex flex-col gap-2" onClick={() => setActiveTab("plans")}>
                    <Plus className="w-6 h-6" />
                    <span>New Investment</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => handleDepositFunds()}>
                    <DollarSign className="w-6 h-6" />
                    <span>Deposit Funds</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => handleWithdrawFunds()}>
                    <Wallet className="w-6 h-6" />
                    <span>Withdraw Funds</span>
                  </Button>
                  <Button variant="outline" className="h-20 flex flex-col gap-2" onClick={() => handleAccountSettings()}>
                    <Settings className="w-6 h-6" />
                    <span>Account Settings</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Investments Tab */}
          <TabsContent value="investments" className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {investmentPlans.length > 0 ? (
                investmentPlans.map((plan) => (
                <Card key={plan.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${plan.color}`}></div>
                        <div>
                          <CardTitle className="flex items-center gap-2">
                            {plan.name}
                            <Badge className={getStatusColor(plan.status)}>
                              {getStatusIcon(plan.status)}
                              <span className="ml-1">{plan.status}</span>
                            </Badge>
                          </CardTitle>
                          <CardDescription>
                            Investment Amount: {formatCurrency(plan.amount)} • ROI: {plan.roi}% {plan.frequency}
                          </CardDescription>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-green-600">
                          +{formatCurrency(plan.totalReturn)}
                        </p>
                        <p className="text-sm text-muted-foreground">Total Return</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Start Date</p>
                        <p className="font-semibold">{plan.startDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">End Date</p>
                        <p className="font-semibold">{plan.endDate}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{plan.duration}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress</span>
                        <span>{plan.progress}%</span>
                      </div>
                      <Progress value={plan.progress} className="h-2" />
                    </div>
                  </CardContent>
                </Card>
                ))
              ) : (
                <div className="text-center py-16 text-muted-foreground">
                  <BarChart3 className="w-16 h-16 mx-auto mb-6 opacity-50" />
                  <h3 className="text-2xl font-bold mb-4">No Investments Yet</h3>
                  <p className="text-lg mb-6">Start your investment journey by choosing from our available plans</p>
                  <Button 
                    onClick={() => setActiveTab("plans")}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 text-lg font-semibold"
                  >
                    View Investment Plans
                  </Button>
                </div>
              )}
            </div>
          </TabsContent>

          {/* Transactions Tab */}
          <TabsContent value="transactions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Transaction History</CardTitle>
                <CardDescription>
                  Complete history of all your transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.type === "Investment" ? "bg-blue-100 text-blue-600" :
                          transaction.type === "Profit" ? "bg-green-100 text-green-600" :
                          "bg-red-100 text-red-600"
                        }`}>
                          {transaction.type === "Investment" ? <Plus className="w-5 h-5" /> :
                           transaction.type === "Profit" ? <TrendingUp className="w-5 h-5" /> :
                           <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-semibold">{transaction.type}</p>
                          <p className="text-sm text-muted-foreground">{transaction.plan}</p>
                          <p className="text-xs text-muted-foreground">{transaction.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? "text-green-600" : "text-red-600"
                        }`}>
                          {transaction.amount > 0 ? "+" : ""}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <Badge className={getStatusColor(transaction.status)}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-1">{transaction.status}</span>
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Investment Plans Tab */}
          <TabsContent value="plans" className="space-y-6">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Choose Your Investment Plan</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Select from our range of investment plans designed to maximize your returns while minimizing risk.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[
                {
                  id: "starter",
                  name: "Starter",
                  minInvestment: "$100",
                  maxInvestment: "$499",
                  roi: "1.9%",
                  frequency: "Daily",
                  duration: "Weekly Trial",
                  badge: "Weekly Trial",
                  badgeColor: "bg-blue-500",
                  popular: false
                },
                {
                  id: "new-trader",
                  name: "New Trader",
                  minInvestment: "$500",
                  maxInvestment: "$999",
                  roi: "2%",
                  frequency: "Daily",
                  duration: "30 days",
                  badge: null,
                  badgeColor: "",
                  popular: false
                },
                {
                  id: "flex",
                  name: "Flex",
                  minInvestment: "$1,000",
                  maxInvestment: "$2,500",
                  roi: "5%",
                  frequency: "Daily",
                  duration: "30 days",
                  badge: "Most Popular",
                  badgeColor: "bg-green-500",
                  popular: true
                },
                {
                  id: "professional",
                  name: "Professional",
                  minInvestment: "$3,000",
                  maxInvestment: "$4,999",
                  roi: "8.6%",
                  frequency: "Daily",
                  duration: "30 days",
                  badge: "Hot",
                  badgeColor: "bg-red-500",
                  popular: false
                },
                {
                  id: "pro",
                  name: "Pro",
                  minInvestment: "$5,000",
                  maxInvestment: "$9,999",
                  roi: "12%",
                  frequency: "Daily",
                  duration: "30 days",
                  badge: null,
                  badgeColor: "",
                  popular: false
                },
                {
                  id: "elite",
                  name: "Elite",
                  minInvestment: "$10,000",
                  maxInvestment: "$30,000",
                  roi: "20%",
                  frequency: "Daily",
                  duration: "30 days",
                  badge: "Hot",
                  badgeColor: "bg-red-500",
                  popular: false
                },
                {
                  id: "prime",
                  name: "Prime",
                  minInvestment: "$40,000",
                  maxInvestment: "$90,000",
                  roi: "20%",
                  frequency: "Hourly",
                  duration: "30 days",
                  badge: "Hourly",
                  badgeColor: "bg-purple-500",
                  popular: false
                },
                {
                  id: "master",
                  name: "Master",
                  minInvestment: "$100,000",
                  maxInvestment: "$400,000",
                  roi: "25%",
                  frequency: "Hourly",
                  duration: "30 days",
                  badge: null,
                  badgeColor: "",
                  popular: false
                },
                {
                  id: "titan",
                  name: "Titan",
                  minInvestment: "$500,000",
                  maxInvestment: "$900,000",
                  roi: "30%",
                  frequency: "Hourly",
                  duration: "30 days",
                  badge: null,
                  badgeColor: "",
                  popular: false
                },
                {
                  id: "legend",
                  name: "Legend",
                  minInvestment: "$1,000,000",
                  maxInvestment: "$1,500,000",
                  roi: "40%",
                  frequency: "Hourly",
                  duration: "30 days",
                  badge: null,
                  badgeColor: "",
                  popular: false
                },
                {
                  id: "infinite",
                  name: "Infinite",
                  minInvestment: "$1,500,000",
                  maxInvestment: "$2,500,000",
                  roi: "50%",
                  frequency: "Hourly",
                  duration: "Lifetime",
                  badge: "High Return",
                  badgeColor: "bg-yellow-500",
                  popular: false
                }
              ].map((plan) => (
                <Card key={plan.id} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-105 ${
                  plan.popular ? 'border-primary shadow-lg shadow-primary/20' : 'border-border'
                }`}>
                  {plan.badge && (
                    <div className={`absolute top-0 left-0 right-0 ${plan.badgeColor} text-white text-center py-2 text-sm font-semibold`}>
                      {plan.badge}
                    </div>
                  )}
                  
                  <CardHeader className={`text-center ${plan.badge ? 'pt-12' : 'pt-6'}`}>
                    <CardTitle className="text-xl font-bold mb-2">{plan.name}</CardTitle>
                    <div className="mb-4">
                      <div className="text-sm text-muted-foreground mb-1">Investment Range</div>
                      <div className="text-lg font-bold text-primary">
                        {plan.minInvestment} - {plan.maxInvestment}
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <span className="text-2xl font-bold text-green-500">{plan.roi}</span>
                      <span className="text-muted-foreground">{plan.frequency}</span>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Capital will back: Yes</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">24/7 Support</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">Secure Platform</span>
                      </div>
                    </div>
                    
                    <Button 
                      className={`w-full py-4 text-lg font-semibold ${
                        plan.popular 
                          ? 'bg-primary hover:bg-primary/90' 
                          : 'bg-secondary hover:bg-secondary/80'
                      }`}
                      onClick={() => handleInvestNow(plan.id, plan.name, plan.minAmount)}
                    >
                      Invest Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Withdraw Funds Modal */}
        <Dialog open={showWithdrawModal} onOpenChange={setShowWithdrawModal}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Withdraw Funds</DialogTitle>
              <DialogDescription>
                Request a withdrawal from your account balance.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <Label htmlFor="amount">Withdrawal Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="0.00"
                  value={withdrawAmount}
                  onChange={(e) => setWithdrawAmount(e.target.value)}
                  min="1"
                  max={userData.totalBalance}
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Available balance: {formatCurrency(userData.totalBalance)}
                </p>
              </div>
              
              <div>
                <Label htmlFor="method">Withdrawal Method</Label>
                <Select value={withdrawMethod} onValueChange={setWithdrawMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select withdrawal method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bank">Bank Transfer</SelectItem>
                    <SelectItem value="crypto">Cryptocurrency</SelectItem>
                    <SelectItem value="paypal">PayPal</SelectItem>
                    <SelectItem value="skrill">Skrill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="account">Account Details</Label>
                <Textarea
                  id="account"
                  placeholder="Enter your account details (account number, wallet address, etc.)"
                  value={withdrawAccount}
                  onChange={(e) => setWithdrawAccount(e.target.value)}
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowWithdrawModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isProcessingWithdraw}
                  className="flex-1"
                >
                  {isProcessingWithdraw ? "Processing..." : "Submit Request"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Account Settings Modal */}
        <Dialog open={showSettingsModal} onOpenChange={setShowSettingsModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Account Settings</DialogTitle>
              <DialogDescription>
                Update your account information and preferences.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    value={settingsData.firstName}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    value={settingsData.lastName}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={settingsData.email}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={settingsData.phone}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={settingsData.country}
                  onChange={(e) => setSettingsData(prev => ({ ...prev, country: e.target.value }))}
                />
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates about your investments</p>
                  </div>
                  <input
                    type="checkbox"
                    id="notifications"
                    checked={settingsData.notifications}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, notifications: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="twoFactor">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add extra security to your account</p>
                  </div>
                  <input
                    type="checkbox"
                    id="twoFactor"
                    checked={settingsData.twoFactor}
                    onChange={(e) => setSettingsData(prev => ({ ...prev, twoFactor: e.target.checked }))}
                    className="w-4 h-4"
                  />
                </div>
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowSettingsModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  Save Changes
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Deposit Funds Modal */}
        <Dialog open={showDepositModal} onOpenChange={setShowDepositModal}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Deposit Funds</DialogTitle>
              <DialogDescription>
                Add funds to your account using various payment methods.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <Label htmlFor="depositAmount">Deposit Amount</Label>
                <Input
                  id="depositAmount"
                  type="number"
                  placeholder="0.00"
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  min="1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Minimum deposit: $100
                </p>
              </div>
              
              <div>
                <Label htmlFor="depositMethod">Payment Method</Label>
                <Select value={depositMethod} onValueChange={setDepositMethod}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select payment method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bitcoin">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                        Bitcoin (BTC)
                      </div>
                    </SelectItem>
                    <SelectItem value="ethereum">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        Ethereum (ETH)
                      </div>
                    </SelectItem>
                    <SelectItem value="usdt-erc20">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        USDT (ERC-20)
                      </div>
                    </SelectItem>
                    <SelectItem value="usdt-trc20">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        USDT (TRC-20)
                      </div>
                    </SelectItem>
                    <SelectItem value="card">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4" />
                        Credit/Debit Card
                      </div>
                    </SelectItem>
                    <SelectItem value="bank">
                      <div className="flex items-center gap-2">
                        <Smartphone className="w-4 h-4" />
                        Bank Transfer
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Cryptocurrency Payment Section */}
              {depositMethod && ['bitcoin', 'ethereum', 'usdt-erc20', 'usdt-trc20'].includes(depositMethod) && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">
                      {depositMethod === 'bitcoin' && 'Bitcoin Payment'}
                      {depositMethod === 'ethereum' && 'Ethereum Payment'}
                      {depositMethod === 'usdt-erc20' && 'USDT Payment (ERC-20)'}
                      {depositMethod === 'usdt-trc20' && 'USDT Payment (TRC-20)'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Send your payment to the address below
                    </p>
                  </div>

                  {/* QR Code */}
                  <div className="flex justify-center mb-4">
                    <div className="w-48 h-48 bg-white border-2 border-gray-300 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <QrCode className="w-16 h-16 mx-auto mb-2 text-gray-400" />
                        <p className="text-xs text-gray-500">QR Code</p>
                        <p className="text-xs text-gray-400">Scan to pay</p>
                      </div>
                    </div>
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <Label>Wallet Address</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <Input
                        value={
                          depositMethod === 'bitcoin' ? '163JAzy3CEz8YoNGDDtu9KxpXgnm5Kn9Rs' :
                          depositMethod === 'ethereum' ? '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690' :
                          depositMethod === 'usdt-erc20' ? '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690' :
                          'THaAnBqAvQ3YY751nXqNDzCoczYVQtBKnP'
                        }
                        readOnly
                        className="font-mono text-sm"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(
                          depositMethod === 'bitcoin' ? '163JAzy3CEz8YoNGDDtu9KxpXgnm5Kn9Rs' :
                          depositMethod === 'ethereum' ? '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690' :
                          depositMethod === 'usdt-erc20' ? '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690' :
                          'THaAnBqAvQ3YY751nXqNDzCoczYVQtBKnP'
                        )}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <QRCodeGenerator
                        address={
                          depositMethod === 'bitcoin' ? '163JAzy3CEz8YoNGDDtu9KxpXgnm5Kn9Rs' :
                          depositMethod === 'ethereum' ? '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690' :
                          depositMethod === 'usdt-erc20' ? '0x8c0fd3fdc6f56e658fb1bffa8f5ddd65388ba690' :
                          'THaAnBqAvQ3YY751nXqNDzCoczYVQtBKnP'
                        }
                        currency={
                          depositMethod === 'bitcoin' ? 'BTC' :
                          depositMethod === 'ethereum' ? 'ETH' :
                          depositMethod === 'usdt-erc20' ? 'USDT-ERC20' :
                          'USDT-TRC20'
                        }
                        amount={depositAmount}
                      />
                    </div>
                  </div>

                  {/* Payment Instructions */}
                  <div className="text-sm text-muted-foreground space-y-2">
                    <p><strong>Important:</strong></p>
                    <ul className="list-disc list-inside space-y-1 ml-4">
                      <li>Send only {depositMethod.toUpperCase()} to this address</li>
                      <li>Minimum amount: $100 USD equivalent</li>
                      <li>Network: {
                        depositMethod === 'bitcoin' ? 'Bitcoin' : 
                        depositMethod === 'ethereum' ? 'Ethereum' : 
                        depositMethod === 'usdt-erc20' ? 'Ethereum (ERC-20)' : 
                        'TRON (TRC-20)'
                      }</li>
                      <li>Processing time: 10-30 minutes</li>
                      <li>Do not send other cryptocurrencies to this address</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Traditional Payment Section */}
              {depositMethod && ['card', 'bank'].includes(depositMethod) && (
                <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <h3 className="font-semibold mb-2">
                      {depositMethod === 'card' ? 'Card Payment' : 'Bank Transfer'}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {depositMethod === 'card' 
                        ? 'Complete your payment using your credit or debit card'
                        : 'Transfer funds directly from your bank account'
                      }
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <Label>Amount to Pay</Label>
                      <Input
                        value={depositAmount ? formatCurrency(parseFloat(depositAmount)) : ''}
                        readOnly
                        className="font-semibold"
                      />
                    </div>
                    
                    {depositMethod === 'bank' && (
                      <div>
                        <Label>Bank Details</Label>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Bank Name:</span>
                            <span className="font-mono">Valora Capital Bank</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Account Number:</span>
                            <span className="font-mono">1234567890</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Routing Number:</span>
                            <span className="font-mono">987654321</span>
                          </div>
                          <div className="flex justify-between">
                            <span>SWIFT Code:</span>
                            <span className="font-mono">VCBKUS33</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowDepositModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                >
                  {depositMethod && ['bitcoin', 'ethereum', 'usdt'].includes(depositMethod) 
                    ? 'Confirm Payment' 
                    : 'Process Payment'
                  }
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Investment Modal */}
        <Dialog open={showInvestModal} onOpenChange={setShowInvestModal}>
          <DialogContent className="max-w-lg bg-card border-border">
            <DialogHeader className="space-y-3">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold text-foreground">
                  Investment Required
                </DialogTitle>
                <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                </div>
              </div>
              <DialogDescription className="text-muted-foreground">
                You need to make a deposit before you can invest in this plan.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Plan Information Card */}
              <Card className="bg-muted/50 border-border">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-semibold text-foreground">
                      {selectedPlan.name}
                    </CardTitle>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                      <Target className="w-3 h-3 mr-1" />
                      Selected Plan
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Minimum Required</p>
                      <p className="text-lg font-bold text-orange-600">
                        ${selectedPlan.minAmount.toLocaleString()}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Your Balance</p>
                      <p className="text-lg font-bold text-green-600">
                        ${userData.totalBalance.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <AlertCircle className="w-4 h-4 text-orange-600" />
                      <span className="font-semibold text-orange-800 dark:text-orange-200">
                        Insufficient Balance
                      </span>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300">
                      You need to deposit at least{' '}
                      <span className="font-bold">
                        ${(selectedPlan.minAmount - userData.totalBalance).toLocaleString()}
                      </span>{' '}
                      more to invest in this plan.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={() => {
                    setShowInvestModal(false);
                    setShowDepositModal(true);
                  }}
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-3 text-lg font-semibold"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Make Deposit Now
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setShowInvestModal(false)}
                  className="w-full py-3 text-lg font-semibold border-border hover:bg-muted"
                >
                  Cancel
                </Button>
              </div>

              {/* Information Footer */}
              <div className="p-4 bg-muted/30 rounded-lg border border-border">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-foreground">Next Steps</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Make a deposit using any supported payment method</p>
                      <p>• Your funds will be available immediately after confirmation</p>
                      <p>• Return to this plan to complete your investment</p>
                      <p>• Start earning returns from day one</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Deposit Methods</p>
                  <p className="text-sm font-semibold text-foreground">4+ Available</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Processing Time</p>
                  <p className="text-sm font-semibold text-foreground">Instant</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Minimum</p>
                  <p className="text-sm font-semibold text-foreground">$100</p>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Dashboard;
