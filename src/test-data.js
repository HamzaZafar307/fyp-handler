// Simple test file to verify data imports
import {
  sampleDepartments,
  sampleCategories,
  sampleYears,
  sampleFYPProjects
} from './data/sampleFYPData';

console.log('=== DATA IMPORT TEST ===');
console.log('sampleDepartments:', sampleDepartments);
console.log('sampleCategories:', sampleCategories);
console.log('sampleYears:', sampleYears);
console.log('sampleFYPProjects:', sampleFYPProjects);

// Test filtering
const projectsFor2024 = sampleFYPProjects.filter(p => p.year === 2024);
console.log('Projects for 2024:', projectsFor2024);

export { sampleDepartments, sampleCategories, sampleYears, sampleFYPProjects };