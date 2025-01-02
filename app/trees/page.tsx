'use client'

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {useRouter} from 'next/navigation'
import Spinner from '@/components/ui/spinner';

const TreesPage = () => {
  const [data, setData] = useState<any[]>([]);  // Start with an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('Fetching data from /api/getData');
        const response = await fetch('/api/getData');
        console.log('Response Status:', response.status);
        const text = await response.text();
        console.log('Raw Response Text:', text);

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status}`);
        }

        const result = JSON.parse(text);  // Parse the JSON response
        console.log('Parsed Data:', result);

        // Convert the Firebase object into an array of values
        const treeData = Object.keys(result).map(key => ({
          id: key,
          ...result[key],
        }));

        setData(treeData);  // Set the array of tree data
      } catch (error: any) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className='bg-black text-white p-4 min-h-screen justify-center items-center flex'>
    <Spinner />
  </div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="p-4 min-h-screen bg-black overflow-auto">
      <div className='mt-24'>
     <Button onClick={()=>router.push('/sign-in')}>Sign In to Update or Register</Button>
      <h1 className="text-2xl font-semibold mb-4 text-white font-roboto_mono mt-20">Trees Data</h1>

      {/* Responsive table wrapper */}
      <div className="overflow-x-auto sm:overflow-x-visible">
        <table className="min-w-full table-auto border-collapse border border-gray-200 text-white font-roboto_mono hidden sm:table">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left border-b ">Tree ID</th>
              <th className="px-4 py-2 text-left border-b">Name</th>
              <th className="px-4 py-2 text-left border-b">Height</th>
              <th className="px-4 py-2 text-left border-b">Location</th>
              <th className="px-4 py-2 text-left border-b">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(data) && data.map((tree, index) => (
              <tr key={index} className={`${index % 2 === 0 ? 'bg-black' : ''}`}>
                <td className="px-4 py-2 border-b">{tree.id}</td>
                <td className="px-4 py-2 border-b">{tree.name}</td>
                <td className="px-4 py-2 border-b">{tree.height}</td>
                <td className="px-4 py-2 border-b">
                  {tree.location ? `${tree.location.lat}, ${tree.location.lon}` : 'N/A'}
                </td>
                <td className="px-4 py-2 border-b">{new Date(tree.timestamp).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Stacked Layout for Small Screens */}
        <div className="sm:hidden">
          {Array.isArray(data) && data.map((tree, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-800 text-white rounded-lg">
              <div className="mb-2"><strong>Tree ID:</strong> {tree.id}</div>
              <div className="mb-2"><strong>Name:</strong> {tree.name}</div>
              <div className="mb-2"><strong>Height:</strong> {tree.height}</div>
              <div className="mb-2">
                <strong>Location:</strong> {tree.location ? `${tree.location.lat}, ${tree.location.lon}` : 'N/A'}
              </div>
              <div className="mb-2">
                <strong>Timestamp:</strong> {new Date(tree.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default TreesPage;
