'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { UserPlus, UserCheck, FileText, Calendar, Clock, Award } from 'lucide-react';

interface ActivityItem {
  id: string;
  type: 'hire' | 'status_change' | 'document' | 'leave' | 'promotion';
  employee: {
    name: string;
    avatar?: string;
    position: string;
  };
  action: string;
  timestamp: string;
  status?: string;
}

export default function RecentActivity() {
  // Mock recent activities with updated employment statuses
  const activities: ActivityItem[] = [
    {
      id: '1',
      type: 'hire',
      employee: {
        name: 'Miguel Torres',
        avatar: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        position: 'Senior Developer'
      },
      action: 'New employee onboarded',
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      type: 'status_change',
      employee: {
        name: 'Ana Reyes',
        avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        position: 'Financial Analyst'
      },
      action: 'Employment status updated',
      timestamp: '4 hours ago',
      status: 'Regular'
    },
    {
      id: '3',
      type: 'document',
      employee: {
        name: 'Juan Dela Cruz',
        avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        position: 'Software Engineer'
      },
      action: 'Government IDs updated (SSS, PhilHealth)',
      timestamp: '1 day ago'
    },
    {
      id: '4',
      type: 'leave',
      employee: {
        name: 'Carlos Rodriguez',
        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        position: 'Marketing Manager'
      },
      action: 'Leave application submitted',
      timestamp: '2 days ago'
    },
    {
      id: '5',
      type: 'promotion',
      employee: {
        name: 'Maria Santos',
        avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
        position: 'HR Specialist'
      },
      action: 'Probation period completed',
      timestamp: '3 days ago',
      status: 'Regular'
    }
  ];

  const getActivityIcon = (type: ActivityItem['type']) => {
    switch (type) {
      case 'hire':
        return <UserPlus className="h-4 w-4 text-green-600" />;
      case 'status_change':
        return <UserCheck className="h-4 w-4 text-blue-600" />;
      case 'document':
        return <FileText className="h-4 w-4 text-purple-600" />;
      case 'leave':
        return <Calendar className="h-4 w-4 text-orange-600" />;
      case 'promotion':
        return <Award className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status?: string) => {
    if (!status) return null;
    
    const variants: { [key: string]: 'default' | 'secondary' | 'destructive' | 'outline' } = {
      Regular: 'default',
      Probationary: 'outline',
      Contractual: 'secondary',
      ProjectBased: 'secondary',
      Resigned: 'destructive',
      Terminated: 'destructive'
    };

    return (
      <Badge variant={variants[status] || 'default'} className="text-xs">
        {status}
      </Badge>
    );
  };

  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="flex-shrink-0">
              {getActivityIcon(activity.type)}
            </div>
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage src={activity.employee.avatar} alt={activity.employee.name} />
              <AvatarFallback className="bg-gray-100 text-gray-600 text-sm">
                {activity.employee.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="font-medium text-gray-900 truncate">
                  {activity.employee.name}
                </p>
                <span className="text-sm text-gray-500 flex-shrink-0">
                  {activity.timestamp}
                </span>
              </div>
              <p className="text-sm text-gray-600 truncate">
                {activity.employee.position}
              </p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-gray-800">{activity.action}</p>
                {getStatusBadge(activity.status)}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}