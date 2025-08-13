import React from 'react';
import CampaignBrowse from '@/components/campaigns/CampaignBrowse';

export default function BrowseCampaignsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-emerald-50/30 to-teal-50/30 dark:from-slate-900 dark:via-slate-800/30 dark:to-slate-900/30">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-200 bg-clip-text text-transparent mb-4">
            Discover Investment Opportunities
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300">
            Browse and invest in promising startup campaigns
          </p>
        </div>
        <CampaignBrowse />
      </div>
    </div>
  );
}