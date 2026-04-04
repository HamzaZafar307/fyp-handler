import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import projectService from '../services/projectService';
import evaluationService from '../services/evaluationService';
import { 
  ArrowLeft, 
  Users, 
  User, 
  Building, 
  Calendar, 
  ExternalLink,
  Heart,
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

  const [project, setProject] = useState(null);
  const [evaluations, setEvaluations] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEvaluationModalOpen, setIsEvaluationModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [statusComment, setStatusComment] = useState('');
  const [performanceScore, setPerformanceScore] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Evaluation Form State
  const [evalForm, setEvalForm] = useState({
    technicalScore: 8,
    innovationScore: 8,
    implementationScore: 8,
    presentationScore: 8,
    documentationScore: 8,
    evaluationType: 1, // Interim
    comments: '',
    recommendations: ''
  });

  const { user } = useAuth();
  const isSupervisor = user?.role === 'Teacher' && (project?.supervisorId === parseInt(user.id) || user.id === project?.supervisorId);
  const isAdmin = user?.role === 'Admin';
  const canManage = isSupervisor || isAdmin;

  const fetchData = async () => {
    try {
      setLoading(true);
      const [projectRes, evalRes] = await Promise.all([
        projectService.getProjectById(projectId),
        evaluationService.getProjectEvaluations(projectId)
      ]);
      
      setProject(projectRes.data);
      setEvaluations(evalRes.data || []);

      if (canManage) {
        const students = await projectService.getStudents();
        setAllStudents(students || []);
      }
    } catch (err) {
      console.error("Error fetching project data:", err);
      setError("Failed to load project information.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchData();
    }
  }, [projectId, canManage]);

  const handleStatusUpdate = async (status, comment = '') => {
    try {
      setSubmitting(true);
      // Backend expects integer values for enum status
      const statusCode = projectService.Status[status] || 3; // Default to InProgress if mapping fails
      
      await projectService.updateProject(projectId, { 
        status: statusCode,
        statusUpdateComment: comment,
        performanceScore: performanceScore 
      });
      setIsStatusModalOpen(false);
      setStatusComment('');
      setPerformanceScore(0);
      await fetchData();
    } catch (err) {
      alert("Failed to update status");
    } finally {
      setSubmitting(false);
    }
  };

  const openStatusModal = (status) => {
    setNewStatus(status);
    setIsStatusModalOpen(true);
  };

  const handleAddEvaluation = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      await evaluationService.createEvaluation({
        ...evalForm,
        projectId: parseInt(projectId)
      });
      setIsEvaluationModalOpen(false);
      await fetchData();
    } catch (err) {
      alert("Failed to submit evaluation");
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssignStudent = async (studentId) => {
    try {
      setSubmitting(true);
      const currentStudentIds = project.projectMembers.map(m => m.userId);
      if (currentStudentIds.includes(studentId)) {
        alert("Student already assigned");
        return;
      }
      
      await projectService.updateProject(projectId, { 
        studentIds: [...currentStudentIds, studentId] 
      });
      await fetchData();
    } catch (err) {
      alert("Failed to assign student");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRemoveStudent = async (studentId) => {
    try {
      if (!window.confirm("Remove this student from the project?")) return;
      setSubmitting(true);
      const newStudentIds = project.projectMembers
        .map(m => m.userId)
        .filter(id => id !== studentId);
      
      await projectService.updateProject(projectId, { 
        studentIds: newStudentIds 
      });
      await fetchData();
    } catch (err) {
      alert("Failed to remove student");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{error || "Project Not Found"}</h2>
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
                    <span className="font-medium">{project.projectMembers?.map(m => m.userName).join(', ') || 'No students'}</span>
                  </div>
                  <div className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    <span>{project.supervisorName}</span>
                  </div>
                  <div className="flex items-center">
                    <Building className="h-5 w-5 mr-2" />
                    <span>{project.departmentName}</span>
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    <span>{project.semester} {project.year}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getGradeColor(project.finalGrade)}`}>
                    <Award className="h-4 w-4 mr-1" />
                    Grade: {project.finalGrade || 'N/A'}
                  </span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getBatchColor(project.year)}`}>
                    <GraduationCap className="h-4 w-4 mr-1" />
                    Batch {project.year}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                    {project.category}
                  </span>
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                    {project.status}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 lg:flex-col">
                <div className="flex items-center gap-6 text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <TrendingUp className="h-4 w-4 mr-1" />
                    {project.citations || 0} citations
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {canManage && (
                    <>
                      <button 
                        onClick={() => setIsEvaluationModalOpen(true)}
                        className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm font-medium"
                      >
                        <Award className="h-4 w-4 mr-2" />
                        Evaluate/Mark
                      </button>
                      <button 
                        onClick={() => {
                          setNewStatus(project.status);
                          setIsStatusModalOpen(true);
                        }}
                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium"
                      >
                        <Clock className="h-4 w-4 mr-2" />
                        Update Status
                      </button>
                    </>
                  )}
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
                  </div>

                  {/* Progress Trail */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <div className="flex items-center gap-3 mb-6">
                      <TrendingUp className="h-7 w-7 text-blue-600" />
                      <h2 className="text-2xl font-bold text-gray-900">Progress Trail</h2>
                    </div>
                    
                    {/* Progress Score Bar (Always featured) */}
                    <div className="bg-blue-600 rounded-2xl p-6 mb-8 text-white shadow-md">
                      <div className="flex justify-between items-center mb-3">
                        <span className="font-semibold text-blue-50">Current Performance Score</span>
                        <span className="text-2xl font-black">{project.performanceScore || 0}%</span>
                      </div>
                      <div className="bg-white/20 rounded-full h-3 w-full">
                        <div 
                          className="bg-white h-3 rounded-full transition-all duration-1000 shadow-[0_0_15px_rgba(255,255,255,0.4)]" 
                          style={{ width: `${project.performanceScore || 0}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {evaluations
                        .filter(e => {
                          const type = e.evaluationType || e.EvaluationType;
                          if (!type) return false;
                          const typeStr = type.toString().toLowerCase();
                          return typeStr === 'progressupdate' || typeStr === '4';
                        })
                        .sort((a, b) => new Date(b.evaluationDate) - new Date(a.evaluationDate))
                        .slice(0, 5) // Show top 5 recent updates
                        .map((update, idx) => (
                          <div key={update.id} className="relative pl-6 border-l-2 border-blue-50 last:border-transparent">
                            <div className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-blue-100 border-2 border-blue-600"></div>
                            <div className="flex justify-between items-start">
                              <p className="text-gray-800 leading-relaxed font-medium">
                                {idx === 0 ? <span className="text-xs font-bold text-blue-600 uppercase block mb-1">Latest Update</span> : null}
                                {update.comments}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-xs text-gray-400">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(update.evaluationDate).toLocaleDateString()} by {update.evaluatorName}
                            </div>
                          </div>
                        ))}
                      {evaluations.filter(e => {
                        const type = e.evaluationType || e.EvaluationType;
                        if (!type) return false;
                        const typeStr = type.toString().toLowerCase();
                        return typeStr === 'progressupdate' || typeStr === '4';
                      }).length === 0 && (
                        <p className="text-center py-8 text-gray-500 italic bg-gray-50 rounded-xl border-2 border-dashed border-gray-100">
                          Initial project proposal phase. Use "Update Status" to log progress milestones.
                        </p>
                      )}
                    </div>

                    {evaluations.filter(e => {
                      const type = e.evaluationType || e.EvaluationType;
                      if (!type) return false;
                      const typeStr = type.toString().toLowerCase();
                      return typeStr === 'progressupdate' || typeStr === '4';
                    }).length > 5 && (
                      <button 
                         onClick={() => setActiveTab('timeline')}
                         className="w-full mt-6 py-2 text-sm text-blue-600 font-semibold hover:bg-blue-50 rounded-lg transition-all"
                      >
                        View Full History in Timeline →
                      </button>
                    )}
                  </div>

                  {/* Key Features */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Key Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.features ? (
                        project.features.split(';').map((feature, index) => (
                          <div key={index} className="flex items-start p-4 bg-blue-50 rounded-xl">
                            <CheckCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                            <span className="text-gray-700 text-sm">{feature}</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 italic px-4">No specific features listed yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              

              {activeTab === 'timeline' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Evaluation History & Feedback</h2>
                  <div className="space-y-6">
                    {evaluations.length > 0 ? (
                      evaluations.map((evalItem, index) => (
                        <div key={evalItem.id} className="relative pl-8 pb-8 border-l-2 border-blue-100 last:pb-0">
                          <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.1)]"></div>
                          <div className="bg-gray-50 rounded-xl p-6 border border-gray-100">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h3 className="text-lg font-bold text-gray-900">
                                  {evalItem.evaluationType === 'ProgressUpdate' ? '🚀 Status Change / Progress' : `${evalItem.evaluationType} Evaluation`}
                                </h3>
                                <div className="flex items-center text-sm text-gray-500 gap-4 mt-1">
                                  <span className="flex items-center"><User className="h-3 w-3 mr-1" /> {evalItem.evaluatorName}</span>
                                  <span className="flex items-center"><Calendar className="h-3 w-3 mr-1" /> {new Date(evalItem.evaluationDate).toLocaleDateString()}</span>
                                </div>
                              </div>
                              {evalItem.evaluationType !== 'ProgressUpdate' && (
                                <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-bold">
                                  Score: {evalItem.overallScore}/10
                                </div>
                              )}
                            </div>

                            {evalItem.evaluationType !== 'ProgressUpdate' && (
                              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                                {[
                                  { label: 'Technical', val: evalItem.technicalScore },
                                  { label: 'Innovation', val: evalItem.innovationScore },
                                  { label: 'Implementation', val: evalItem.implementationScore },
                                  { label: 'Presentation', val: evalItem.presentationScore },
                                  { label: 'Documentation', val: evalItem.documentationScore },
                                ].map(s => (
                                  <div key={s.label} className="text-center p-2 bg-white rounded-lg border border-gray-100">
                                    <div className="text-xs text-gray-500 uppercase">{s.label}</div>
                                    <div className="font-bold text-gray-900">{s.val}</div>
                                  </div>
                                ))}
                              </div>
                            )}

                            <div className="space-y-3">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-900 italic">Comments:</h4>
                                <p className="text-gray-700 text-sm">{evalItem.comments}</p>
                              </div>
                              {evalItem.recommendations && (
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-900 italic text-green-600">Recommendations:</h4>
                                  <p className="text-gray-700 text-sm">{evalItem.recommendations}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
                        <Clock className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 font-medium">No evaluations recorded yet.</p>
                        {canManage && <p className="text-sm text-gray-400 mt-1">Use "Evaluate" button to add first feedback.</p>}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'team' && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
                    {canManage && (
                      <button 
                        onClick={() => setIsAssignModalOpen(true)}
                        className="flex items-center px-4 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Assign Student
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {(project.projectMembers || []).map((member, index) => (
                      <div key={index} className="group relative bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                            {member.userName?.charAt(0) || 'S'}
                          </div>
                          <div className="flex-1">
                            <h3 className="text-lg font-bold text-gray-900">{member.userName || member.email}</h3>
                            <p className="text-blue-600 text-sm font-medium">{member.role}</p>
                          </div>
                          {canManage && (
                            <button 
                              onClick={() => handleRemoveStudent(member.userId)}
                              className="opacity-0 group-hover:opacity-100 p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            >
                              <AlertCircle className="h-5 w-5" />
                            </button>
                          )}
                        </div>
                        <div className="mt-4 flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" /> Joined {new Date(member.joinedAt).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                    {(!project.projectMembers || project.projectMembers.length === 0) && (
                      <p className="col-span-2 text-center py-12 text-gray-500 italic">No team members assigned yet.</p>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'outcomes' && (
                <div className="space-y-8">
                  {/* Project Outcomes */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Outcomes & Impact</h2>
                    <div className="space-y-4">
                      {(project.outcomes || []).map((outcome, index) => (
                        <div key={index} className="flex items-start p-4 bg-green-50 rounded-xl">
                          <Award className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{outcome}</span>
                        </div>
                      ))}
                      {(!project.outcomes || project.outcomes.length === 0) && (
                        <p className="text-gray-500 italic">Project outcomes will be documented upon completion.</p>
                      )}
                    </div>
                  </div>

                  {/* Metrics */}
                  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Metrics</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                      <div className="text-center p-4 bg-blue-50 rounded-xl">
                        <div className="text-3xl font-bold text-blue-600">{project.metrics?.views || 0}</div>
                        <div className="text-sm text-gray-600">Views</div>
                      </div>
                      <div className="text-center p-4 bg-green-50 rounded-xl">
                        <div className="text-3xl font-bold text-green-600">{project.metrics?.downloads || 0}</div>
                        <div className="text-sm text-gray-600">Downloads</div>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-xl">
                        <div className="text-3xl font-bold text-yellow-600">{project.metrics?.stars || 0}</div>
                        <div className="text-sm text-gray-600">Stars</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 rounded-xl">
                        <div className="text-3xl font-bold text-purple-600">{project.metrics?.likes || 0}</div>
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
                    <span className="text-gray-600">Team Size</span>
                    <span className="font-medium">{(project.projectMembers || []).length} members</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Department</span>
                    <span className="font-medium text-blue-600">{project.departmentName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {project.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Related Projects */}
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Related Projects</h3>
                <div className="space-y-3">
                  {(project.relatedProjects || []).map((related) => (
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
                  {(!project.relatedProjects || project.relatedProjects.length === 0) && (
                    <p className="text-xs text-gray-500 italic">No similar projects found matching this criteria.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Evaluation Modal */}
      {isEvaluationModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-8 animate-modal-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Project Evaluation & Feedback</h2>
            <form onSubmit={handleAddEvaluation} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Evaluation Type</label>
                  <select 
                    value={evalForm.evaluationType}
                    onChange={(e) => setEvalForm({...evalForm, evaluationType: parseInt(e.target.value)})}
                    className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  >
                    <option value={1}>Interim</option>
                    <option value={2}>Final</option>
                    <option value={3}>Defense</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">Detailed Scoring (1-10)</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { id: 'technicalScore', label: 'Technical' },
                    { id: 'innovationScore', label: 'Innovation' },
                    { id: 'implementationScore', label: 'Implementation' },
                    { id: 'presentationScore', label: 'Presentation' },
                    { id: 'documentationScore', label: 'Documentation' }
                  ].map(field => (
                    <div key={field.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                      <span className="text-sm font-medium text-gray-700">{field.label}</span>
                      <input 
                        type="number" min="1" max="10"
                        value={evalForm[field.id]}
                        onChange={(e) => setEvalForm({...evalForm, [field.id]: parseFloat(e.target.value)})}
                        className="w-16 p-1 text-center bg-white border border-gray-300 rounded-lg font-bold"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Comments (Feedback)</label>
                <textarea 
                  rows="3"
                  value={evalForm.comments}
                  onChange={(e) => setEvalForm({...evalForm, comments: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Provide constructive feedback..."
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Recommendations</label>
                <textarea 
                  rows="2"
                  value={evalForm.recommendations}
                  onChange={(e) => setEvalForm({...evalForm, recommendations: e.target.value})}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="What should the team improve?"
                ></textarea>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  type="button"
                  onClick={() => setIsEvaluationModalOpen(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Submitting...' : 'Post Evaluation'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Student Modal */}
      {isAssignModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-modal-in">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Assign Team Member</h2>
            <div className="max-h-96 overflow-y-auto space-y-2 mb-8 pr-2 custom-scrollbar">
              {allStudents
                .filter(s => !project.projectMembers.some(m => m.userId === s.id))
                .map(student => (
                  <button
                    key={student.id}
                    onClick={() => handleAssignStudent(student.id)}
                    disabled={submitting}
                    className="w-full flex items-center gap-4 p-4 hover:bg-blue-50 rounded-2xl border border-gray-100 transition-all text-left"
                  >
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                      {student.firstName[0]}
                    </div>
                    <div>
                      <div className="font-bold text-gray-900">{student.firstName} {student.lastName}</div>
                      <div className="text-xs text-gray-500">{student.department?.name || 'Department'}</div>
                    </div>
                  </button>
                ))
              }
              {allStudents.filter(s => !project.projectMembers.some(m => m.userId === s.id)).length === 0 && (
                <p className="text-center text-gray-500 py-8">No more students available for assignment.</p>
              )}
            </div>
            <button 
              onClick={() => setIsAssignModalOpen(false)}
              className="w-full py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {isStatusModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-gray-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 animate-modal-in">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <TrendingUp className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Update Status</h2>
                <p className="text-sm text-gray-500">Change project phase and add updates</p>
              </div>
            </div>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Project Status</label>
                <select 
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  {['Proposed', 'Approved', 'InProgress', 'Completed', 'Cancelled'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Progress Update / Comment</label>
                <textarea 
                  rows="4"
                  value={statusComment}
                  onChange={(e) => setStatusComment(e.target.value)}
                  className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Explain the reason for status change or add a progress note..."
                ></textarea>
                <p className="mt-2 text-xs text-gray-400 italic">This comment will appear in the project timeline.</p>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-semibold text-gray-700">Project Performance Score</label>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold">{performanceScore}%</span>
                </div>
                <input 
                  type="range"
                  min="0"
                  max="100"
                  value={performanceScore}
                  onChange={(e) => setPerformanceScore(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-[10px] text-gray-400 mt-1 uppercase font-bold">
                  <span>Poor</span>
                  <span>Average</span>
                  <span>Excellent</span>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-gray-100">
                <button 
                  onClick={() => setIsStatusModalOpen(false)}
                  className="flex-1 py-3 px-6 border border-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => handleStatusUpdate(newStatus, statusComment)}
                  disabled={submitting}
                  className="flex-1 py-3 px-6 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-500/30 transition-all disabled:opacity-50"
                >
                  {submitting ? 'Updating...' : 'Update Status'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;