import React from 'react';
import InvestorDashboard from '@/components/dashboard/investor/InvestorDashboard';
import DashboardNavbar from '@/components/dashboard/DashboardNavbar';

export default function InvestorDashboardPage() {
  return (
    <>
      <DashboardNavbar dashboardType="investor" />
      <InvestorDashboard />
    </>
  );
}