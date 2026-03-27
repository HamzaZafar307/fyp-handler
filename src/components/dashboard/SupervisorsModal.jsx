import React, { useState, useEffect } from 'react';
import { X, Search, User, Mail, Building, ExternalLink } from 'lucide-react';
import projectService from '../../services/projectService';

const SupervisorsModal = ({ isOpen, onClose }) => {
  const [supervisors, setSupervisors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchSupervisors();
    }
  }, [isOpen]);

  const fetchSupervisors = async () => {
    try {
      setLoading(true);
      const data = await projectService.getSupervisors();
      setSupervisors(data);
    } catch (error) {
      console.error("Failed to fetch supervisors", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const filteredSupervisors = supervisors.filter(s => 
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Find Supervisors</h2>
            <p className="text-sm text-gray-500">Connect with faculty members for your FYP</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
            <X className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-gray-100">
          <div className="relative">
            <Search className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredSupervisors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
              {filteredSupervisors.map((supervisor) => (
                <div key={supervisor.id} className="border border-gray-100 rounded-xl p-4 hover:bg-blue-50 transition-colors group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-lg mr-4">
                        {supervisor.firstName[0]}{supervisor.lastName[0]}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900">{supervisor.firstName} {supervisor.lastName}</h3>
                        <div className="flex items-center text-sm text-gray-600 mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          {supervisor.department}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <a 
                        href={`mailto:${supervisor.email}`}
                        className="flex items-center text-xs font-medium text-blue-600 hover:text-blue-800"
                      >
                        <Mail className="h-3 w-3 mr-1" />
                        {supervisor.email}
                      </a>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 rounded-lg text-xs font-semibold hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                        View Profile
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <User className="h-12 w-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No supervisors found matching your search.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupervisorsModal;
