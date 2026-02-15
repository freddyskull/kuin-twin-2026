import React from 'react';
import { DashboardHeader } from './components/dashboard-header';
import { BookingsChart } from './components/bookings-chart';
import { ServiceDistribution } from './components/service-distribution';
import { NearbyRequests } from './components/nearby-requests';
import { RevenueCard, ActiveUsers } from './components/revenue-stats';

export const DashboardPage: React.FC = () => {
  return (
    <div className="max-w-[1600px] mx-auto space-y-10">
      <DashboardHeader />

      {/* Top Section: Monthly Bookings & Distribution */}
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <BookingsChart />
        </div>
        <div className="col-span-4">
          <ServiceDistribution />
        </div>
      </div>

      {/* Bottom Section: Nearby Requests & Stats */}
      <div className="grid grid-cols-12 gap-10">
        <div className="col-span-8">
          <NearbyRequests />
        </div>
        <div className="col-span-4 flex flex-col gap-10">
          <div className="flex-1 min-h-[220px]">
            <RevenueCard />
          </div>
          <div className="flex-1">
            <ActiveUsers />
          </div>
        </div>
      </div>
    </div>
  );
};
