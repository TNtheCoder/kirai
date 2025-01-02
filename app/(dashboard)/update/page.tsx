'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@clerk/nextjs';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react'; // Import icons

const UpdatePage = () => {
  const [data, setData] = useState<any[]>([]); // Start with an empty array
  const [expandedRows, setExpandedRows] = useState<string[]>([]); // Track expanded rows
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { isLoaded, userId } = useAuth(); // Clerk auth state

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/getData');

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = await response.json();

        // Convert the Firebase object into an array of values
        const treeData = Object.keys(result).map((key) => ({
          id: key,
          ...result[key],
        }));

        setData(treeData); // Set the array of tree data
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const toggleRow = (id: string) => {
    setExpandedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="bg-black overflow-x-auto flex flex-col items-center min-h-screen mt-24 px-10 py-10">
      <h1 className="text-2xl font-semibold mb-4 text-white font-roboto_mono mt-20">Update Trees Data</h1>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto sm:overflow-x-visible">
        {/* Table for larger screens */}
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-white font-roboto_mono sm:block hidden">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Height</th>
              <th className="px-4 py-2 text-left border-b">Location</th>
              <th className="px-4 py-2 text-left border-b">Actions</th>
              <th className="px-4 py-2 text-left border-b"></th> {/* New column for arrows */}
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) &&
              data.map((tree) => (
                <React.Fragment key={tree.id}>
                  {/* Main Row */}
                  
                  <tr className="hover:bg-gray-700 cursor-pointer" onClick={() => toggleRow(tree.id)}>
                    <td className="px-4 py-2 border-b">{tree.name}</td>
                    <td className="px-4 py-2 border-b">{tree.height}</td>
                    <td className="px-4 py-2 border-b">
                      {tree.location ? `${tree.location.lat}, ${tree.location.lon}` : 'N/A'}
                    </td>
                    <td className="px-4 py-2 border-b">
                      {isLoaded && userId ? (
                        <button
                          className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            router.push(`/update/${tree.id}`);
                          }}
                        >
                          Update
                        </button>
                      ) : (
                        <p className="text-gray-400 text-sm">Login to update</p>
                      )}
                    </td>
                    <td className="px-4 py-2 border-b  items-center justify-center">
                      {expandedRows.includes(tree.id) ? (
                        <ChevronUpIcon className="text-white w-4 h-4 cursor-pointer" />
                      ) : (
                        <ChevronDownIcon className="text-white w-4 h-4 cursor-pointer" />
                      )}
                    </td>
                  </tr>


                  {/* Collapsible Row */}
                  {expandedRows.includes(tree.id) && (
                    <tr className="bg-gray-800">
                      <td colSpan={5} className="px-4 py-2 border-b">
                        <div>
                          <h3 className="text-lg font-semibold mb-2 text-white">
                            Updates for {tree.name}
                          </h3>
                          <ul className="list-disc ml-5">
                            {tree.heightUpdates && Object.keys(tree.heightUpdates).length > 0 ? (
                              Object.keys(tree.heightUpdates).map((key) => {
                                const update = tree.heightUpdates[key];
                                return (
                                  <li key={key} className="mb-1 text-gray-200">
                                    <strong>Height:</strong> {update.height} &nbsp;
                                    <strong>Time:</strong>{' '}
                                    {new Date(update.timestamp).toLocaleString()}
                                  </li>
                                );
                              })
                            ) : (
                              <li className="text-gray-400 font-roboto">No updates available.</li>
                            )}
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
          </tbody>
        </table>

        {/* Stacked Layout for Small Screens */}
        <div className="sm:hidden w-full">
          {Array.isArray(data) &&
            data.map((tree) => (
              <div key={tree.id} className="mb-4 p-4 bg-gray-800 text-white rounded-lg w-full min-w-[263.2px] max-w-[263.2px]">
                <div className="mb-2">
                  <strong>Name:</strong> {tree.name}
                </div>
                <div className="flex justify-between items-center">
                  <span>
                    <strong>Height:</strong> {tree.height}
                  </span>
                  <div onClick={() => toggleRow(tree.id)}>
                    {expandedRows.includes(tree.id) ? (
                      <ChevronUpIcon className="text-white w-4 h-4 cursor-pointer" />
                    ) : (
                      <ChevronDownIcon className="text-white w-4 h-4 cursor-pointer" />
                    )}
                  </div>
                </div>

                <div className={`mt-2 ${expandedRows.includes(tree.id) ? 'block' : 'hidden'}`}>
                  <h3 className="text-lg font-semibold mb-2">Previous Updates</h3>
                  <ul className="list-disc ml-5">
                    {tree.heightUpdates && Object.keys(tree.heightUpdates).length > 0 ? (
                      Object.keys(tree.heightUpdates).map((key) => {
                        const update = tree.heightUpdates[key];
                        return (
                          <li key={key} className="mb-1 text-gray-200">
                            <strong>Time:</strong>{' '}
                            {new Date(update.timestamp).toLocaleString()} &nbsp;
                            <strong>Height:</strong> {update.height}
                          </li>
                        );
                      })
                    ) : (
                      <li className="text-gray-400 font-roboto">No updates available.</li>
                    )}

                    {isLoaded && userId && (
                      <button
                        className="text-white bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-sm mt-4"
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/update/${tree.id}`);
                        }}
                      >
                        Update
                      </button>
                    )}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default UpdatePage;
