import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  Star,
  BarChart3,
  Users,
  BookOpen,
  Calendar,
  TrendingUp,
  Award,
  Edit,
  Save,
  X,
  Plus,
  Eye,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Target,
  Lightbulb,
  MessageSquare,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import rankingService from '../../services/rankingService';
import { toast } from 'react-hot-toast';
import '../../styles/slider.css';

const FYPRankingManagement = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State management
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('current');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSemester, setSelectedSemester] = useState('');

  // Data states
  const [teacherProjects, setTeacherProjects] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [rankingStats, setRankingStats] = useState(null);
  const [evaluationModal, setEvaluationModal] = useState({ show: false, project: null });
  const [rankingModal, setRankingModal] = useState({ show: false, project: null });

  // Evaluation form state
  const [evaluationForm, setEvaluationForm] = useState({
    technical_score: 8,
    innovation_score: 8,
    implementation_score: 8,
    presentation_score: 8,
    documentation_score: 8,
    evaluation_type: 'Interim',
    comments: '',
    recommendations: ''
  });

  useEffect(() => {
    initializeData();
  }, [selectedYear, selectedSemester]);

  const initializeData = async () => {
    setLoading(true);
    try {
      // Use a sample teacher ID (101 for Dr. Ahmad Hassan) if user ID is not available
      const teacherId = user?.id || 101;

      const [years, projects, stats] = await Promise.all([
        rankingService.getAvailableYears(),
        rankingService.getTeacherProjects(teacherId, { year: selectedYear, semester: selectedSemester }),
        rankingService.getRankingStats(selectedYear, selectedSemester)
      ]);

      setAvailableYears(years);
      setTeacherProjects(projects);
      setRankingStats(stats);
    } catch (error) {
      toast.error('Failed to load projects');
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluate = (project) => {
    setEvaluationModal({ show: true, project });

    // Pre-fill with existing evaluation if available
    if (project.latest_evaluation) {
      setEvaluationForm({
        technical_score: project.latest_evaluation.technical_score || 8,
        innovation_score: project.latest_evaluation.innovation_score || 8,
        implementation_score: project.latest_evaluation.implementation_score || 8,
        presentation_score: project.latest_evaluation.presentation_score || 8,
        documentation_score: project.latest_evaluation.documentation_score || 8,
        evaluation_type: 'Interim',
        comments: '',
        recommendations: ''
      });
    }
  };

  const submitEvaluation = async () => {
    try {
      const overallScore = (
        evaluationForm.technical_score +
        evaluationForm.innovation_score +
        evaluationForm.implementation_score +
        evaluationForm.presentation_score +
        evaluationForm.documentation_score
      ) / 5;

      const evaluation = {
        ...evaluationForm,
        overall_score: overallScore
      };

      await rankingService.submitProjectEvaluation(evaluationModal.project.id, evaluation);

      toast.success('Evaluation submitted successfully');
      setEvaluationModal({ show: false, project: null });

      // Refresh data
      initializeData();
    } catch (error) {
      toast.error('Failed to submit evaluation');
    }
  };

  const updateProjectRanking = async (project, newRankData) => {
    try {
      await rankingService.updateProjectRanking(project.id, newRankData);
      toast.success('Project ranking updated');
      initializeData();
    } catch (error) {
      toast.error('Failed to update ranking');
    }
  };

  const calculatePreviewScore = () => {
    const weights = {
      technical_score: 0.25,
      innovation_score: 0.25,
      implementation_score: 0.25,
      presentation_score: 0.125,
      documentation_score: 0.125
    };

    return Math.round(
      (evaluationForm.technical_score * weights.technical_score +
       evaluationForm.innovation_score * weights.innovation_score +
       evaluationForm.implementation_score * weights.implementation_score +
       evaluationForm.presentation_score * weights.presentation_score +
       evaluationForm.documentation_score * weights.documentation_score) * 10
    );
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'bg-green-500 text-white';
    if (score >= 80) return 'bg-blue-500 text-white';
    if (score >= 70) return 'bg-yellow-500 text-white';
    if (score >= 60) return 'bg-orange-500 text-white';
    return 'bg-red-500 text-white';
  };

  const getRankingIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Award className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="text-sm font-bold text-gray-500">#{rank}</span>;
  };

  const EvaluationModal = () => {
    if (!evaluationModal.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900">
                Evaluate Project: {evaluationModal.project?.title}
              </h3>
              <button
                onClick={() => setEvaluationModal({ show: false, project: null })}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Evaluation Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Evaluation Type</label>
                  <select
                    value={evaluationForm.evaluation_type}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, evaluation_type: e.target.value }))}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Interim">Interim Evaluation</option>
                    <option value="Final">Final Evaluation</option>
                    <option value="Defense">Defense Evaluation</option>
                  </select>
                </div>

                {/* Score Sliders */}
                {[
                  { key: 'technical_score', label: 'Technical Quality', icon: Target },
                  { key: 'innovation_score', label: 'Innovation & Creativity', icon: Lightbulb },
                  { key: 'implementation_score', label: 'Implementation Quality', icon: CheckCircle },
                  { key: 'presentation_score', label: 'Presentation Skills', icon: MessageSquare },
                  { key: 'documentation_score', label: 'Documentation Quality', icon: BookOpen }
                ].map(({ key, label, icon: Icon }) => (
                  <div key={key} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Icon className="h-4 w-4 mr-2 text-blue-500" />
                        <label className="text-sm font-medium text-gray-700">{label}</label>
                      </div>
                      <span className="text-lg font-bold text-blue-600">
                        {evaluationForm[key]}/10
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="range"
                        min="1"
                        max="10"
                        value={evaluationForm[key]}
                        onChange={(e) => setEvaluationForm(prev => ({ ...prev, [key]: parseInt(e.target.value) }))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                      />
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Poor</span>
                        <span>Average</span>
                        <span>Excellent</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Preview and Comments */}
              <div className="space-y-6">
                {/* Performance Preview */}
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">Performance Preview</h4>
                  <div className="text-center mb-4">
                    <span className="text-4xl font-bold text-blue-600">{calculatePreviewScore()}%</span>
                    <p className="text-sm text-gray-600 mt-1">Calculated Performance Score</p>
                  </div>

                  <div className="space-y-3">
                    {[
                      { label: 'Technical', score: evaluationForm.technical_score, weight: '25%' },
                      { label: 'Innovation', score: evaluationForm.innovation_score, weight: '25%' },
                      { label: 'Implementation', score: evaluationForm.implementation_score, weight: '25%' },
                      { label: 'Presentation', score: evaluationForm.presentation_score, weight: '12.5%' },
                      { label: 'Documentation', score: evaluationForm.documentation_score, weight: '12.5%' }
                    ].map(({ label, score, weight }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{label}</span>
                        <div className="flex items-center">
                          <span className="mr-2 text-gray-500">({weight})</span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                          <span className="ml-2 font-medium">{score}/10</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                  <textarea
                    rows="4"
                    value={evaluationForm.comments}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, comments: e.target.value }))}
                    placeholder="Provide detailed feedback on the project..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Recommendations */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recommendations</label>
                  <textarea
                    rows="3"
                    value={evaluationForm.recommendations}
                    onChange={(e) => setEvaluationForm(prev => ({ ...prev, recommendations: e.target.value }))}
                    placeholder="Suggestions for improvement..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => setEvaluationModal({ show: false, project: null })}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitEvaluation}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <Save className="h-4 w-4 mr-2" />
                Submit Evaluation
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            FYP Ranking & Evaluation Management
          </h1>
          <p className="text-lg text-gray-600">
            Evaluate and rank your supervised projects to help students achieve excellence
          </p>
        </div>

        {/* Stats Cards */}
        {rankingStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Your Projects</p>
                  <p className="text-2xl font-bold text-gray-900">{teacherProjects.length}</p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-xl">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teacherProjects.length > 0
                      ? Math.round(teacherProjects.reduce((acc, p) => acc + (p.performance_score || 0), 0) / teacherProjects.length)
                      : 0}%
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-yellow-100 rounded-xl">
                  <Trophy className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Top Ranked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teacherProjects.filter(p => p.department_rank <= 3).length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-xl">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">A+ Projects</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {teacherProjects.filter(p => p.final_grade === 'A+').length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Filter Projects</h3>
            <div className="flex gap-3">
              <button
                onClick={() => initializeData()}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Academic Year</label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Semester</label>
              <select
                value={selectedSemester}
                onChange={(e) => setSelectedSemester(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Semesters</option>
                <option value="Spring">Spring</option>
                <option value="Fall">Fall</option>
              </select>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => navigate('/rankings')}
                className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                View All Rankings
              </button>
            </div>
          </div>
        </div>

        {/* Projects List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading projects...</span>
          </div>
        ) : (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Your Supervised Projects ({teacherProjects.length})
              </h2>
            </div>

            <div className="divide-y divide-gray-100">
              {teacherProjects.length === 0 ? (
                <div className="p-12 text-center">
                  <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
                  <p className="text-gray-600">
                    You don't have any supervised projects for the selected period.
                  </p>
                </div>
              ) : (
                teacherProjects.map((project, index) => (
                  <div key={project.id} className="p-8 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-4 mb-3">
                          {project.department_rank && (
                            <div className="flex items-center">
                              {getRankingIcon(project.department_rank)}
                              <span className="ml-1 text-sm text-gray-600">
                                Dept Rank #{project.department_rank}
                              </span>
                            </div>
                          )}
                        </div>

                        <h3
                          className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          {project.title}
                        </h3>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-2" />
                            <span>{project.students?.join(', ') || 'Students not listed'}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span>{project.semester} {project.year}</span>
                          </div>
                          <div className="flex items-center">
                            <BookOpen className="h-4 w-4 mr-2" />
                            <span>{project.category}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(project.final_grade)}`}>
                            Grade: {project.final_grade || 'Not Assigned'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                            project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {project.status}
                          </span>
                          {project.latest_evaluation && (
                            <span className="flex items-center text-sm text-gray-600">
                              <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                              Last evaluated: {new Date(project.latest_evaluation.evaluation_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-6">
                          <button
                            onClick={() => handleEvaluate(project)}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            {project.latest_evaluation ? 'Update Evaluation' : 'Evaluate Project'}
                          </button>

                          <button
                            onClick={() => navigate(`/project/${project.id}`)}
                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </button>
                        </div>
                      </div>

                      <div className="text-right ml-6">
                        <div className="mb-3">
                          <span className={`text-3xl font-bold px-4 py-2 rounded-xl ${getPerformanceColor(project.performance_score || 0)}`}>
                            {project.performance_score || 0}%
                          </span>
                          <p className="text-sm text-gray-600 mt-1">Performance Score</p>
                        </div>

                        {project.performance_score && (
                          <div className="w-32 bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all duration-300 ${
                                project.performance_score >= 90 ? 'bg-green-500' :
                                project.performance_score >= 80 ? 'bg-blue-500' :
                                project.performance_score >= 70 ? 'bg-yellow-500' :
                                project.performance_score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${project.performance_score}%` }}
                            />
                          </div>
                        )}

                        {project.trend && (
                          <div className={`flex items-center justify-end mt-2 text-sm ${
                            project.trend === 'up' ? 'text-green-600' :
                            project.trend === 'down' ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {project.trend === 'up' ? <ArrowUp className="h-4 w-4 mr-1" /> :
                             project.trend === 'down' ? <ArrowDown className="h-4 w-4 mr-1" /> : null}
                            {project.trend === 'up' ? 'Improving' :
                             project.trend === 'down' ? 'Declining' : 'Stable'}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Evaluation Modal */}
        <EvaluationModal />
      </div>
    </div>
  );
};

export default FYPRankingManagement;