// src/components/Dashboard/TemplateGuide.js
import React, { useEffect, useState } from 'react';
import { getTemplates } from '../../lib/supabase/client'; // Import the getTemplates function

const TemplateGuide = () => {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTemplates = async () => {
      const { data, error } = await getTemplates();
      if (error) {
        setError(error.message);
      } else {
        setTemplates(data);
      }
      setLoading(false);
    };
    fetchTemplates();
  }, []);

  // Basic filtering by category (assuming templates have a 'category' property)
  const businessTemplates = templates.filter(t => t.category === 'Business');
  const personalTemplates = templates.filter(t => t.category === 'Personal');
  const workTemplates = templates.filter(t => t.category === 'Specific Work');


  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Template Guide</h3>
      <p className="text-gray-600 mb-6">Explore our templates for various tasks to get started quickly.</p>

      {loading && <p className="text-blue-600">Loading templates...</p>}
      {error && <p className="text-red-600">Error loading templates: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Business Templates */}
          <div className="category-section border-r pr-6 md:border-r-0 md:pr-0">
            <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Business Templates</h4>
            {businessTemplates.length === 0 ? (
              <p className="text-gray-500 italic">No business templates available yet.</p>
            ) : (
              <ul>
                {businessTemplates.map(template => (
                  <li key={template.id} className="mb-3 pb-3 border-b last:border-b-0">
                    <p className="font-medium text-blue-600">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Personal Templates */}
          <div className="category-section border-r pr-6 md:border-r-0 md:pr-0">
            <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Personal Templates</h4>
             {personalTemplates.length === 0 ? (
              <p className="text-gray-500 italic">No personal templates available yet.</p>
            ) : (
              <ul>
                {personalTemplates.map(template => (
                  <li key={template.id} className="mb-3 pb-3 border-b last:border-b-0">
                    <p className="font-medium text-blue-600">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Specific Work Templates */}
          <div className="category-section">
            <h4 className="text-lg font-semibold mb-3 text-gray-700 border-b pb-2">Specific Work Templates</h4>
             {workTemplates.length === 0 ? (
              <p className="text-gray-500 italic">No specific work templates available yet.</p>
            ) : (
              <ul>
                {workTemplates.map(template => (
                  <li key={template.id} className="mb-3 pb-3 border-b last:border-b-0">
                    <p className="font-medium text-blue-600">{template.name}</p>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
      <div className="template-preview-area">
        {/* Placeholder for template previews or listings */}
        <p>Select a category to view templates.</p>
      </div>
      {/* Placeholder for search/filter functionality */}
      <div className="template-search-filter">
        {/* Search input and filter options */}
      </div>
    </div>
  );
};

export default TemplateGuide;