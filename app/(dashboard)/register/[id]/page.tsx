'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, get, update } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { serverTimestamp } from 'firebase/database'; // Import serverTimestamp
import React from 'react';

export default function RegisterTree({ params }: { params: Promise<{ id: string }> }) {
  const [treeData, setTreeData] = useState({ name: '', height: '' });
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [errors, setErrors] = useState({ name: '', height: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // Unwrap params using React.use() to access treeId
  const { id } = React.use(params); // React.use() unwraps the Promise

  useEffect(() => {
    if (!id) return;

    const fetchTreeData = async () => {
      try {
        const treeRef = ref(db, `trees/${id}`);
        const snapshot = await get(treeRef);

        if (snapshot.exists()) {
          setTreeData(snapshot.val());
        } else {
          // If tree does not exist, redirect to registration page
          router.push(`/register/${id}`);
        }
      } catch (error) {
        console.error('Failed to fetch tree data:', error);
      }
    };

    fetchTreeData();
  }, [id, router]);

  // Fetch geolocation when the component mounts
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting geolocation:', error);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
    }
  }, []);

  const validateInputs = () => {
    const newErrors = { name: '', height: '' };

    if (!treeData.name.trim()) {
      newErrors.name = 'Tree name is required.';
    }

    if (!treeData.height.trim() || isNaN(Number(treeData.height))) {
      newErrors.height = 'Tree height must be a valid number.';
    }

    setErrors(newErrors);

    // Return true if no errors
    return !newErrors.name && !newErrors.height;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare the data with timestamp
      const newTreeData = {
        ...treeData,
        location,
        timestamp: serverTimestamp(), // Add timestamp to the data
      };

      // Update tree information in Firebase
      await update(ref(db, `trees/${id}`), newTreeData);

      router.push(`/update/${id}`);
    } catch (error) {
      console.error('Failed to update tree:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen w-svw flex justify-center">
      <div className="p-4 mt-36 justify-center items-center w-1/2">
        <h1 className="text-xl font-bold font-roboto text-white mb-4">Register Tree</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <Input
              type="text"
              value={treeData.name}
              onChange={(e) => setTreeData({ ...treeData, name: e.target.value })}
              placeholder="Tree Name"
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>

          <div>
            <Input
              type="text"
              value={treeData.height}
              onChange={(e) => setTreeData({ ...treeData, height: e.target.value })}
              placeholder="Tree Height"
            />
            {errors.height && <p className="text-red-500">{errors.height}</p>}
          </div>

          {location && (
            <div>
              <p>Latitude: {location.lat}</p>
              <p>Longitude: {location.lon}</p>
            </div>
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </form>
      </div>
    </div>
  );
}
