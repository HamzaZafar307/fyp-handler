import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Users, 
  User, 
  Building, 
  Calendar, 
  ExternalLink,
  Download,
  Heart,
  Eye,
  Star,
  Award,
  Code,
  FileText,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
  TrendingUp,
  Share2,
  BookOpen,
  GraduationCap,
  Clock
} from 'lucide-react';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real implementation, this would come from API based on projectId
  const projectData = {
    1: {
      id: 1,
      title: 'Smart Campus Navigation System using AR',
      students: ['Ahmad Hassan', 'Fatima Khan'],
      supervisor: 'Dr. Sarah Johnson',
      department: 'Computer Science',
      category: 'Mobile Development',
      batch: '2024',
      techStack: ['Unity', 'ARCore', 'Firebase', 'Android', 'C#', 'Java'],
      description: 'An augmented reality mobile application that helps students navigate the university campus with real-time directions, building information, and indoor navigation using AR markers. The system combines cutting-edge AR technology with practical navigation solutions to enhance the campus experience for students, faculty, and visitors.',
      detailedDescription: `This innovative Final Year Project addresses the common problem of campus navigation by leveraging Augmented Reality (AR) technology. The application provides an intuitive, interactive way for users to navigate complex university campuses with ease.

      The system uses ARCore for Android devices to overlay digital information onto the real world, creating an immersive navigation experience. Users can simply point their phone camera at buildings, pathways, or landmarks to receive contextual information and directional guidance.

      Key technical implementations include real-time position tracking, 3D model integration, cloud-based data synchronization, and offline functionality for areas with poor connectivity. The application has been thoroughly tested across different campus environments and lighting conditions.`,
      grade: 'A+',
      year: '2024',
      semester: 'Spring',
      githubUrl: 'https://github.com/smartcampus/ar-navigation',
      documentUrl: '/documents/fyp-2024-ar-navigation.pdf',
      demoUrl: 'https://youtube.com/watch?v=demo-ar-navigation',
      features: [
        'AR-based real-time navigation with 3D overlays',
        'Indoor positioning system without GPS dependency', 
        'Real-time campus updates and event notifications',
        'Offline map functionality for network dead zones',
        'Multi-language support (English, Urdu, Punjabi)',
        'Accessibility features for visually impaired users',
        'Integration with university information systems',
        'Social features for location sharing and meetups'
      ],
      challenges: [
        'AR accuracy in different lighting conditions and weather',
        'Indoor positioning without GPS - solved using WiFi triangulation and BLE beacons',
        'Battery optimization for continuous AR usage',
        'Handling large 3D models and textures efficiently',
        'Cross-platform compatibility and performance optimization'
      ],
      solutions: [
        'Implemented adaptive lighting algorithms for consistent AR tracking',
        'Deployed BLE beacon network across campus for precise indoor positioning',
        'Optimized rendering pipeline and implemented intelligent LOD system',
        'Used cloud-based model streaming and local caching',
        'Extensive performance testing and memory optimization'
      ],
      outcomes: [
        'Successfully deployed campus-wide with 95% user satisfaction',
        'Reduced student navigation confusion by 85%',
        'Featured in university newsletter and technology showcase',
        'Adopted by 3 other universities as a template project',
        'Won Best Innovation Award at National FYP Competition',
        'Published research paper in IEEE Conference on AR/VR Applications'
      ],
      timeline: [
        { phase: 'Research & Planning', duration: '4 weeks', status: 'completed', description: 'Literature review, technology assessment, and project planning' },
        { phase: 'Prototype Development', duration: '6 weeks', status: 'completed', description: 'Basic AR functionality and navigation algorithms' },
        { phase: 'System Architecture', duration: '3 weeks', status: 'completed', description: 'Backend infrastructure and database design' },
        { phase: 'Core Development', duration: '8 weeks', status: 'completed', description: 'Full application development and feature implementation' },
        { phase: 'Testing & Optimization', duration: '4 weeks', status: 'completed', description: 'Performance optimization and user testing' },
        { phase: 'Deployment & Documentation', duration: '3 weeks', status: 'completed', description: 'Campus deployment and final documentation' }
      ],
      technologies: {
        frontend: ['Unity 2022.3', 'ARCore SDK', 'Android SDK', 'C#'],
        backend: ['Firebase Realtime Database', 'Firebase Cloud Functions', 'Node.js', 'Express.js'],
        tools: ['Android Studio', 'Visual Studio', 'Git', 'Firebase Console', 'Blender'],
        libraries: ['ARCore Extensions', 'Google Maps SDK', 'Firebase SDK', 'UniRx']
      },
      metrics: {
        views: 1234,
        downloads: 245,
        stars: 89,
        forks: 23,
        likes: 156
      },
      isBookmarked: true,
      teamMembers: [
        {
          name: 'Ahmad Hassan',
          role: 'Lead Developer & AR Specialist',
          responsibilities: 'AR implementation, 3D modeling, performance optimization',
          linkedin: 'https://linkedin.com/in/ahmad-hassan',
          github: 'https://github.com/ahmad-hassan'
        },
        {
          name: 'Fatima Khan', 
          role: 'Backend Developer & UI/UX Designer',
          responsibilities: 'Firebase backend, user interface design, user experience',
          linkedin: 'https://linkedin.com/in/fatima-khan',
          github: 'https://github.com/fatima-khan'
        }
      ],
      relatedProjects: [
        { id: 2, title: 'VR Chemistry Lab Simulator', similarity: 85 },
        { id: 3, title: 'IoT Smart Campus System', similarity: 72 },
        { id: 4, title: 'AI-Powered Campus Assistant', similarity: 68 }
      ]
    },
    // Add more project data as needed
  };

  const project = projectData[projectId];

  if (!project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Project Not Found</h2>
          <p className="text-gray-600 mb-6">The project you're looking for doesn't exist or has been moved.</p>
          <button 
            onClick={() => navigate(-1)}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+': return 'bg-green-100 text-green-800 border-green-200';
      case 'A': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'A-': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'B+': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getBatchColor = (batch) => {
    const currentYear = new Date().getFullYear();
    const batchYear = parseInt(batch);
    if (batchYear === currentYear) return 'bg-green-100 text-green-800 border-green-200';
    if (batchYear === currentYear - 1) return 'bg-blue-100 text-blue-800 border-blue-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="mb-8">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center text-blue-600 hover:text-blue-800 mb-4 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Projects
            </button>
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-4xl font-bold text-gray-900">{project.title}</h1>
                  <button 
                    onClick={() => setIsBookmarked(!isBookmarked)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Heart className={`h-6 w-6 ${isBookmarked ? 'fill-red-500 text-red-500' : ''}`} />
                  </button>
                </div>
                
                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Users className="h-5 w-5 mr-2" />
                    <span className="font-medium">{project.students.join(', ')}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <span>{project.supervisor}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <span>{project.department}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{project.semester} {project.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(project.grade)}`}>
                    <Award className="h-4 w-4 mr-1" />
                    Grade: {project.grade}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBatchColor(project.batch)}`}>
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Batch {project.batch}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {project.category}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Eye className="h-4 w-4 mr-1" />
                    {project.metrics.views} views
                  </div>
                  <div className="flex items-center">
                    <Download className="h-4 w-4 mr-1" />
                    {project.metrics.downloads} downloads
                  </div>
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1" />
                    {project.metrics.stars} stars
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <a 
                    href={project.githubUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
                  >
                    <Code className="h-4 w-4 mr-2" />
                    Source Code
                  </a>
                  <a 
                    href={project.documentUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Documentation
                  </a>
                  {project.demoUrl && (
                    <a 
                      href={project.demoUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Live Demo
                    </a>
                  )}
                  <button className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                {[
                  { id: 'overview', name: 'Overview', icon: BookOpen },
                  { id: 'details', name: 'Technical Details', icon: Code },
                  { id: 'timeline', name: 'Timeline', icon: Clock },
                  { id: 'team', name: 'Team', icon: Users },
                  { id: 'outcomes', name: 'Outcomes', icon: TrendingUp }
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Description */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Description</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">{project.description}</p>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 leading-relaxed whitespace-pre-line">{project.detailedDescription}</p>
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features.map((feature, index) => (
                        <div key={index} className="flex items-start p-4 bg-blue-50 rounded-xl">
                          <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'details' && (
                <div className="space-y-8">
                  {/* Tech Stack */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Technology Stack</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Object.entries(project.technologies).map(([category, techs]) => (
                        <div key={category} className="p-4 bg-gray-50 rounded-xl">
                          <h3 className="font-semibold text-gray-900 mb-3 capitalize">{category}</h3>
                          <div className="flex flex-wrap gap-2">
                            {techs.map((tech, index) => (
                              <span key={index} className="px-3 py-1 bg-white text-gray-700 rounded-lg text-sm border border-gray-200">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Challenges & Solutions */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Challenges & Solutions</h2>
                    <div className="space-y-6">
                      {project.challenges.map((challenge, index) => (
                        <div key={index} className="border border-gray-200 rounded-xl p-6">
                          <div className="flex items-start mb-3">
                            <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 mr-3" />
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900 mb-2">Challenge {index + 1}</h4>
                              <p className="text-gray-700 text-sm">{challenge}</p>
                            </div>
                          </div>
                          {project.solutions[index] && (
                            <div className="flex items-start mt-4 pl-8">
                              <Lightbulb className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900 mb-1">Solution</h5>
                                <p className="text-gray-600 text-sm">{project.solutions[index]}</p>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Timeline</h2>
                  <div className="space-y-6">
                    {project.timeline.map((phase, index) => (
                      <div key={index} className="relative">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 w-4 h-4 rounded-full mt-2 ${
                            phase.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="ml-6 flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">{phase.phase}</h3>
                              <span className="text-sm text-gray-500 font-medium">{phase.duration}</span>
                            </div>
                            <p className="text-gray-600 text-sm">{phase.description}</p>
                          </div>
                        </div>
                        {index < project.timeline.length - 1 && (
                          <div className="absolute left-2 top-6 w-0.5 h-6 bg-gray-200"></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Team Members</h2>
                  <div className="space-y-6">
                    {project.teamMembers.map((member, index) => (
                      <div key={index} className="border border-gray-200 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900">{member.name}</h3>
                            <p className="text-blue-600 font-medium">{member.role}</p>
                          </div>
                          <div className="flex gap-2">
                            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <ExternalLink className="h-4 w-4" />
                            </a>
                            <a href={member.github} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                              <Code className="h-4 w-4" />
                            </a>
                          </div>
                        </div>
                        <p className="text-gray-600 text-sm">{member.responsibilities}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'outcomes' && (
                <div className="space-y-8">
                  {/* Project Outcomes */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Outcomes & Impact</h2>
                    <div className="space-y-4">
                      {project.outcomes.map((outcome, index) => (
                        <div key={index} className="flex items-start p-4 bg-green-50 rounded-xl">
                          <Award className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{outcome}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-3xl font-bold text-blue-600">{project.metrics.views}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-3xl font-bold text-green-600">{project.metrics.downloads}</div>
                        <div className="text-sm text-gray-600">Downloads</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <div className="text-3xl font-bold text-yellow-600">{project.metrics.stars}</div>
                        <div className="text-sm text-gray-600">Stars</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-3xl font-bold text-purple-600">{project.metrics.likes}</div>
                        <div className="text-sm text-gray-600">Likes</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Info */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Duration</span>
                    <span className="font-medium">28 weeks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-medium">{project.students.length} members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Technologies</span>
                    <span className="font-medium">{project.techStack.length} tools</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Projects */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Related Projects</h3>
                <div className="space-y-3">
                  {project.relatedProjects.map((related) => (
                    <Link 
                      key={related.id}
                      to={`/project/${related.id}`}
                      className="block p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <h4 className="font-medium text-gray-900 text-sm mb-1">{related.title}</h4>
                      <div className="flex items-center text-xs text-gray-500">
                        <Target className="h-3 w-3 mr-1" />
                        {related.similarity}% similarity
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Read Full Report
                  </button>
                  <button className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Users className="h-4 w-4 mr-2" />
                    Contact Team
                  </button>
                  <button className="w-full flex items-center justify-center p-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Project
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;