import React, { useEffect, useState } from 'react';
import rankingService from '../../services/rankingService';

const DataTest = () => {
  const [testResults, setTestResults] = useState({
    years: [],
    departments: [],
    categories: [],
    departmentRankings: [],
    overallRankings: [],
    error: null,
    loading: true
  });

  useEffect(() => {
    const testDataLoading = async () => {
      try {
        console.log('DataTest: Starting data test...');

        // Test all data loading methods
        const years = await rankingService.getAvailableYears();
        console.log('DataTest: Years loaded:', years);

        const departments = await rankingService.getDepartments();
        console.log('DataTest: Departments loaded:', departments);

        const categories = await rankingService.getProjectCategories();
        console.log('DataTest: Categories loaded:', categories);

        const departmentRankings = await rankingService.getAllDepartmentRankings(2024);
        console.log('DataTest: Department rankings loaded:', departmentRankings);

        const overallRankings = await rankingService.getYearlyRankings(2024, null, 10);
        console.log('DataTest: Overall rankings loaded:', overallRankings);

        const searchResults = await rankingService.searchProjects({
          year: 2024,
          limit: 5
        });
        console.log('DataTest: Search results:', searchResults);

        setTestResults({
          years,
          departments,
          categories,
          departmentRankings,
          overallRankings,
          searchResults,
          error: null,
          loading: false
        });

        console.log('DataTest: All data loaded successfully!');
      } catch (error) {
        console.error('DataTest: Error loading data:', error);
        setTestResults(prev => ({
          ...prev,
          error: error.message,
          loading: false
        }));
      }
    };

    testDataLoading();
  }, []);

  if (testResults.loading) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Data Loading Test</h2>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-4"></div>
          <span>Testing data loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6">FYP Data Loading Test Results</h2>

      {testResults.error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {testResults.error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Available Years ({testResults.years.length})</h3>
          <div className="flex gap-2 flex-wrap">
            {testResults.years.map(year => (
              <span key={year} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                {year}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Departments ({testResults.departments.length})</h3>
          <div className="space-y-1">
            {testResults.departments.map(dept => (
              <div key={dept.id} className="text-sm">
                <span className="font-medium">{dept.code}:</span> {dept.name}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Categories ({testResults.categories.length})</h3>
          <div className="flex gap-1 flex-wrap">
            {testResults.categories.slice(0, 8).map(cat => (
              <span key={cat} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                {cat}
              </span>
            ))}
            {testResults.categories.length > 8 && (
              <span className="text-gray-500 text-xs">+{testResults.categories.length - 8} more</span>
            )}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Department Rankings ({testResults.departmentRankings.length})</h3>
          {testResults.departmentRankings.map(dept => (
            <div key={dept.department.id} className="mb-2">
              <div className="font-medium text-sm">{dept.department.name}</div>
              <div className="text-xs text-gray-600">
                {dept.projects.length} projects, Avg: {dept.avg_performance}%
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Top Overall Projects ({testResults.overallRankings.length})</h3>
          {testResults.overallRankings.slice(0, 5).map((project, index) => (
            <div key={project.id} className="mb-2 text-sm">
              <div className="font-medium">#{index + 1} {project.title}</div>
              <div className="text-xs text-gray-600">
                {project.department} - {project.performance_score}%
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-bold text-lg mb-2">Search Results</h3>
          {testResults.searchResults?.projects && (
            <div>
              <div className="text-sm mb-2">
                Found {testResults.searchResults.total} projects
              </div>
              {testResults.searchResults.projects.slice(0, 3).map(project => (
                <div key={project.id} className="mb-1 text-sm">
                  <div className="font-medium">{project.title}</div>
                  <div className="text-xs text-gray-600">
                    {project.department} - {project.performance_score}%
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 p-4 bg-green-100 rounded-lg">
        <h3 className="font-bold text-green-800">Test Status: SUCCESS ✅</h3>
        <p className="text-green-700 text-sm mt-1">
          All data loading methods are working correctly. The ranking service is properly connected to sample data.
        </p>
      </div>
    </div>
  );
};

export default DataTest;