import React from 'react';
import { Card } from './ui/card';
import { Skeleton } from './ui/skeleton';

const BusResultSkeleton = () => {
  return (
    <Card className="overflow-hidden border-l-4 border-gray-300 dark:border-gray-700">
      <div className="p-4 sm:p-5">
        <div className="flex items-center justify-between gap-4">
          {/* Left: Bus Info Skeleton */}
          <div className="flex-1 min-w-0">
            <Skeleton className="h-7 w-32 rounded-full mb-2" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Center: Time Display Skeleton */}
          <div className="flex flex-col items-center justify-center px-4">
            <Skeleton className="h-10 w-16 mb-1" />
            <Skeleton className="h-3 w-12" />
          </div>

          {/* Right: Button Skeleton */}
          <div className="flex-shrink-0">
            <Skeleton className="h-9 w-20 sm:w-28" />
          </div>
        </div>
      </div>
    </Card>
  );
};

export default BusResultSkeleton;
