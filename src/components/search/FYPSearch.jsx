import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  Filter,
  Calendar,
  Building,
  BookOpen,
  Users,
  Trophy,
  Star,
  TrendingUp,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
  Eye,
  Download,
  BarChart3
} from 'lucide-react';
import rankingService from '../../services/rankingService';
import { toast } from 'react-hot-toast';

const FYPSearch = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Search and filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    year: new Date().getFullYear(),
    semester: '',
    department: '',
    category: '',
    minGrade: '',
    sortBy: 'performance_score',
    sortOrder: 'desc'
  });

  // UI states
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedFiltersCount, setSelectedFiltersCount] = useState(0);

  // Data states
  const [searchResults, setSearchResults] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  });

  // Statistics
  const [searchStats, setSearchStats] = useState(null);

  useEffect(() => {
    initializeData();

    // Parse URL parameters if any
    const urlParams = new URLSearchParams(location.search);
    if (urlParams.get('year')) {
      setFilters(prev => ({ ...prev, year: parseInt(urlParams.get('year')) }));
    }
    if (urlParams.get('search')) {
      setSearchTerm(urlParams.get('search'));
    }
  }, [location]);

  useEffect(() => {
    if (searchTerm || hasActiveFilters()) {
      handleSearch();
    }
  }, [filters.year, filters.semester, filters.department, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    // Count active filters
    let count = 0;
    if (filters.semester) count++;
    if (filters.department) count++;
    if (filters.category) count++;
    if (filters.minGrade) count++;
    setSelectedFiltersCount(count);
  }, [filters]);

  const initializeData = async () => {
    try {
      console.log('Initializing FYP Search data...');

      const [years, depts, cats] = await Promise.all([
        rankingService.getAvailableYears(),
        rankingService.getDepartments(),
        rankingService.getProjectCategories()
      ]);

      console.log('Search - Available years:', years);
      console.log('Search - Departments:', depts);
      console.log('Search - Categories:', cats);

      setAvailableYears(years);
      setDepartments(depts);
      setCategories(cats);
    } catch (error) {
      console.error('Failed to load filter options:', error);
      toast.error('Failed to load filter options');
    }
  };

  const hasActiveFilters = () => {
    return filters.semester || filters.department || filters.category || filters.minGrade;
  };

  const handleSearch = async (newPage = 1) => {
    setLoading(true);

    try {
      const searchFilters = {
        ...filters,
        searchTerm: searchTerm.trim(),
        page: newPage,
        limit: pagination.limit
      };

      const response = await rankingService.searchProjects(searchFilters);

      setSearchResults(response.projects || []);
      setPagination({
        page: newPage,
        limit: pagination.limit,
        total: response.total || 0,
        totalPages: Math.ceil((response.total || 0) / pagination.limit)
      });
      setSearchStats(response.stats || null);

      // Update URL with search parameters
      const urlParams = new URLSearchParams();
      if (searchTerm.trim()) urlParams.set('search', searchTerm.trim());
      if (filters.year) urlParams.set('year', filters.year.toString());
      if (filters.semester) urlParams.set('semester', filters.semester);
      if (filters.department) urlParams.set('department', filters.department);

      navigate(`${location.pathname}?${urlParams.toString()}`, { replace: true });
    } catch (error) {
      toast.error('Search failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearAllFilters = () => {
    setFilters({
      year: new Date().getFullYear(),
      semester: '',
      department: '',
      category: '',
      minGrade: '',
      sortBy: 'performance_score',
      sortOrder: 'desc'
    });
    setSearchTerm('');
    setSearchResults([]);
    setSearchStats(null);
  };

  const handleYearSearch = (year) => {
    setFilters(prev => ({ ...prev, year: parseInt(year) }));
    if (!searchTerm.trim() && !hasActiveFilters()) {
      handleSearch();
    }
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

  const Pagination = () => {
    if (pagination.totalPages <= 1) return null;

    const pageNumbers = [];
    const maxVisiblePages = 7;

    let startPage = Math.max(1, pagination.page - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(pagination.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-8">
        <button
          onClick={() => handleSearch(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>

        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => handleSearch(number)}
            className={`px-3 py-2 text-sm font-medium border rounded-md ${
              pagination.page === number
                ? 'bg-blue-600 text-white border-blue-600'
                : 'text-gray-500 bg-white border-gray-300 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => handleSearch(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Search FYP Projects
          </h1>
          <p className="text-lg text-gray-600">
            Find and explore Final Year Projects by year, department, or keywords
          </p>
        </div>

        {/* Quick Year Search */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Year Search</h3>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
            {availableYears.map(year => (
              <button
                key={year}
                onClick={() => handleYearSearch(year)}
                className={`p-3 text-center border-2 rounded-xl font-semibold transition-all duration-200 ${
                  filters.year === year
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 text-gray-700'
                }`}
              >
                <Calendar className="h-4 w-4 mx-auto mb-1" />
                <span className="text-sm">{year}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main Search */}
        <div className="bg-white shadow-lg rounded-xl border border-gray-100 mb-6">
          <div className="p-6">
            {/* Search Bar */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by project title, supervisor, students, or keywords..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-4 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => handleSearch()}
                disabled={loading}
                className="px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center font-semibold"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
            </div>

            {/* Filter Controls */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Advanced Filters
                  {selectedFiltersCount > 0 && (
                    <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {selectedFiltersCount}
                    </span>
                  )}
                  {showAdvancedFilters ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
                </button>

                {(searchTerm || selectedFiltersCount > 0) && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center px-3 py-2 text-red-600 hover:bg-red-50 border border-red-300 rounded-lg transition-colors text-sm"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="performance_score">Performance Score</option>
                  <option value="final_grade">Grade</option>
                  <option value="year">Year</option>
                  <option value="title">Title</option>
                  <option value="citations">Citations</option>
                </select>
                <select
                  value={filters.sortOrder}
                  onChange={(e) => handleFilterChange('sortOrder', e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
                >
                  <option value="desc">Highest First</option>
                  <option value="asc">Lowest First</option>
                </select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="border-t border-gray-200 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <select
                      value={filters.year}
                      onChange={(e) => handleFilterChange('year', parseInt(e.target.value))}
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
                      value={filters.semester}
                      onChange={(e) => handleFilterChange('semester', e.target.value)}
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
                      value={filters.department}
                      onChange={(e) => handleFilterChange('department', e.target.value)}
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
                      value={filters.category}
                      onChange={(e) => handleFilterChange('category', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">All Categories</option>
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Grade</label>
                    <select
                      value={filters.minGrade}
                      onChange={(e) => handleFilterChange('minGrade', e.target.value)}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Any Grade</option>
                      <option value="A+">A+ and above</option>
                      <option value="A">A and above</option>
                      <option value="A-">A- and above</option>
                      <option value="B+">B+ and above</option>
                      <option value="B">B and above</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Search Results */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Searching projects...</span>
          </div>
        )}

        {/* Search Statistics */}
        {!loading && searchStats && (
          <div className="bg-white shadow-lg rounded-xl border border-gray-100 p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Results Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-xl mr-4">
                  <BookOpen className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Projects Found</p>
                  <p className="text-2xl font-bold text-gray-900">{pagination.total}</p>
                </div>
              </div>

              {searchStats.avg_performance && (
                <div className="flex items-center">
                  <div className="p-3 bg-green-100 rounded-xl mr-4">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Avg Performance</p>
                    <p className="text-2xl font-bold text-gray-900">{searchStats.avg_performance}%</p>
                  </div>
                </div>
              )}

              {searchStats.departments_count && (
                <div className="flex items-center">
                  <div className="p-3 bg-purple-100 rounded-xl mr-4">
                    <Building className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">{searchStats.departments_count}</p>
                  </div>
                </div>
              )}

              {searchStats.top_grade_count && (
                <div className="flex items-center">
                  <div className="p-3 bg-yellow-100 rounded-xl mr-4">
                    <Trophy className="h-6 w-6 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600">A+ Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{searchStats.top_grade_count}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Results List */}
        {!loading && searchResults.length > 0 && (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  Search Results ({pagination.total} projects)
                </h2>
                <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                  <Download className="h-4 w-4 mr-2" />
                  Export Results
                </button>
              </div>
            </div>

            <div className="divide-y divide-gray-100">
              {searchResults.map((project) => (
                <div key={project.id} className="p-8 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3
                        className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 cursor-pointer transition-colors"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        {project.title}
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          <span className="font-medium">Students:</span>
                          <span className="ml-1">{project.students?.join(', ') || 'Not listed'}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2" />
                          <span className="font-medium">Department:</span>
                          <span className="ml-1">{project.department}</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span className="font-medium">Year:</span>
                          <span className="ml-1">{project.semester} {project.year}</span>
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-gray-700 mb-4 line-clamp-2">{project.description}</p>
                      )}

                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getGradeColor(project.final_grade)}`}>
                          Grade: {project.final_grade || 'N/A'}
                        </span>
                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                          {project.category}
                        </span>
                        {project.citations > 0 && (
                          <span className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 mr-1 text-yellow-400" />
                            {project.citations} citations
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right ml-6">
                      <div className="mb-3">
                        <span className="text-3xl font-bold text-gray-900">{project.performance_score}%</span>
                        <p className="text-sm text-gray-600">Performance Score</p>
                      </div>
                      <div className="w-32 bg-gray-200 rounded-full h-3 mb-4">
                        <div
                          className={`h-3 rounded-full transition-all duration-300 ${getPerformanceColor(project.performance_score)}`}
                          style={{ width: `${project.performance_score}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => navigate(`/project/${project.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Pagination />
          </div>
        )}

        {/* No Results */}
        {!loading && searchResults.length === 0 && (searchTerm || hasActiveFilters()) && (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-12 text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No projects found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search terms or filters to find more projects.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters & Search All Projects
            </button>
          </div>
        )}

        {/* Initial State */}
        {!loading && searchResults.length === 0 && !searchTerm && !hasActiveFilters() && (
          <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-12 text-center">
            <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Search FYP Projects</h3>
            <p className="text-gray-600 mb-6">
              Use the search bar above or select a year to explore Final Year Projects.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => handleYearSearch(new Date().getFullYear())}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                View {new Date().getFullYear()} Projects
              </button>
              <button
                onClick={() => navigate('/rankings')}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                View Rankings
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FYPSearch;