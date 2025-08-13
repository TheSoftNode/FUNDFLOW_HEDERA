import React from 'react';
import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth/next';

export default async function DashboardPage() {
  // This page will redirect based on user role
  // For now, redirect to landing page
  redirect('/');
}