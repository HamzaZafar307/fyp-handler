import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import projectService from '../../services/projectService';
import { authService } from '../../services/authService';
import { toast } from 'react-hot-toast';
import { 
  Users, 
  BookOpen, 
  GraduationCap, 
  Building, 
  TrendingUp, 
  AlertTriangle, 
  Settings, 
  Database,
  Plus,
  Edit,
  Eye,
  Download,
  Upload,
  Search,
  Filter,
  BarChart3,
  PieChart,
  Activity,
  Shield,
  Globe,
  Mail,
  Bell,
  Calendar,
  Clock,
  Star,
  Award,
  ChevronRight,
  UserPlus,
  FileText,
  Target
} from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [isEditingDept, setIsEditingDept] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [stats, setStats] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [pendingApprovals, setPendingApprovals] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  
  // User management state
  const [allUsers, setAllUsers] = useState([]);
  const [userSearchTerm, setUserSearchTerm] = useState('');
  const [userLoading, setUserLoading] = useState(false);

  // Form states
  const [projectFormData, setProjectFormData] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    year: new Date().getFullYear(),
    semester: 'Spring',
    departmentId: '',
    difficultyLevel: 'Intermediate'
  });

  const [userFormData, setUserFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'Student',
    departmentId: ''
  });

  const [deptFormData, setDeptFormData] = useState({
    id: null,
    name: '',
    code: '',
    description: ''
  });

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        const [statsData, deptsData, pendingData] = await Promise.all([
          projectService.getDashboardStats(),
          projectService.getDepartments(),
          projectService.getPendingProjects()
        ]);

        setStats(statsData);
        setDepartments(deptsData || []);
        setPendingApprovals(pendingData || []);
        
        if (deptsData && deptsData.length > 0) {
          setProjectFormData(prev => ({ ...prev, departmentId: deptsData[0].id }));
          setUserFormData(prev => ({ ...prev, departmentId: deptsData[0].id }));
        }

        // Mocking recent activities based on fetched data for now
        const activities = [
          { id: 1, action: 'System check completed', user: 'System', details: 'All services operational', time: 'Just now', type: 'system' }
        ];
        if (pendingData && pendingData.length > 0) {
          activities.push({
            id: 2,
            action: 'New project proposal',
            user: pendingData[0].supervisorName || 'Faculty',
            details: pendingData[0].title,
            time: 'Recently',
            type: 'project'
          });
        }
        setRecentActivities(activities);

      } catch (err) {
        console.error("Failed to fetch admin data", err);
        setError("Could not load administrative data.");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  useEffect(() => {
    if (activeTab === 'users' && allUsers.length === 0) {
      const fetchUsers = async () => {
        try {
          setUserLoading(true);
          const users = await authService.getAllUsers();
          setAllUsers(users || []);
        } catch (err) {
          console.error("Failed to fetch users", err);
          toast.error("Could not load users.");
        } finally {
          setUserLoading(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab, allUsers.length]);

  const filteredUsers = allUsers.filter(u => 
    u.firstName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.lastName?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
    (u.studentId && u.studentId.toLowerCase().includes(userSearchTerm.toLowerCase()))
  );

  const handleCreateProject = async () => {
    try {
      const payload = {
        ...projectFormData,
        supervisorId: user.id, // Admin creating project
        studentIds: []
      };
      await projectService.createProject(payload);
      setShowCreateModal(false);
      // Refresh pending
      const pending = await projectService.getPendingProjects();
      setPendingApprovals(pending || []);
      alert("Project created successfully!");
    } catch (err) {
      alert("Failed to create project: " + err.message);
    }
  };

  const handleAddUser = async () => {
    try {
      // Find department name for the mock fallback if needed
      const dept = departments.find(d => d.id === parseInt(userFormData.departmentId));
      const payload = {
        ...userFormData,
        department: dept ? dept.name : 'Unknown'
      };
      await authService.adminAddUser(payload);
      setShowUserModal(false);
      setUserFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'Student',
        departmentId: departments[0]?.id || ''
      });
      alert("User added successfully!");
      
      // Refresh user list
      const users = await authService.getAllUsers();
      setAllUsers(users || []);
    } catch (err) {
      alert("Failed to add user: " + err.message);
    }
  };

  const handleEditClick = (u) => {
    setEditingUser({
      ...u,
      departmentId: departments.find(d => d.name === u.department)?.id || departments[0]?.id || ''
    });
    setShowEditModal(true);
  };

  const handleUpdateUser = async () => {
    try {
      const dept = departments.find(d => d.id === parseInt(editingUser.departmentId));
      const payload = {
        firstName: editingUser.firstName,
        lastName: editingUser.lastName,
        email: editingUser.email,
        role: editingUser.role,
        department: dept ? dept.name : editingUser.department,
        studentId: editingUser.studentId || ''
      };
      
      await authService.updateUser(editingUser.id, payload);
      setShowEditModal(false);
      toast.success("User updated successfully!");
      
      // Refresh user list
      const users = await authService.getAllUsers();
      setAllUsers(users || []);
    } catch (err) {
      toast.error("Failed to update user: " + err.message);
    }
  };

  const handleSuspendUser = async (userId) => {
    if (!window.confirm("Are you sure you want to toggle this user's active status?")) return;
    
    try {
      await authService.suspendUser(userId);
      toast.success("User status updated!");
      
      // Refresh user list
      const users = await authService.getAllUsers();
      setAllUsers(users || []);
    } catch (err) {
      toast.error("Failed to update user status");
    }
  };

  const handleCreateDepartment = async () => {
    try {
      if (isEditingDept) {
        await projectService.updateDepartment(deptFormData.id, deptFormData);
        toast.success("Department updated successfully!");
      } else {
        await projectService.createDepartment(deptFormData);
        toast.success("Department created successfully!");
      }
      
      setShowDeptModal(false);
      
      // Refresh department list
      const depts = await projectService.getDepartments();
      setDepartments(depts || []);
    } catch (err) {
      toast.error(`Failed to ${isEditingDept ? 'update' : 'create'} department: ${err.message}`);
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    
    try {
      await projectService.deleteDepartment(id);
      toast.success("Department deleted successfully!");
      
      // Refresh department list
      const depts = await projectService.getDepartments();
      setDepartments(depts || []);
    } catch (err) {
      toast.error("Failed to delete department");
    }
  };

  const handleEditDeptClick = (dept) => {
    setDeptFormData({
      id: dept.id,
      name: dept.name,
      code: dept.code,
      description: dept.description || ''
    });
    setIsEditingDept(true);
    setShowDeptModal(true);
  };

  const handleApproveProject = async (projectId) => {
    try {
      // In a real app, we'd have an approve endpoint
      // For now, we update status to InProgress
      await projectService.updateProject(projectId, { status: projectService.Status.InProgress }); // Move to InProgress status
      setPendingApprovals(prev => prev.filter(p => p.id !== projectId));
      alert("Project approved!");
    } catch (err) {
      alert("Failed to approve project");
    }
  };

  const systemStats = [
    { 
      name: 'Total Projects', 
      value: stats?.totalProjects || '0', 
      icon: BookOpen, 
      color: 'bg-blue-500', 
      change: 'Active and proposed',
      trend: 'up',
      percentage: 12
    },
    { 
      name: 'Active Students', 
      value: stats?.totalStudents || '0', 
      icon: GraduationCap, 
      color: 'bg-green-500', 
      change: 'Registered users',
      trend: 'up',
      percentage: 8
    },
    { 
      name: 'Faculty Members', 
      value: stats?.totalTeachers || '0', 
      icon: Users, 
      color: 'bg-purple-500', 
      change: `${departments.length} departments`,
      trend: 'neutral',
      percentage: 5
    },
    { 
      name: 'System Health', 
      value: '99.9%', 
      icon: Activity, 
      color: 'bg-orange-500', 
      change: 'All systems go',
      trend: 'up',
      percentage: 0
    },
  ];

  const systemMetrics = [
    { label: 'Projects Completed', value: stats?.completedProjects || 0, total: stats?.totalProjects || 100, color: 'bg-green-500' },
    { label: 'Proposed Projects', value: pendingApprovals.length, total: stats?.totalProjects || 100, color: 'bg-blue-500' },
    { label: 'System Uptime', value: 99.8, total: 100, color: 'bg-emerald-500' }
  ];

  const quickActions = [
    { 
      name: 'Create New Project', 
      icon: Plus, 
      color: 'bg-blue-500', 
      action: () => setShowCreateModal(true) 
    },
    { 
      name: 'Add User', 
      icon: UserPlus, 
      color: 'bg-green-500', 
      action: () => setShowUserModal(true) 
    },
    { 
      name: 'System Settings', 
      icon: Settings, 
      color: 'bg-purple-500', 
      action: () => setActiveTab('settings') 
    },
    { 
      name: 'Generate Report', 
      icon: FileText, 
      color: 'bg-orange-500', 
      action: () => {} 
    }
  ];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading Admin Dashboard...</div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  System Dashboard 🛡️
                </h1>
                <p className="text-xl text-gray-600">
                  Welcome {user?.firstName}, manage and oversee the entire FYP ecosystem.
                </p>
              </div>
              <div className="mt-4 sm:mt-0 flex gap-3">
                <button 
                  onClick={() => setShowUserModal(true)}
                  className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Add User
                </button>
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  New Project
                </button>
              </div>
            </div>
          </div>

          {/* System Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 animate-slide-up">
            {systemStats.map((item) => (
              <div key={item.name} className="bg-white overflow-hidden shadow-lg rounded-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100">
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className={`${item.color} p-4 rounded-xl shadow-lg`}>
                        <item.icon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">
                          {item.name}
                        </dt>
                        <dd className="flex items-baseline">
                          <div className="text-3xl font-bold text-gray-900">
                            {item.value}
                          </div>
                        </dd>
                        <dd className="text-sm text-gray-600 mt-1">
                          {item.change}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8 animate-slide-up-delay">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'System Overview', icon: Activity },
                  { id: 'departments', name: 'Departments', icon: Building },
                  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                  { id: 'users', name: 'User Management', icon: Users },
                  { id: 'settings', name: 'System Settings', icon: Settings }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <tab.icon className={`mr-2 h-5 w-5 ${
                      activeTab === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                    }`} />
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fade-in-up">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                  {/* System Performance Metrics */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">System Performance</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {systemMetrics.map((metric, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-sm font-medium text-gray-700">{metric.label}</span>
                            <span className="text-lg font-bold text-gray-900">
                              {metric.total === 100 ? `${metric.value}%` : `${metric.value}/${metric.total}`}
                            </span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className={`${metric.color} h-3 rounded-full transition-all duration-700`}
                              style={{ width: `${(metric.value / metric.total) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Project Distribution Chart Placeholder */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Project Status Breakdown</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-4">
                        {[
                          { status: 'InProgress', count: stats?.activeProjects || 0, color: 'bg-blue-500' },
                          { status: 'Completed', count: stats?.completedProjects || 0, color: 'bg-green-500' },
                          { status: 'Proposed', count: pendingApprovals.length, color: 'bg-yellow-500' }
                        ].map((item, index) => (
                          <div key={index}>
                            <div className="flex justify-between items-center mb-2">
                              <div className="flex items-center">
                                <div className={`w-4 h-4 ${item.color} rounded-full mr-3`}></div>
                                <span className="text-sm font-medium text-gray-700">{item.status}</span>
                              </div>
                              <span className="text-sm text-gray-500">{item.count}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className={`${item.color} h-2 rounded-full transition-all duration-700`}
                                style={{ width: `${stats?.totalProjects ? (item.count / stats.totalProjects) * 100 : 0}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Recent Activities */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">Recent Activities</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4 max-h-64 overflow-y-auto">
                        {recentActivities.map((activity) => (
                          <div key={activity.id} className="flex items-start space-x-3">
                            <div className={`flex-shrink-0 w-2 h-2 mt-2 rounded-full ${
                              activity.type === 'project' ? 'bg-blue-500' : 'bg-gray-500'
                            }`}></div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900">
                                <span className="font-medium">{activity.user}</span> {activity.action}
                              </p>
                              <p className="text-xs text-gray-500">{activity.details}</p>
                              <p className="text-xs text-gray-400">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Pending Approvals */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900">Pending Approvals</h3>
                        <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {pendingApprovals.length}
                        </span>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {pendingApprovals.map((approval) => (
                          <div key={approval.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-2">
                              <h4 className="font-semibold text-gray-900 text-sm">{approval.title}</h4>
                            </div>
                            <p className="text-xs text-gray-600 mb-2">
                              <span className="font-medium">By:</span> {approval.supervisorName}
                            </p>
                            <div className="flex gap-2 mt-3">
                              <button 
                                onClick={() => handleApproveProject(approval.id)}
                                className="text-xs bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                              >
                                Approve
                              </button>
                              <button className="text-xs bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors">
                                Reject
                              </button>
                            </div>
                          </div>
                        ))}
                        {pendingApprovals.length === 0 && (
                          <p className="text-center text-gray-500 text-sm py-4">No pending approvals</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                      <div className="grid grid-cols-2 gap-3">
                        {quickActions.map((action, index) => (
                          <button
                            key={index}
                            onClick={action.action}
                            className="flex flex-col items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-blue-300 group"
                          >
                            <div className={`${action.color} p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform`}>
                              <action.icon className="h-5 w-5 text-white" />
                            </div>
                            <span className="text-xs font-semibold text-gray-900 text-center">{action.name}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'departments' && (
              <div className="space-y-6">
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Department Overview</h2>
                      <div className="flex gap-3">
                        <button 
                          onClick={() => {
                            setDeptFormData({ id: null, name: '', code: '', description: '' });
                            setIsEditingDept(false);
                            setShowDeptModal(true);
                          }}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Add Department
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {departments.map((dept, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <Building className="h-5 w-5 text-gray-400 mr-3" />
                                <div className="text-sm font-medium text-gray-900">{dept.name}</div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            </td>
                             <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                               <button 
                                 onClick={() => handleEditDeptClick(dept)}
                                 className="text-green-600 hover:text-green-900 mr-2"
                               >
                                 <Edit className="h-4 w-4" />
                               </button>
                               <button 
                                 onClick={() => handleDeleteDepartment(dept.id)}
                                 className="text-red-600 hover:text-red-900"
                               >
                                 <AlertTriangle className="h-4 w-4" />
                               </button>
                             </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <h2 className="text-2xl font-bold text-gray-900">User Management</h2>
                      <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input 
                          type="text" 
                          placeholder="Search by name, email or student ID..."
                          value={userSearchTerm}
                          onChange={(e) => setUserSearchTerm(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                        />
                      </div>
                    </div>
                  </div>
                  
                  {userLoading ? (
                    <div className="p-12 text-center text-gray-500">Loading users...</div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID / Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {filteredUsers.map((u, index) => (
                            <tr key={u.id || index} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="h-10 w-10 flex-shrink-0 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                                    {u.firstName[0]}{u.lastName[0]}
                                  </div>
                                  <div className="ml-4">
                                    <div className="text-sm font-bold text-gray-900">{u.firstName} {u.lastName}</div>
                                    <div className="text-xs text-gray-500">{u.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                  u.role === 'Admin' ? 'bg-purple-100 text-purple-800' :
                                  u.role === 'Teacher' ? 'bg-blue-100 text-blue-800' :
                                  'bg-green-100 text-green-800'
                                }`}>
                                  {u.role}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {u.department || 'N/A'}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {u.studentId || u.email}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <button 
                                  onClick={() => handleEditClick(u)}
                                  className="text-blue-600 hover:text-blue-900 mr-4 font-semibold"
                                >
                                  Edit
                                </button>
                                <button 
                                  onClick={() => handleSuspendUser(u.id)}
                                  className="text-red-600 hover:text-red-900 font-semibold"
                                >
                                  Suspend
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      {filteredUsers.length === 0 && (
                        <div className="p-12 text-center text-gray-500 font-medium">
                          No users found matching your search.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other tabs can be implemented similarly with real data */}
            {(activeTab === 'analytics' || activeTab === 'settings') && (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-12 text-center">
                <Settings className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">Interface Under Development</h3>
                <p className="text-gray-500">The {activeTab} management interface is being integrated with backend services.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Create New Project</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Title</label>
                <input 
                  type="text" 
                  value={projectFormData.title}
                  onChange={(e) => setProjectFormData({...projectFormData, title: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    value={projectFormData.departmentId}
                    onChange={(e) => setProjectFormData({...projectFormData, departmentId: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select 
                    value={projectFormData.category}
                    onChange={(e) => setProjectFormData({...projectFormData, category: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Web Development</option>
                    <option>Mobile Development</option>
                    <option>Machine Learning</option>
                    <option>Data Science</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows="3" 
                  value={projectFormData.description}
                  onChange={(e) => setProjectFormData({...projectFormData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateProject}
                disabled={!projectFormData.title}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                Create Project
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Add New User</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={userFormData.firstName}
                    onChange={(e) => setUserFormData({...userFormData, firstName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={userFormData.lastName}
                    onChange={(e) => setUserFormData({...userFormData, lastName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={userFormData.email}
                  onChange={(e) => setUserFormData({...userFormData, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input 
                  type="password" 
                  value={userFormData.password}
                  onChange={(e) => setUserFormData({...userFormData, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="Minimum 6 characters"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select 
                    value={userFormData.role}
                    onChange={(e) => setUserFormData({...userFormData, role: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    value={userFormData.departmentId}
                    onChange={(e) => setUserFormData({...userFormData, departmentId: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowUserModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddUser}
                disabled={!userFormData.email || !userFormData.firstName || userFormData.password.length < 6}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                Add User
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Edit User</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    value={editingUser.firstName}
                    onChange={(e) => setEditingUser({...editingUser, firstName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    value={editingUser.lastName}
                    onChange={(e) => setEditingUser({...editingUser, lastName: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input 
                  type="email" 
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select 
                    value={editingUser.role}
                    onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option>Student</option>
                    <option>Teacher</option>
                    <option>Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select 
                    value={editingUser.departmentId}
                    onChange={(e) => setEditingUser({...editingUser, departmentId: parseInt(e.target.value)})}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleUpdateUser}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
       {/* Department Modal */}
      {showDeptModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              {isEditingDept ? 'Edit Department' : 'Add New Department'}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Name</label>
                <input 
                  type="text" 
                  value={deptFormData.name}
                  onChange={(e) => setDeptFormData({...deptFormData, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. Computer Science"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Department Code</label>
                <input 
                  type="text" 
                  value={deptFormData.code}
                  onChange={(e) => setDeptFormData({...deptFormData, code: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
                  placeholder="e.g. CS"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea 
                  rows="3" 
                  value={deptFormData.description}
                  onChange={(e) => setDeptFormData({...deptFormData, description: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Optional description"
                ></textarea>
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowDeptModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleCreateDepartment}
                disabled={!deptFormData.name || !deptFormData.code}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-semibold"
              >
                {isEditingDept ? 'Save Changes' : 'Create Department'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;