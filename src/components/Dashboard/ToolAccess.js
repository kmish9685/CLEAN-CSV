// src/components/Dashboard/ToolAccess.js
import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Import useAuth hook
import { useTrial } from '../../contexts/TrialContext'; // Import useTrial hook
import toast from 'react-hot-toast'; // Import toast for notifications
import { incrementTrialUsage, getSessionId } from '../../lib/supabase/client'; // Import trial functions

const ToolAccess = () => {
  const { user, loading } = useAuth();
  const { trialCount, incrementUsage, isModalOpen } = useTrial(); // Use trial context

  const [selectedFile, setSelectedFile] = useState(null);
  const [cleaningLoading, setCleaningLoading] = useState(false);
  const [cleanedData, setCleanedData] = useState(null); // Store cleaned data

  // Placeholder for the CSV cleaning logic
  const cleanCSV = async (file) => {
    return new Promise((resolve) => {
      // Simulate cleaning process with a delay
      setTimeout(() => {
        // In a real application, you would parse and clean the CSV here.
        // For now, return mock cleaned data.
        const mockCleanedData = [
          ['Header 1', 'Header 2', 'Header 3'],
          ['Data A1', 'Data B1', 'Data C1'],
          ['Data A2', 'Data B2', 'Data C2'],
        ];
        resolve(mockCleanedData);
      }, 2000); // Simulate a 2-second cleaning time
    });
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setCleaningLoading(true);
      setCleanedData(null); // Clear previous cleaned data

      try {
        // Check if user is on trial and if trial is expired
        if (!user && await isTrialExpired(getSessionId())) {
             // The modal should handle the expired state, but we can add a toast here
             toast.error("Your trial has expired. Please log in or sign up to continue.");
             setCleaningLoading(false); // Stop loading if trial expired
             return;
        }

        const cleaned = await cleanCSV(file);
        setCleanedData(cleaned);
        setCleaningLoading(false);
        toast.success('CSV cleaned successfully!');

        // Track usage: For trial users, increment trial count
        if (!user) {
             await incrementTrialUsage(getSessionId());
             incrementUsage(); // Update trial count in context
        } else {
             // For authenticated users, track usage in usage_tracking table (implementation needed)
             // For now, we'll just log a message
             console.log("Tracking usage for authenticated user:", user.id);
             // You would call a Supabase function here to track usage
             // e.g., await supabase.from('usage_tracking').insert([{ user_id: user.id, feature: 'clean_csv', ... }]);
        }

      } catch (error) {
        setCleaningLoading(false);
        setError(error.message); // Assuming you have an error state
        toast.error('Error cleaning CSV.');
      }
    }
  };

  const handleDownload = () => {
    if (cleanedData) {
      // Placeholder for generating and downloading the CSV file
      const csvContent = cleanedData.map(row => row.join(',')).join('\n');
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', 'cleaned.csv');
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Cleaned CSV downloaded!');
    }
  };

    // Show a message if user is not authenticated and not loading
    if (!loading && !user) {
        return (
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
                <h3 className="text-xl font-semibold mb-4">Access the Clean CSV Tool</h3>
                <p className="text-gray-600 mb-4">Log in or sign up for free to use our powerful CSV cleaning tool and start your 2 free trials!</p>
                {/* You can add login/signup buttons here that navigate */}
                {/* <button className="bg-blue-500 text-white px-4 py-2 rounded mr-2">Login</button> */}
                {/* <button className="bg-green-500 text-white px-4 py-2 rounded">Sign Up</button> */}
            </div>
        );
    }


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      {/* Welcome Message */}
      {user && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-800">
            Welcome, {user.email}! {/* Display user email */}
          </h3>
          <p className="text-gray-600">Clean and organize your CSV files effortlessly with Clean CSV.</p>
           {!user && (
             <p className="text-gray-600">You have {2 - trialCount} free uses remaining.</p>
           )}
        </div>
      )}

      {/* File Upload */}
      <div className="mb-4">
        <label className="inline-block bg-blue-500 text-white px-4 py-2 rounded-md cursor-pointer shadow hover:bg-blue-600 transition-colors">
          Upload Messy CSV
          <input
            type="file"
            accept=".csv"
            onChange={handleFileUpload}
            className="hidden"
            disabled={cleaningLoading}
          />
        </label>
        {selectedFile && (
          <span className="ml-2 text-gray-700">Selected: {selectedFile.name}</span>
        )}
      </div>

      {/* Loading Indicator */}
      {cleaningLoading && (
        <div className="text-center text-blue-600 font-semibold my-4">
          Cleaning your CSV...
        </div>
      )}

      {/* Preview Table */}
      {cleanedData && (
        <div className="mt-6">
          <h4 className="text-lg font-semibold mb-2">Cleaned CSV Preview:</h4>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-gray-100 rounded-md overflow-hidden shadow-sm">
              <thead>
                <tr>
                  {cleanedData[0].map((header, index) => (
                    <th key={index} className="px-4 py-2 border-b text-left text-sm font-medium text-gray-700">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {cleanedData.slice(1).map((row, rowIndex) => (
                  <tr key={rowIndex} className="border-b last:border-b-0">
                    {row.map((cell, cellIndex) => (
                      <td key={cellIndex} className="px-4 py-2 text-sm text-gray-800">{cell}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Download Button */}
      {cleanedData && (
        <div className="mt-6 text-center">
          <button
            onClick={handleDownload}
            className="bg-green-500 text-white px-6 py-2 rounded-md shadow hover:bg-green-600 transition-colors"
          >
            Download Cleaned CSV
          </button>
        </div>
      )}
    </div>
  );
};

export default ToolAccess;
