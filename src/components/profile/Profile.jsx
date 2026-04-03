import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Shield, 
  Lock, 
  Key, 
  CheckCircle2, 
  AlertCircle,
  Building,
  GraduationCap,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match!");
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword
      });
      
      toast.success("Password updated successfully!");
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      toast.error(error.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          
          {/* Sidebar Info */}
          <div className="md:w-1/3 bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
            <div className="flex flex-col items-center text-center">
              <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center mb-6 backdrop-blur-sm border-2 border-white/30 shadow-xl">
                <User className="h-16 w-16 text-white" />
              </div>
              <h2 className="text-2xl font-bold mb-1">{user?.firstName} {user?.lastName}</h2>
              <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-medium backdrop-blur-sm mb-6 inline-block">
                {user?.role}
              </span>
              
              <div className="w-full space-y-4 text-left">
                <div className="flex items-center space-x-3 text-white/90">
                  <Mail className="h-5 w-5 opacity-70" />
                  <span className="text-sm truncate">{user?.email}</span>
                </div>
                <div className="flex items-center space-x-3 text-white/90">
                  <Building className="h-5 w-5 opacity-70" />
                  <span className="text-sm">{user?.department}</span>
                </div>
                {user?.studentId && (
                  <div className="flex items-center space-x-3 text-white/90">
                    <GraduationCap className="h-5 w-5 opacity-70" />
                    <span className="text-sm">ID: {user?.studentId}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-12 p-4 bg-white/10 rounded-2xl border border-white/10">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-blue-200 mt-1" />
                <div>
                  <h4 className="text-sm font-bold text-white mb-1 text-left">Security First</h4>
                  <p className="text-xs text-blue-100/70 leading-relaxed text-left">
                    Registered by administrator. We recommend changing your initial password to something unique and secure.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Form Area */}
          <div className="md:w-2/3 p-10 lg:p-14">
            <div className="mb-10">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Account Settings</h3>
              <p className="text-gray-500">Update your password to keep your account secure.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">Current Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    name="currentPassword"
                    required
                    value={passwordData.currentPassword}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                  >
                    {showCurrentPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <Key className="h-5 w-5" />
                    </div>
                    <input
                      type={showNewPassword ? "text" : "password"}
                      name="newPassword"
                      required
                      value={passwordData.newPassword}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">Confirm New Password</label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-blue-500 transition-colors">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      required
                      value={passwordData.confirmPassword}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all outline-none"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transform active:scale-95 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      <Shield className="h-5 w-5" />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>

              <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100 flex items-start space-x-3 mt-8">
                <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  Make sure your new password is at least 8 characters long and contains a mix of letters, numbers, and symbols for better protection.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
