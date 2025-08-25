import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  Clock, 
  Search, 
  Filter,
  Star,
  Calendar,
  User,
  Building,
  ChevronDown,
  SlidersHorizontal,
  Heart,
  Eye,
  MapPin,
  GraduationCap,
  Download,
  ExternalLink,
  Award,
  Code,
  FileText
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [selectedTechStack, setSelectedTechStack] = useState([]);
  const [sortBy, setSortBy] = useState('relevance');

  const stats = [
    { 
      name: 'Total FYPs', 
      value: '2,847', 
      icon: BookOpen, 
      color: 'bg-blue-500', 
      change: 'From 2015-2024',
      trend: 'up'
    },
    { 
      name: 'Saved FYPs', 
      value: '12', 
      icon: Heart, 
      color: 'bg-pink-500', 
      change: 'Your bookmarks',
      trend: 'up'
    },
    { 
      name: 'Search History', 
      value: '23', 
      icon: Clock, 
      color: 'bg-purple-500', 
      change: 'Recent searches',
      trend: 'neutral'
    },
    { 
      name: 'Similar Ideas', 
      value: '5', 
      icon: TrendingUp, 
      color: 'bg-orange-500', 
      change: 'To your concept',
      trend: 'neutral'
    },
  ];

  const categories = [
    { id: 'all', name: 'All Categories', count: 2847 },
    { id: 'web', name: 'Web Development', count: 756 },
    { id: 'mobile', name: 'Mobile Development', count: 523 },
    { id: 'ml', name: 'Machine Learning/AI', count: 412 },
    { id: 'data', name: 'Data Science', count: 298 },
    { id: 'blockchain', name: 'Blockchain', count: 187 },
    { id: 'iot', name: 'IoT & Embedded', count: 234 },
    { id: 'game', name: 'Game Development', count: 156 },
    { id: 'security', name: 'Cybersecurity', count: 143 },
    { id: 'other', name: 'Other', count: 139 }
  ];

  const techStacks = ['React', 'Node.js', 'Python', 'Flutter', 'Django', 'MongoDB', 'PostgreSQL', 'TensorFlow', 'Unity', 'Blockchain', 'IoT', 'Java', 'C++', 'Swift', 'Kotlin'];

  // Previous FYPs from senior batches
  const completedFYPs = [
    {
      id: 1,
      title: 'Smart Campus Navigation System using AR',
      students: ['Ahmad Hassan', 'Fatima Khan'],
      supervisor: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      category: 'Mobile Development',
      batch: '2024',
      techStack: ['Unity', 'ARCore', 'Firebase', 'Android'],
      description: 'An augmented reality mobile application that helps students navigate the university campus with real-time directions, building information, and indoor navigation using AR markers.',
      grade: 'A+',
      year: '2024',
      semester: 'Spring',
      githubUrl: 'https://github.com/smartcampus/ar-navigation',
      documentUrl: '/documents/fyp-2024-ar-navigation.pdf',
      features: ['AR-based navigation', 'Indoor positioning', 'Real-time updates', 'Offline maps'],
      challenges: ['AR accuracy in different lighting', 'Indoor positioning without GPS', 'Battery optimization'],
      outcomes: ['Successfully deployed campus-wide', 'Reduced student confusion by 85%', 'Featured in university newsletter'],
      isBookmarked: true,
      views: 234,
      downloads: 45
    },
    {
      id: 2,
      title: 'Blockchain-Based Student Verification System',
      students: ['Ali Ahmed', 'Zainab Malik', 'Hassan Raza'],
      supervisor: 'Prof. Ahmed Khan',
      department: 'Information Technology',
      category: 'Blockchain',
      batch: '2024',
      techStack: ['Solidity', 'Web3.js', 'React', 'Ethereum', 'IPFS'],
      description: 'A decentralized system for verifying student credentials and certificates using blockchain technology, eliminating document fraud and providing instant verification.',
      grade: 'A',
      year: '2024',
      semester: 'Fall',
      githubUrl: 'https://github.com/verifystu/blockchain-verification',
      documentUrl: '/documents/fyp-2024-blockchain-verification.pdf',
      features: ['Immutable certificate storage', 'QR code verification', 'Multi-university support', 'Smart contracts'],
      challenges: ['Gas fee optimization', 'University adoption', 'Scalability issues'],
      outcomes: ['Adopted by 3 universities', 'Reduced verification time from days to seconds', 'Patent application filed'],
      isBookmarked: false,
      views: 456,
      downloads: 78
    },
    {
      id: 3,
      title: 'AI-Powered Mental Health Assistant for Students',
      students: ['Ayesha Siddique', 'Omar Farooq'],
      supervisor: 'Dr. Maria Garcia',
      department: 'Computer Science',
      category: 'Machine Learning',
      batch: '2023',
      techStack: ['Python', 'TensorFlow', 'NLP', 'Flutter', 'Firebase'],
      description: 'A mobile application that uses natural language processing and machine learning to provide mental health support, mood tracking, and personalized recommendations for university students.',
      grade: 'A+',
      year: '2023',
      semester: 'Spring',
      githubUrl: 'https://github.com/mentalhealth/ai-assistant',
      documentUrl: '/documents/fyp-2023-mental-health-ai.pdf',
      features: ['Mood tracking', 'AI-powered conversations', 'Crisis detection', 'Resource recommendations'],
      challenges: ['Privacy concerns', 'Accuracy of mood detection', 'Cultural sensitivity'],
      outcomes: ['Used by 500+ students', 'Published in IEEE conference', 'Improved student wellbeing scores by 40%'],
      isBookmarked: true,
      views: 789,
      downloads: 123
    },
    {
      id: 4,
      title: 'Smart Traffic Management System using IoT',
      students: ['Bilal Khan', 'Saba Noor', 'Hamza Ali'],
      supervisor: 'Dr. John Smith',
      department: 'Electronic Engineering',
      category: 'IoT & Embedded',
      batch: '2023',
      techStack: ['Arduino', 'Raspberry Pi', 'Python', 'MongoDB', 'React'],
      description: 'An IoT-based traffic management system that uses sensors and machine learning to optimize traffic flow, reduce congestion, and provide real-time traffic updates.',
      grade: 'A',
      year: '2023',
      semester: 'Fall',
      githubUrl: 'https://github.com/smarttraffic/iot-management',
      documentUrl: '/documents/fyp-2023-smart-traffic.pdf',
      features: ['Real-time traffic monitoring', 'Adaptive signal control', 'Emergency vehicle priority', 'Mobile app for citizens'],
      challenges: ['Weather resistance', 'Network connectivity', 'Real-time processing'],
      outcomes: ['Reduced traffic delays by 30%', 'Implemented at 5 intersections', 'City government interest'],
      isBookmarked: false,
      views: 345,
      downloads: 67
    },
    {
      id: 5,
      title: 'Virtual Reality Chemistry Lab Simulator',
      students: ['Nida Hassan', 'Faisal Ahmed'],
      supervisor: 'Dr. Lisa Wang',
      department: 'Computer Science',
      category: 'Game Development',
      batch: '2023',
      techStack: ['Unity', 'C#', 'VR SDK', 'Blender', 'Firebase'],
      description: 'An immersive VR application that simulates chemistry laboratory experiments, allowing students to practice dangerous or expensive experiments in a safe virtual environment.',
      grade: 'A+',
      year: '2023',
      semester: 'Spring',
      githubUrl: 'https://github.com/vrchemlab/simulator',
      documentUrl: '/documents/fyp-2023-vr-chemistry.pdf',
      features: ['Realistic physics simulation', 'Safety training modules', 'Progress tracking', 'Multi-user collaboration'],
      challenges: ['Physics accuracy', 'VR motion sickness', 'Hardware requirements'],
      outcomes: ['Adopted by chemistry department', 'Reduced lab accidents by 60%', 'Featured in education conference'],
      isBookmarked: true,
      views: 567,
      downloads: 89
    },
    {
      id: 6,
      title: 'Automated Plagiarism Detection System',
      students: ['Maira Qureshi', 'Usman Sheikh', 'Farah Khan'],
      supervisor: 'Prof. Robert Davis',
      department: 'Software Engineering',
      category: 'Web Development',
      batch: '2022',
      techStack: ['Python', 'Django', 'React', 'PostgreSQL', 'NLP'],
      description: 'A comprehensive web-based system that detects plagiarism in academic documents using advanced natural language processing techniques and machine learning algorithms.',
      grade: 'A',
      year: '2022',
      semester: 'Fall',
      githubUrl: 'https://github.com/plagiarismdetect/system',
      documentUrl: '/documents/fyp-2022-plagiarism-detection.pdf',
      features: ['Multi-language support', 'Similarity algorithms', 'Batch processing', 'Detailed reports'],
      challenges: ['Algorithm accuracy', 'Processing large documents', 'False positive reduction'],
      outcomes: ['95% accuracy achieved', 'Used by 10+ departments', 'Saved 200+ hours of manual checking'],
      isBookmarked: false,
      views: 432,
      downloads: 76
    }
  ];

  const recentSearches = [
    { query: 'blockchain student verification', results: 23, timestamp: '2 hours ago' },
    { query: 'AI mental health chatbot', results: 15, timestamp: '1 day ago' },
    { query: 'IoT smart traffic system', results: 31, timestamp: '2 days ago' },
    { query: 'AR navigation campus', results: 8, timestamp: '3 days ago' },
    { query: 'VR chemistry laboratory', results: 12, timestamp: '1 week ago' }
  ];

  const bookmarkedFYPs = completedFYPs.filter(fyp => fyp.isBookmarked);

  const filteredFYPs = completedFYPs.filter(fyp => {
    const matchesSearch = fyp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fyp.supervisor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fyp.students.some(student => student.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         fyp.techStack.some(tech => tech.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         fyp.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         fyp.features.some(feature => feature.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'all' || 
                           fyp.category.toLowerCase().includes(selectedCategory);
    
    const matchesGrade = selectedGrade === 'all' || 
                        fyp.grade === selectedGrade;
    
    const matchesYear = selectedYear === 'all' || 
                       fyp.year === selectedYear;
    
    const matchesTechStack = selectedTechStack.length === 0 || 
                            selectedTechStack.some(tech => fyp.techStack.includes(tech));
    
    return matchesSearch && matchesCategory && matchesGrade && matchesYear && matchesTechStack;
  });

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800';
      case 'A': return 'bg-blue-100 text-blue-800';
      case 'A-': return 'bg-yellow-100 text-yellow-800';
      case 'B+': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBatchColor = (batch) => {
    const currentYear = new Date().getFullYear();
    const batchYear = parseInt(batch);
    if (batchYear === currentYear) return 'bg-green-100 text-green-800';
    if (batchYear === currentYear - 1) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Welcome back, {user?.firstName}! 👋
            </h1>
            <p className="text-xl text-gray-600">
              Explore previous FYPs from senior batches. Check if your idea has been implemented before!
            </p>
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

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content - FYP Repository */}
            <div className="lg:col-span-3 animate-slide-up-delay">
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-200">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">FYP Repository</h2>
                      <p className="text-gray-600 mt-1">{filteredFYPs.length} previous FYPs found</p>
                    </div>
                    
                    {/* Search and Filters */}
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div className="relative">
                        <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search FYPs, students, supervisors, tech..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 pr-4 py-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-80 shadow-sm"
                        />
                      </div>
                      
                      <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className="flex items-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors font-medium text-gray-700"
                      >
                        <SlidersHorizontal className="h-5 w-5 mr-2" />
                        Advanced Filters
                        <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${showAdvancedFilters ? 'rotate-180' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Advanced Filters Panel */}
                  {showAdvancedFilters && (
                    <div className="mt-6 p-6 bg-gray-50 rounded-xl border border-gray-200 animate-slide-up">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            {categories.map((category) => (
                              <option key={category.id} value={category.id}>
                                {category.name} ({category.count})
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                          <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Grades</option>
                            <option value="A+">A+ Grade</option>
                            <option value="A">A Grade</option>
                            <option value="A-">A- Grade</option>
                            <option value="B+">B+ Grade</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                          <select
                            value={selectedYear}
                            onChange={(e) => setSelectedYear(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="all">All Years</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            <option value="2021">2021</option>
                            <option value="2020">2020</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          >
                            <option value="relevance">Most Relevant</option>
                            <option value="year">Newest First</option>
                            <option value="grade">Highest Grade</option>
                            <option value="views">Most Viewed</option>
                          </select>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Technology Stack</label>
                        <div className="flex flex-wrap gap-2">
                          {techStacks.map((tech) => (
                            <button
                              key={tech}
                              onClick={() => {
                                if (selectedTechStack.includes(tech)) {
                                  setSelectedTechStack(selectedTechStack.filter(t => t !== tech));
                                } else {
                                  setSelectedTechStack([...selectedTechStack, tech]);
                                }
                              }}
                              className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                                selectedTechStack.includes(tech)
                                  ? 'bg-blue-100 text-blue-800 border-blue-300'
                                  : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                              }`}
                            >
                              {tech}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="divide-y divide-gray-100">
                  {filteredFYPs.map((fyp) => (
                    <div key={fyp.id} className="p-8 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 
                                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors cursor-pointer"
                                onClick={() => navigate(`/project/${fyp.id}`)}
                              >
                                {fyp.title}
                              </h3>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(fyp.grade)}`}>
                                {fyp.grade}
                              </span>
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getBatchColor(fyp.batch)}`}>
                                {fyp.batch}
                              </span>
                            </div>
                            <div className="flex items-center text-gray-600 text-sm mb-3">
                              <Users className="h-4 w-4 mr-1" />
                              <span className="font-medium">{fyp.students.join(', ')}</span>
                              <span className="mx-2">•</span>
                              <User className="h-4 w-4 mr-1" />
                              <span>{fyp.supervisor}</span>
                              <span className="mx-2">•</span>
                              <Building className="h-4 w-4 mr-1" />
                              <span>{fyp.department}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center text-sm text-gray-500">
                              <Eye className="h-4 w-4 mr-1" />
                              {fyp.views}
                            </div>
                            <button className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                              <Heart className={`h-5 w-5 ${fyp.isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed">
                          {fyp.description}
                        </p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Key Features</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {fyp.features.slice(0, 3).map((feature, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                                  {feature}
                                </li>
                              ))}
                            </ul>
                          </div>
                          
                          <div>
                            <h4 className="font-semibold text-gray-900 mb-2">Outcomes</h4>
                            <ul className="text-sm text-gray-600 space-y-1">
                              {fyp.outcomes.slice(0, 2).map((outcome, index) => (
                                <li key={index} className="flex items-start">
                                  <Award className="h-3 w-3 text-green-500 mt-1 mr-2 flex-shrink-0" />
                                  {outcome}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-50 text-purple-700 border border-purple-200">
                            {fyp.category}
                          </span>
                          {fyp.techStack.map((tech, index) => (
                            <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 border border-blue-200">
                              {tech}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                            <FileText className="h-4 w-4 mr-2" />
                            View Document
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            <Code className="h-4 w-4 mr-2" />
                            Source Code
                          </button>
                          <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                            <Download className="h-4 w-4 mr-2" />
                            Download ({fyp.downloads})
                          </button>
                          <div className="flex items-center text-sm text-gray-500 ml-auto">
                            <Calendar className="h-4 w-4 mr-1" />
                            {fyp.semester} {fyp.year}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                {filteredFYPs.length === 0 && (
                  <div className="p-12 text-center">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-medium text-gray-900 mb-2">No FYPs found</h3>
                    <p className="text-gray-500 mb-6">Try adjusting your search criteria or browse all categories.</p>
                    <button 
                      onClick={() => {
                        setSearchTerm('');
                        setSelectedCategory('all');
                        setSelectedGrade('all');
                        setSelectedYear('all');
                        setSelectedTechStack([]);
                      }}
                      className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium"
                    >
                      Clear All Filters
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6 animate-slide-up-delay-2">
              {/* Bookmarked FYPs */}
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Bookmarked FYPs</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {bookmarkedFYPs.map((fyp) => (
                      <div key={fyp.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow duration-200">
                        <h3 
                          className="font-semibold text-gray-900 mb-2 text-sm leading-tight hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => navigate(`/project/${fyp.id}`)}
                        >
                          {fyp.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-3">
                          <span className="font-medium">Students:</span> {fyp.students.join(', ')}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getGradeColor(fyp.grade)}`}>
                            {fyp.grade}
                          </span>
                          <span className="text-xs text-gray-500">{fyp.year}</span>
                        </div>
                      </div>
                    ))}
                    <button className="w-full text-center py-3 text-blue-600 hover:text-blue-800 text-sm font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                      View All Bookmarks →
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Searches */}
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Recent Searches</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    {recentSearches.map((search, index) => (
                      <div key={index} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">{search.query}</p>
                          <p className="text-xs text-gray-500">{search.results} results • {search.timestamp}</p>
                        </div>
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                    <button className="w-full text-center py-3 text-blue-600 hover:text-blue-800 text-sm font-semibold hover:bg-blue-50 rounded-lg transition-colors">
                      Clear Search History →
                    </button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
                </div>
                <div className="p-6">
                  <div className="space-y-3">
                    <button className="w-full flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-blue-300 group">
                      <TrendingUp className="h-5 w-5 text-blue-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-gray-900">Check Idea Similarity</span>
                    </button>
                    <button className="w-full flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-green-300 group">
                      <Users className="h-5 w-5 text-green-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-gray-900">Find Supervisors</span>
                    </button>
                    <button className="w-full flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-all duration-200 hover:border-purple-300 group">
                      <Star className="h-5 w-5 text-purple-500 mr-3 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-semibold text-gray-900">Top Rated FYPs</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;