import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Users, 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock,
  ArrowLeft,
  LogOut,
  Eye,
  Download
} from 'lucide-react'
import KycVerification from '@/components/KycVerification'
import CompanyWalletManager from '@/components/CompanyWalletManager'
import SupabaseService from '@/services/supabaseService'

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    pendingKyc: 0,
    verifiedUsers: 0
  })
  const [activeTab, setActiveTab] = useState('kyc')

  useEffect(() => {
    checkAdminAccess()
    loadStats()
  }, [])

  const checkAdminAccess = async () => {
    try {
      // Get current Supabase user
      const currentUser = await SupabaseService.getCurrentUser();
      
      if (!currentUser) {
        navigate('/signin');
        return;
      }
      
      if (currentUser.email !== 'warrenokumu98@gmail.com') {
        alert('Access denied. Admin privileges required.');
        navigate('/dashboard');
        return;
      }

      // Get user profile from Supabase
      const userProfile = await SupabaseService.getUserProfile(currentUser.id);
      
      setUser({
        id: currentUser.id,
        name: `${userProfile.first_name} ${userProfile.last_name}`,
        email: currentUser.email,
        isAdmin: true,
        role: 'admin'
      });
      
      setLoading(false);
    } catch (error) {
      console.error('Error checking admin access:', error);
      navigate('/signin');
    }
  }

  const loadStats = async () => {
    try {
      // Get all users
      const allUsers = await SupabaseService.getAllUsers();
      const totalUsers = allUsers.length;
      
      // Get all KYC documents
      const allKycDocs = await SupabaseService.getAllKycDocuments();
      const pendingKyc = allKycDocs.filter(doc => doc.status === 'pending').length;
      
      // Count verified users (users with approved KYC status)
      const verifiedUsers = allUsers.filter(user => user.kyc_status === 'approved').length;
      
      setStats({
        totalUsers,
        pendingKyc,
        verifiedUsers
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  }

  const handleLogout = async () => {
    try {
      await SupabaseService.signOut();
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if signOut fails, redirect to home page
      navigate('/');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="hover:bg-muted"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-xl font-bold flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Admin Dashboard
                </h1>
                <p className="text-sm text-muted-foreground">KYC Verification & User Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-muted-foreground">Welcome,</p>
                <p className="font-semibold">{user?.name}</p>
                <Badge className="bg-red-100 text-red-800 text-xs">Admin</Badge>
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
        {/* Admin Notice */}
        <Alert className="mb-6 border-blue-200 bg-blue-50">
          <Shield className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Admin Access:</strong> You have administrative privileges. You can review and verify user KYC documents.
          </AlertDescription>
        </Alert>

        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalUsers}</div>
              <p className="text-xs text-muted-foreground">Registered users</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending KYC</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.pendingKyc}</div>
              <p className="text-xs text-muted-foreground">Awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Verified Users</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.verifiedUsers}</div>
              <p className="text-xs text-muted-foreground">
                {stats.totalUsers > 0 ? Math.round((stats.verifiedUsers / stats.totalUsers) * 100) : 0}% verification rate
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tabs */}
        <div className="space-y-6">
          <div className="border-b">
            <nav className="-mb-px flex space-x-8">
              <button 
                onClick={() => setActiveTab('kyc')}
                className={`py-2 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'kyc' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-gray-300'
                }`}
              >
                KYC Verification
              </button>
              <button 
                onClick={() => setActiveTab('wallets')}
                className={`py-2 px-1 text-sm font-medium border-b-2 ${
                  activeTab === 'wallets' 
                    ? 'border-primary text-primary' 
                    : 'border-transparent text-muted-foreground hover:text-muted-foreground hover:border-gray-300'
                }`}
              >
                Wallet Management
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          {activeTab === 'kyc' && (
            <KycVerification onStatsUpdate={loadStats} />
          )}
          
          {activeTab === 'wallets' && (
            <CompanyWalletManager />
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
