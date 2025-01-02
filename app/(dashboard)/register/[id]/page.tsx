'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '@/lib/firebase';
import { ref, get, update, serverTimestamp } from 'firebase/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Spinner from '@/components/ui/spinner';

export default function RegisterTree({ params }: { params: Promise<{ id: string }> }) {
  const [treeData, setTreeData] = useState({ name: '', height: '' });
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(null);
  const [errors, setErrors] = useState({ name: '', height: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocationLoading, setIsLocationLoading] = useState(true);
  const [treeId, setTreeId] = useState<string | null>(null);
  const [isPopupVisible, setIsPopupVisible] = useState(false); // State for popup visibility
  const router = useRouter();

  useEffect(() => {
    const resolveParams = async () => {
      const unwrappedParams = await params;
      setTreeId(unwrappedParams.id);
    };
    resolveParams();
  }, [params]);

  useEffect(() => {
    if (!treeId) return;

    const fetchTreeData = async () => {
      try {
        const treeRef = ref(db, `trees/${treeId}`);
        const snapshot = await get(treeRef);

        if (snapshot.exists()) {
          setTreeData(snapshot.val());
        } else {
          router.push(`/register/${treeId}`);
        }
      } catch (error) {
        console.error('Failed to fetch tree data:', error);
      }
    };

    fetchTreeData();
  }, [treeId, router]);

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
    const newErrors = { name: '', height: '' };

    if (!treeData.name.trim()) {
      newErrors.name = 'Tree name is required.';
    }

    if (!treeData.height.trim() || isNaN(Number(treeData.height))) {
      newErrors.height = 'Tree height must be a valid number.';
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.height;
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!validateInputs()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newTreeData = {
        ...treeData,
        location,
        timestamp: serverTimestamp(),
      };

      await update(ref(db, `trees/${treeId}`), newTreeData);

      // Show success popup
      setIsPopupVisible(true);

      // Redirect to update page after showing the popup for a brief time
      setTimeout(() => {
        router.push(`/update/${treeId}`);
        setIsPopupVisible(false); // Hide popup after routing
      }, 2000);
    } catch (error) {
      console.error('Failed to update tree:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-black min-h-screen w-full flex justify-center">
      <div className="p-4 mt-36 w-1/2">
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
            {isSubmitting ? <Spinner className="w-20 h-10" /> : 'Submit'}
          </Button>
        </form>
      </div>

      {isPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-xl font-bold mb-4">Register Success!</h2>
            <p>Redirecting to the update page...</p>
          </div>
        </div>
      )}
    </div>
  );
}
