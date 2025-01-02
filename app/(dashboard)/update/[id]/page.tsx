'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ref, get, update } from 'firebase/database';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import React from 'react';
import Spinner from '@/components/ui/spinner';

export default function UpdateTree({ params }: { params: Promise<{ id: string }> }) {
  const [treeData, setTreeData] = useState({ name: '', height: '' });
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [errors, setErrors] = useState({ height: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();

  // Unwrap params using React.use() to access treeId
  const { id } = React.use(params);

  useEffect(() => {
    if (!id) return;

    const fetchTreeData = async () => {
      try {
        const treeRef = ref(db, `trees/${id}`);
        const snapshot = await get(treeRef);

        if (snapshot.exists()) {
          setTreeData(snapshot.val());
        } else {
          router.push(`/register/${id}`);
        }
      } catch (error) {
        console.error('Failed to fetch tree data:', error);
      }
    };

    fetchTreeData();
  }, [id, router]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
          setIsLocationLoading(false);
        },
        (error) => {
          console.error('Error getting geolocation:', error);
          setIsLocationLoading(false);
        }
      );
    } else {
      console.error('Geolocation is not supported by this browser.');
      setIsLocationLoading(false);
    }
  }, []);

  const validateInputs = () => {
    const newErrors = { height: '' };

    if (!treeData.height.trim() || isNaN(Number(treeData.height))) {
      newErrors.height = 'Tree height must be a valid number.';
    }

    setErrors(newErrors);

    return !newErrors.height;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await update(ref(db, `trees/${id}`), {
        ...treeData,
        location,
      });

      setShowSuccessPopup(true);

      // Redirect to /home after 2 seconds
      setTimeout(() => {
        router.push('/home');
      }, 2000);
    } catch (error) {
      console.error('Failed to update tree:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen w-svw flex justify-center">
      <div className="p-4 mt-36 justify-center items-center w-1/2">
        <h1 className="text-xl font-bold text-white mb-4 font-roboto">Update Tree</h1>

        <form onSubmit={handleSubmit} className="space-y-4 text-white">
          <div>
            <Input
              type="text"
              value={treeData.name}
              onChange={(e) => setTreeData({ ...treeData, name: e.target.value })}
              placeholder="Tree Name"
              disabled
              className="bg-gray-400 text-black"
            />
          </div>

          <div>
            <Input
              type="text"
              value={treeData.height}
              onChange={(e) => setTreeData({ ...treeData, height: e.target.value })}
              placeholder="Tree Height"
            />
            {errors.height && <p className="text-red-500 mt-1">{errors.height}</p>}
          </div>

          {isLocationLoading ? (
            <div className="flex items-center space-x-2">
              <Spinner />
              <p className="font-roboto_mono">Location loading...</p>
            </div>
          ) : (
            location && (
              <div>
                <p className="font-roboto_mono">Latitude: {location.lat}</p>
                <p className="font-roboto_mono">Longitude: {location.lon}</p>
              </div>
            )
          )}

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner
            className='w-10 h-10' /> : 'Submit'}
          </Button>
        </form>
      </div>

      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center">
          <div className="bg-black p-8 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4 text-slate-500 font-roboto">Success!</h2>
            <p className="text-white font-roboto_mono">Tree updated successfully. Redirecting...</p>
          </div>
        </div>
      )}
      
    </div>
  );
}
