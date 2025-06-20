'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, UserPlus, UserCheck, AlertTriangle, Clock, Award } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface StatsCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
  color: string;
}

function StatsCard({ title, value, icon, trend, trendUp, color }: StatsCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <div className={`p-2 rounded-lg ${color}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {trend && (
          <p className={`text-xs mt-1 ${trendUp ? 'text-green-600' : 'text-red-600'}`}>
            {trendUp ? '↗' : '↘'} {trend}
          </p>
        )}
      </CardContent>
    </Card>
  );
}

export default function DashboardStats() {
  const { user } = useAuth();

  // Mock stats - in real app, these would come from API
  const stats = [
    {
      title: 'Total Employees',
      value: '247',
      icon: <Users className="h-5 w-5 text-blue-600" />,
      trend: '+12 from last month',
      trendUp: true,
      color: 'bg-blue-100'
    },
    {
      title: 'Regular Employees',
      value: '198',
      icon: <UserCheck className="h-5 w-5 text-green-600" />,
      trend: '+8 from last month',
      trendUp: true,
      color: 'bg-green-100'
    },
    {
      title: 'Probationary',
      value: '35',
      icon: <Clock className="h-5 w-5 text-yellow-600" />,
      trend: '+5 from last month',
      trendUp: true,
      color: 'bg-yellow-100'
    },
    {
      title: 'Contractual',
      value: '14',
      icon: <Award className="h-5 w-5 text-purple-600" />,
      trend: '-1 from last month',
      trendUp: false,
      color: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <StatsCard key={index} {...stat} />
      ))}
    </div>
  );
}