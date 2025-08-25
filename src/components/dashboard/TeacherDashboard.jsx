import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  AlertCircle, 
  Calendar, 
  FileText, 
  TrendingUp,
  Plus,
  Eye,
  Edit,
  MessageSquare,
  Clock,
  Star,
  Award,
  BarChart3,
  PieChart,
  Activity,
  Filter,
  Download,
  GraduationCap,
  Target,
  Lightbulb,
  ChartBar
} from 'lucide-react';

const TeacherDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateModal, setShowCreateModal] = useState(false);

  const stats = [
    { 
      name: 'Supervised FYPs', 
      value: '45', 
      icon: BookOpen, 
      color: 'bg-blue-500', 
      change: '+8 this year',
      trend: 'up'
    },
    { 
      name: 'Active Students', 
      value: '72', 
      icon: Users, 
      color: 'bg-green-500', 
      change: '24 teams total',
      trend: 'up'
    },
    { 
      name: 'Completed FYPs', 
      value: '156', 
      icon: CheckCircle, 
      color: 'bg-purple-500', 
      change: 'Since 2018',
      trend: 'up'
    },
    { 
      name: 'Success Rate', 
      value: '94%', 
      icon: TrendingUp, 
      color: 'bg-orange-500', 
      change: 'A grade or above',
      trend: 'up'
    },
  ];

  const currentFYPs = [
    {
      id: 1,
      title: 'Smart Campus Energy Management System',
      students: ['Ahmed Ali', 'Sara Khan', 'Hassan Malik'],
      status: 'In Progress',
      progress: 75,
      lastUpdate: '2025-01-20',
      category: 'IoT & Smart Systems',
      nextMeeting: '2025-01-25',
      semester: 'Spring 2025',
      challenges: ['Hardware integration delays', 'Data visualization complexity'],
      recentSubmissions: ['Literature Review', 'System Architecture'],
      grade: 'A-',
      expectedGrade: 'A',
      riskLevel: 'low'
    },
    {
      id: 2,
      title: 'AI-Powered Fake News Detection',
      students: ['Fatima Ahmed', 'Usman Sheikh'],
      status: 'Review Required',
      progress: 85,
      lastUpdate: '2025-01-22',
      category: 'Machine Learning',
      nextMeeting: '2025-01-24',
      semester: 'Spring 2025',
      challenges: ['Model accuracy improvement needed', 'Dataset bias issues'],
      recentSubmissions: ['ML Model Implementation', 'Testing Results'],
      grade: 'A',
      expectedGrade: 'A+',
      riskLevel: 'medium'
    },
    {
      id: 3,
      title: 'Blockchain-based Supply Chain Tracking',
      students: ['Ali Hassan', 'Zara Noor', 'Omar Farooq'],
      status: 'Planning',
      progress: 45,
      lastUpdate: '2025-01-18',
      category: 'Blockchain',
      nextMeeting: '2025-01-26',
      semester: 'Spring 2025',
      challenges: ['Smart contract complexity', 'Industry partnership needed'],
      recentSubmissions: ['Project Proposal', 'Technical Specifications'],
      grade: 'B+',
      expectedGrade: 'A-',
      riskLevel: 'high'
    }
  ];

  const completedFYPs = [
    {
      id: 1,
      title: 'AR Navigation System for Campus',
      students: ['Ahmad Hassan', 'Fatima Khan'],
      year: '2024',
      semester: 'Spring',
      finalGrade: 'A+',
      category: 'Mobile Development',
      outcome: 'Successfully deployed university-wide',
      citations: 12,
      impact: 'High'
    },
    {
      id: 2,
      title: 'Mental Health AI Assistant',
      students: ['Ayesha Siddique', 'Omar Farooq'],
      year: '2023',
      semester: 'Spring',
      finalGrade: 'A+',
      category: 'Machine Learning',
      outcome: 'Published in IEEE conference, 500+ active users',
      citations: 8,
      impact: 'High'
    },
    {
      id: 3,
      title: 'Smart Traffic Management IoT',
      students: ['Bilal Khan', 'Saba Noor', 'Hamza Ali'],
      year: '2023',
      semester: 'Fall',
      finalGrade: 'A',
      category: 'IoT & Embedded',
      outcome: 'Implemented at 5 city intersections',
      citations: 5,
      impact: 'Medium'
    }
  ];

  const upcomingMeetings = [
    {
      id: 1,
      title: 'Weekly Progress Review - Energy Management',
      time: '10:00 AM',
      date: 'Today',
      students: ['Ahmed Ali', 'Sara Khan', 'Hassan Malik'],
      type: 'progress',
      duration: '1 hour',
      agenda: ['Hardware integration update', 'Data visualization demo', 'Next week planning']
    },
    {
      id: 2,
      title: 'Fake News Detection - Model Review',
      time: '2:00 PM',
      date: 'Tomorrow',
      students: ['Fatima Ahmed', 'Usman Sheikh'],
      type: 'technical',
      duration: '45 mins',
      agenda: ['Model accuracy analysis', 'Dataset bias discussion', 'Performance optimization']
    },
    {
      id: 3,
      title: 'Blockchain Project - Industry Meeting',
      time: '3:30 PM',
      date: 'Jan 26',
      students: ['Ali Hassan', 'Zara Noor', 'Omar Farooq'],
      type: 'external',
      duration: '2 hours',
      agenda: ['Industry requirements review', 'Partnership discussion', 'Timeline adjustment']
    }
  ];

  const researchInsights = [
    {
      category: 'Machine Learning',
      projects: 18,
      avgGrade: 'A-',
      successRate: '95%',
      trendingTopics: ['NLP', 'Computer Vision', 'Deep Learning'],
      challenges: ['Data quality', 'Model interpretability', 'Computational resources']
    },
    {
      category: 'Web Development',
      projects: 24,
      avgGrade: 'A',
      successRate: '92%',
      trendingTopics: ['React', 'Node.js', 'Cloud Computing'],
      challenges: ['Scalability', 'Security', 'User experience']
    },
    {
      category: 'IoT & Embedded',
      projects: 15,
      avgGrade: 'A-',
      successRate: '90%',
      trendingTopics: ['Smart Cities', 'Industry 4.0', 'Edge Computing'],
      challenges: ['Hardware costs', 'Connectivity', 'Power management']
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Review Required': return 'bg-orange-100 text-orange-800';
      case 'Planning': return 'bg-yellow-100 text-yellow-800';
      case 'Completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'high': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">
                  Welcome, Prof. {user?.lastName}! 👨‍🏫
                </h1>
                <p className="text-xl text-gray-600">
                  Supervise and track FYP progress with comprehensive analytics and insights.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <button 
                  onClick={() => setShowCreateModal(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Propose New FYP
                </button>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8 animate-slide-up">
            {stats.map((item) => (
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
                  { id: 'overview', name: 'Overview', icon: Activity },
                  { id: 'current', name: 'Current FYPs', icon: BookOpen },
                  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
                  { id: 'history', name: 'Completed FYPs', icon: CheckCircle },
                  { id: 'meetings', name: 'Meetings', icon: Calendar }
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
                  {/* Current FYPs Overview */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">Current FYPs</h2>
                        <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                          View All →
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-100">
                      {currentFYPs.slice(0, 3).map((project) => (
                        <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 
                                className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
                                onClick={() => navigate(`/project/${project.id}`)}
                              >
                                {project.title}
                              </h3>
                              <div className="flex items-center text-sm text-gray-600 mb-2">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{project.students.join(', ')}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRiskColor(project.riskLevel)}`}>
                                {project.riskLevel} risk
                              </span>
                            </div>
                          </div>
                          
                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-1">
                              <span>Progress</span>
                              <span>{project.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                style={{ width: `${project.progress}%` }}
                              ></div>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Next meeting: {project.nextMeeting}</span>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(project.grade)}`}>
                                Current: {project.grade}
                              </span>
                              <span className="text-gray-400">→</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(project.expectedGrade)}`}>
                                Expected: {project.expectedGrade}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Research Insights */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Research Domain Insights</h3>
                    <div className="space-y-6">
                      {researchInsights.map((domain, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-gray-900">{domain.category}</h4>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-gray-600">{domain.projects} projects</span>
                              <span className="text-green-600 font-medium">{domain.successRate}</span>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Trending Topics</p>
                              <div className="flex flex-wrap gap-1">
                                {domain.trendingTopics.map((topic, i) => (
                                  <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full">
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div>
                              <p className="text-sm text-gray-600 mb-1">Common Challenges</p>
                              <div className="text-xs text-gray-500">
                                {domain.challenges.slice(0, 2).join(', ')}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Upcoming Meetings */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">Upcoming Meetings</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-4">
                        {upcomingMeetings.map((meeting) => (
                          <div key={meeting.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <h4 className="font-semibold text-gray-900 mb-2 text-sm">{meeting.title}</h4>
                            <div className="space-y-1 text-xs text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {meeting.date} at {meeting.time}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                Duration: {meeting.duration}
                              </div>
                              <div className="flex items-center">
                                <Users className="h-3 w-3 mr-1" />
                                {meeting.students.join(', ')}
                              </div>
                            </div>
                            <div className="mt-2">
                              <p className="text-xs text-gray-500">Agenda: {meeting.agenda.slice(0, 2).join(', ')}</p>
                            </div>
                          </div>
                        ))}
                        <button className="w-full text-center py-3 text-blue-600 hover:text-blue-800 text-sm font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                          Schedule New Meeting →
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                      <h3 className="text-lg font-bold text-gray-900">Quick Actions</h3>
                    </div>
                    <div className="p-6">
                      <div className="space-y-3">
                        <button className="w-full flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-blue-300 group">
                          <FileText className="h-5 w-5 text-blue-500 mr-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold text-gray-900">Review Submissions</span>
                        </button>
                        <button className="w-full flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-green-300 group">
                          <Lightbulb className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold text-gray-900">Suggest FYP Ideas</span>
                        </button>
                        <button className="w-full flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-purple-300 group">
                          <Download className="h-5 w-5 text-purple-500 mr-3 group-hover:scale-110 transition-transform" />
                          <span className="text-sm font-semibold text-gray-900">Generate Reports</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'current' && (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Current FYPs ({currentFYPs.length})</h2>
                    <div className="flex gap-3">
                      <button className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Filter className="h-4 w-4 mr-2" />
                        Filter
                      </button>
                      <button 
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New FYP
                      </button>
                    </div>
                  </div>
                </div>
                <div className="divide-y divide-gray-100">
                  {currentFYPs.map((project) => (
                    <div key={project.id} className="p-8 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <h3 
                              className="text-xl font-bold text-gray-900 hover:text-blue-600 cursor-pointer transition-colors"
                              onClick={() => navigate(`/project/${project.id}`)}
                            >
                              {project.title}
                            </h3>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                              {project.status}
                            </span>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getRiskColor(project.riskLevel)}`}>
                              {project.riskLevel} risk
                            </span>
                          </div>
                          <div className="flex items-center text-gray-600 text-sm mb-4">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Team:</span>
                            <span className="ml-1">{project.students.join(', ')}</span>
                            <span className="mx-3">•</span>
                            <GraduationCap className="h-4 w-4 mr-1" />
                            <span>{project.semester}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                            <Eye className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-green-500 transition-colors">
                            <Edit className="h-5 w-5" />
                          </button>
                          <button className="p-2 text-gray-400 hover:text-purple-500 transition-colors">
                            <MessageSquare className="h-5 w-5" />
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Progress</div>
                          <div className="flex items-center">
                            <div className="flex-1 mr-3">
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Current Grade</div>
                          <div className="flex items-center gap-2">
                            <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(project.grade)}`}>
                              {project.grade}
                            </span>
                            <span className="text-gray-400">→</span>
                            <span className={`px-2 py-1 rounded text-sm font-medium ${getGradeColor(project.expectedGrade)}`}>
                              {project.expectedGrade}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Next Meeting</div>
                          <div className="text-sm font-medium text-gray-900">
                            {project.nextMeeting}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Recent Submissions</div>
                          <div className="space-y-1">
                            {project.recentSubmissions.map((submission, i) => (
                              <div key={i} className="flex items-center text-sm text-gray-700">
                                <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                                {submission}
                              </div>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Current Challenges</div>
                          <div className="space-y-1">
                            {project.challenges.map((challenge, i) => (
                              <div key={i} className="flex items-center text-sm text-gray-700">
                                <AlertCircle className="h-3 w-3 text-orange-500 mr-2" />
                                {challenge}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-sm text-gray-500 pt-4 border-t border-gray-200">
                        <span>Last updated: {project.lastUpdate}</span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {project.category}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Success Rate Analytics */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Success Rate by Category</h3>
                    <div className="space-y-4">
                      {[
                        { category: 'Machine Learning', rate: 95, projects: 18, avgGrade: 'A-' },
                        { category: 'Web Development', rate: 92, projects: 24, avgGrade: 'A' },
                        { category: 'IoT & Embedded', rate: 90, projects: 15, avgGrade: 'A-' },
                        { category: 'Mobile Development', rate: 88, projects: 12, avgGrade: 'B+' }
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">{item.category}</span>
                            <div className="flex items-center gap-3 text-sm">
                              <span className="text-gray-500">{item.projects} projects</span>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getGradeColor(item.avgGrade)}`}>
                                Avg: {item.avgGrade}
                              </span>
                              <span className="text-green-600 font-medium">{item.rate}%</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-green-500 h-3 rounded-full transition-all duration-700"
                              style={{ width: `${item.rate}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Student Performance */}
                  <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-6">Student Performance Distribution</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-4 bg-green-50 rounded-xl">
                          <div className="text-2xl font-bold text-green-600">A+ & A</div>
                          <div className="text-sm text-gray-600">68% of students</div>
                        </div>
                        <div className="text-center p-4 bg-blue-50 rounded-xl">
                          <div className="text-2xl font-bold text-blue-600">A- & B+</div>
                          <div className="text-sm text-gray-600">26% of students</div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { grade: 'A+', count: 28, percentage: 39 },
                          { grade: 'A', count: 21, percentage: 29 },
                          { grade: 'A-', count: 12, percentage: 17 },
                          { grade: 'B+', count: 7, percentage: 10 },
                          { grade: 'B', count: 4, percentage: 5 }
                        ].map((item, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center">
                              <span className={`px-3 py-1 rounded font-medium text-sm ${getGradeColor(item.grade)}`}>
                                {item.grade}
                              </span>
                              <span className="ml-3 text-sm text-gray-600">{item.count} students</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">{item.percentage}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Yearly Trends */}
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Supervision Trends Over Years</h3>
                  <div className="h-64 flex items-end justify-between space-x-2">
                    {[
                      { year: '2020', projects: 8, success: 85 },
                      { year: '2021', projects: 12, success: 88 },
                      { year: '2022', projects: 15, success: 91 },
                      { year: '2023', projects: 18, success: 93 },
                      { year: '2024', projects: 22, success: 95 }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center flex-1">
                        <div className="relative w-full">
                          <div 
                            className="w-full bg-blue-500 rounded-t transition-all duration-700 hover:bg-blue-600"
                            style={{ height: `${(item.projects / 25) * 200}px` }}
                          ></div>
                          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-xs font-medium text-gray-700">
                            {item.projects}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-600">{item.year}</div>
                        <div className="text-xs text-green-600 font-medium">{item.success}%</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 text-center text-sm text-gray-500">
                    Projects supervised per year with success rates
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'history' && (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <h2 className="text-2xl font-bold text-gray-900">Completed FYPs ({completedFYPs.length})</h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {completedFYPs.map((project) => (
                    <div key={project.id} className="p-8 hover:bg-gray-50 transition-colors">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 
                            className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
                            onClick={() => navigate(`/project/${project.id}`)}
                          >
                            {project.title}
                          </h3>
                          <div className="flex items-center text-gray-600 text-sm mb-3">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Students:</span>
                            <span className="ml-1">{project.students.join(', ')}</span>
                            <span className="mx-3">•</span>
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{project.semester} {project.year}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(project.finalGrade)}`}>
                            {project.finalGrade}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            project.impact === 'High' ? 'bg-green-100 text-green-800' :
                            project.impact === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.impact} Impact
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="text-sm text-gray-600 mb-2">Outcome & Impact</div>
                          <p className="text-sm text-gray-700">{project.outcome}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-600 mb-1">Citations</div>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 mr-1" />
                              <span className="font-medium">{project.citations}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600 mb-1">Category</div>
                            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                              {project.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'meetings' && (
              <div className="space-y-6">
                <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="px-8 py-6 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h2 className="text-2xl font-bold text-gray-900">Meeting Schedule</h2>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Meeting
                      </button>
                    </div>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {upcomingMeetings.map((meeting) => (
                      <div key={meeting.id} className="p-8 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                              {meeting.title}
                            </h3>
                            <div className="space-y-2 text-sm text-gray-600">
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2" />
                                <span>{meeting.date} at {meeting.time}</span>
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2" />
                                <span>Duration: {meeting.duration}</span>
                              </div>
                              <div className="flex items-center">
                                <Users className="h-4 w-4 mr-2" />
                                <span>Attendees: {meeting.students.join(', ')}</span>
                              </div>
                            </div>
                            <div className="mt-3">
                              <div className="text-sm text-gray-600 mb-1">Agenda:</div>
                              <ul className="text-sm text-gray-700 space-y-1">
                                {meeting.agenda.map((item, i) => (
                                  <li key={i} className="flex items-start">
                                    <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                    {item}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                              meeting.type === 'progress' ? 'bg-blue-100 text-blue-800' :
                              meeting.type === 'technical' ? 'bg-green-100 text-green-800' :
                              'bg-purple-100 text-purple-800'
                            }`}>
                              {meeting.type}
                            </span>
                            <button className="p-2 text-gray-400 hover:text-blue-500 transition-colors">
                              <Edit className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Create FYP Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-lg w-full mx-4 animate-slide-up">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Propose New FYP</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">FYP Title</label>
                <input type="text" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option>Web Development</option>
                  <option>Mobile Development</option>
                  <option>Machine Learning</option>
                  <option>IoT & Embedded</option>
                  <option>Blockchain</option>
                  <option>Data Science</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea rows="3" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                <input type="text" placeholder="e.g., React, Python, Machine Learning" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Propose FYP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeacherDashboard;