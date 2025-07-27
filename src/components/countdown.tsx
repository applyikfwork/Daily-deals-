'use client';

import { useState, useEffect } from 'react';
import { differenceInSeconds } from 'date-fns';
import { Clock } from 'lucide-react';

type CountdownProps = {
  expireAt: string;
};

export default function Countdown({ expireAt }: CountdownProps) {
  const [remainingTime, setRemainingTime] = useState('');
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient) return;

    const expiryDate = new Date(expireAt);

    const updateCountdown = () => {
      const secondsLeft = differenceInSeconds(expiryDate, new Date());

      if (secondsLeft <= 0) {
        setRemainingTime('Deal Expired');
        return;
      }

      const days = Math.floor(secondsLeft / (3600 * 24));
      const hours = Math.floor((secondsLeft % (3600 * 24)) / 3600);
      const minutes = Math.floor((secondsLeft % 3600) / 60);
      const seconds = Math.floor(secondsLeft % 60);
      
      let formattedTime = '';
      if (days > 0) formattedTime += `${days}d `;
      if (hours > 0 || days > 0) formattedTime += `${hours}h `;
      formattedTime += `${minutes}m ${seconds}s`;

      setRemainingTime(formattedTime.trim());
    };

    updateCountdown();
    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, [expireAt, isClient]);

  if (!isClient) {
    return (
       <div className="text-center text-sm font-medium text-amber-600 bg-amber-50 rounded-md p-2 flex items-center justify-center">
        <Clock className="h-4 w-4 mr-2" />
        <span>Loading countdown...</span>
      </div>
    );
  }

  const isExpired = remainingTime === 'Deal Expired';

  return (
    <div className={`text-center text-sm font-medium rounded-md p-2 flex items-center justify-center ${isExpired ? 'text-red-600 bg-red-50' : 'text-amber-600 bg-amber-50'}`}>
      <Clock className="h-4 w-4 mr-2" />
      <span>{isExpired ? 'Expired' : `Expires in: ${remainingTime}`}</span>
    </div>
  );
}
