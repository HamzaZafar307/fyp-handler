import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Building,
  Trophy,
  Medal,
  Award,
  Star,
  TrendingUp,
  Users,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  RefreshCw,
  BarChart3,
  PieChart
} from 'lucide-react';
import rankingService from '../../services/rankingService';
import { toast } from 'react-hot-toast';

const FYPRankings = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filter states
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedSemester, setSelectedSemester] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('department'); // 'department', 'overall', 'search'

  // Data states
  const [departmentRankings, setDepartmentRankings] = useState([]);
  const [overallRankings, setOverallRankings] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [rankingStats, setRankingStats] = useState(null);

  // UI states
  const [expandedDepartments, setExpandedDepartments] = useState(new Set());
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  useEffect(() => {
    if (selectedYear) {
      loadRankings();
    }
  }, [selectedYear, selectedSemester, selectedDepartment, viewMode]);

  const initializeData = async () => {
    try {
      console.log('Initializing FYP Rankings data...');

      const [years, depts, cats] = await Promise.all([
        rankingService.getAvailableYears(),
        rankingService.getDepartments(),
        rankingService.getProjectCategories()
      ]);

      console.log('Available years:', years);
      console.log('Departments:', depts);
      console.log('Categories:', cats);

      setAvailableYears(years);
      setDepartments(depts);
      setCategories(cats);

      if (years.length > 0) {
        console.log('Setting selected year to:', years[0]);
        setSelectedYear(years[0]);
      }
    } catch (error) {
      console.error('Failed to load initial data:', error);
      toast.error('Failed to load initial data');
    }
  };

  const loadRankings = async () => {
    if (!selectedYear) return;

    setLoading(true);
    try {
      console.log('Loading rankings for:', { selectedYear, selectedSemester, viewMode });

      if (viewMode === 'department') {
        const [deptRankings, stats] = await Promise.all([
          rankingService.getAllDepartmentRankings(selectedYear, selectedSemester),
          rankingService.getRankingStats(selectedYear, selectedSemester)
        ]);

        console.log('Department rankings loaded:', deptRankings);
        console.log('Stats loaded:', stats);

        setDepartmentRankings(deptRankings);
        setRankingStats(stats);
      } else if (viewMode === 'overall') {
        const rankings = await rankingService.getYearlyRankings(selectedYear, selectedSemester, 50);
        console.log('Overall rankings loaded:', rankings);
        setOverallRankings(rankings);
      }
    } catch (error) {
      console.error('Error loading rankings:', error);
      toast.error('Failed to load rankings');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim() && !selectedCategory && !selectedDepartment) {
      toast.error('Please enter search terms or select filters');
      return;
    }

    setLoading(true);
    try {
      const results = await rankingService.searchProjects({
        year: selectedYear,
        semester: selectedSemester,
        department: selectedDepartment,
        category: selectedCategory,
        searchTerm: searchTerm.trim(),
        limit: 50
      });
      setSearchResults(results.projects || []);
      setViewMode('search');
    } catch (error) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadRankings();
    setRefreshing(false);
    toast.success('Rankings refreshed');
  };

  const toggleDepartmentExpansion = (deptId) => {
    const newExpanded = new Set(expandedDepartments);
    if (newExpanded.has(deptId)) {
      newExpanded.delete(deptId);
    } else {
      newExpanded.add(deptId);
    }
    setExpandedDepartments(newExpanded);
  };

  const getRankIcon = (position) => {
    if (position === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (position === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (position === 3) return <Award className="h-5 w-5 text-amber-600" />;
    return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold text-gray-500">#{position}</span>;
  };

  const getGradeColor = (grade) => {
    if (!grade) return 'bg-gray-100 text-gray-800';
    if (grade.startsWith('A')) return 'bg-green-100 text-green-800';
    if (grade.startsWith('B')) return 'bg-blue-100 text-blue-800';
    if (grade.startsWith('C')) return 'bg-yellow-100 text-yellow-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPerformanceColor = (score) => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                FYP Rankings & Performance
              </h1>
              <p className="text-lg text-gray-600">
                Discover top-performing Final Year Projects across departments and years
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex gap-3">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Download className="h-4 w-4 mr-2" />
                Export
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-8">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Search & Filters</h3>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Filter className="h-4 w-4 mr-1" />
                {showFilters ? 'Hide' : 'Show'} Filters
                {showFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
              </button>
            </div>

            {/* Search Bar */}
            <div className="flex gap-3 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects by title, supervisor, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={handleSearch}
                disabled={loading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {loading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
                <span className="ml-2 hidden sm:inline">Search</span>
              </button>
            </div>

            {/* Detailed Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                  <select
                    value={selectedDepartment}
                    onChange={(e) => setSelectedDepartment(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Departments</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.code}>{dept.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'department', name: 'Department Rankings', icon: Building },
                { id: 'overall', name: 'Overall Rankings', icon: Trophy },
                { id: 'search', name: 'Search Results', icon: Search }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id)}
                  className={`group flex items-center py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    viewMode === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <tab.icon className={`mr-2 h-5 w-5 ${
                    viewMode === tab.id ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-500'
                  }`} />
                  {tab.name}
                  {tab.id === 'search' && searchResults.length > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {searchResults.length}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-3 text-gray-600">Loading rankings...</span>
          </div>
        )}

        {/* Department Rankings View */}
        {!loading && viewMode === 'department' && (
          <div className="space-y-6">
            {rankingStats && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-blue-100 rounded-xl">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Total Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{rankingStats.total_projects}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-green-100 rounded-xl">
                      <Building className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Departments</p>
                      <p className="text-2xl font-bold text-gray-900">{rankingStats.total_departments}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-purple-100 rounded-xl">
                      <TrendingUp className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                      <p className="text-2xl font-bold text-gray-900">{rankingStats.avg_performance}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="p-3 bg-yellow-100 rounded-xl">
                      <Star className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm font-medium text-gray-600">A+ Projects</p>
                      <p className="text-2xl font-bold text-gray-900">{rankingStats.a_plus_count}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {departmentRankings.length === 0 ? (
              <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-12 text-center">
                <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Department Data Found</h3>
                <p className="text-gray-600 mb-4">
                  No projects found for {selectedYear} {selectedSemester || '(All Semesters)'}.
                </p>
                <p className="text-sm text-gray-500">
                  Try selecting a different year or semester filter.
                </p>
              </div>
            ) : (
              departmentRankings.map((dept) => (
                <div key={dept.department.id} className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
                  <div
                    className="px-6 py-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDepartmentExpansion(dept.department.id)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Building className="h-5 w-5 text-gray-400 mr-3" />
                        <h3 className="text-xl font-bold text-gray-900">{dept.department.name}</h3>
                        <span className="ml-3 bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                          {dept.projects.length} projects
                        </span>
                      </div>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-500 mr-3">
                          Avg: {dept.avg_performance}%
                        </span>
                        {expandedDepartments.has(dept.department.id) ?
                          <ChevronUp className="h-5 w-5 text-gray-400" /> :
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        }
                      </div>
                    </div>
                  </div>

                {expandedDepartments.has(dept.department.id) && (
                  <div className="divide-y divide-gray-100">
                    {dept.projects.slice(0, 10).map((project, index) => (
                      <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="mr-4 mt-1">
                              {getRankIcon(index + 1)}
                            </div>
                            <div className="flex-1">
                              <h4
                                className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
                                onClick={() => navigate(`/project/${project.id}`)}
                              >
                                {project.title}
                              </h4>
                              <div className="flex items-center text-sm text-gray-600 mb-3">
                                <Users className="h-4 w-4 mr-1" />
                                <span>{project.students?.join(', ') || 'Students not listed'}</span>
                                <span className="mx-3">•</span>
                                <Calendar className="h-4 w-4 mr-1" />
                                <span>{project.semester} {project.year}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(project.final_grade)}`}>
                                  {project.final_grade || 'N/A'}
                                </span>
                                {project.category && (
                                  <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                                    {project.category}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center mb-2">
                              <span className="text-sm text-gray-600 mr-2">Performance:</span>
                              <span className="font-bold text-gray-900">{project.performance_score}%</span>
                            </div>
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full transition-all duration-300 ${getPerformanceColor(project.performance_score)}`}
                                style={{ width: `${project.performance_score}%` }}
                              />
                            </div>
                            <button
                              onClick={() => navigate(`/project/${project.id}`)}
                              className="mt-2 p-2 text-gray-400 hover:text-blue-500 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                </div>
              ))
            )}
          </div>
        )}

        {/* Overall Rankings View */}
        {!loading && viewMode === 'overall' && (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Top FYP Projects - {selectedYear} {selectedSemester || '(All Semesters)'}
              </h2>
            </div>
            <div className="divide-y divide-gray-100">
              {overallRankings.map((project, index) => (
                <div key={project.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start">
                      <div className="mr-6 mt-1">
                        {getRankIcon(index + 1)}
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          {project.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Users className="h-4 w-4 mr-2" />
                            <span className="font-medium">Students:</span>
                            <span className="ml-1">{project.students?.join(', ') || 'Not listed'}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Building className="h-4 w-4 mr-2" />
                            <span className="font-medium">Department:</span>
                            <span className="ml-1">{project.department}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(project.final_grade)}`}>
                            Grade: {project.final_grade || 'N/A'}
                          </span>
                          <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                            {project.category}
                          </span>
                          <span className="text-sm text-gray-600">
                            {project.semester} {project.year}
                          </span>
                        </div>
                        {project.description && (
                          <p className="text-sm text-gray-700 line-clamp-2">{project.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="mb-3">
                        <span className="text-2xl font-bold text-gray-900">{project.performance_score}%</span>
                        <p className="text-sm text-gray-600">Performance Score</p>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-3 mb-3">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${getPerformanceColor(project.performance_score)}`}
                          style={{ width: `${project.performance_score}%` }}
                        />
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>Dept Rank: #{project.department_rank}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Search Results View */}
        {!loading && viewMode === 'search' && (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">
                Search Results ({searchResults.length} projects found)
              </h2>
              {searchTerm && (
                <p className="text-sm text-gray-600 mt-1">
                  Showing results for: "{searchTerm}"
                </p>
              )}
            </div>
            <div className="divide-y divide-gray-100">
              {searchResults.length === 0 ? (
                <div className="p-12 text-center">
                  <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No projects found matching your criteria.</p>
                  <p className="text-sm text-gray-500 mt-2">Try adjusting your search terms or filters.</p>
                </div>
              ) : (
                searchResults.map((project, index) => (
                  <div key={project.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3
                          className="text-lg font-semibold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors"
                          onClick={() => navigate(`/project/${project.id}`)}
                        >
                          {project.title}
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{project.students?.join(', ') || 'Not listed'}</span>
                          </div>
                          <div className="flex items-center">
                            <Building className="h-4 w-4 mr-1" />
                            <span>{project.department}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            <span>{project.semester} {project.year}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGradeColor(project.final_grade)}`}>
                            {project.final_grade || 'N/A'}
                          </span>
                          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                            {project.category}
                          </span>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="font-bold text-gray-900 mb-1">{project.performance_score}%</div>
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${getPerformanceColor(project.performance_score)}`}
                            style={{ width: `${project.performance_score}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FYPRankings;