'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Cake, Gift, Calendar, Users, ChevronRight } from 'lucide-react';
import { Employee } from '@/types';
import { getEmployees } from '@/lib/employees';

// Type for employee with display data
interface EmployeeDisplayData extends Omit<Employee, 'department' | 'jobTitle' | 'company'> {
  department?: string;
  jobTitle?: string;
  company?: string;
}

interface UpcomingBirthday {
  employee: EmployeeDisplayData;
  daysUntil: number;
  age: number;
  isToday: boolean;
  isThisWeek: boolean;
}

export default function UpcomingBirthdays() {
  const [upcomingBirthdays, setUpcomingBirthdays] = useState<UpcomingBirthday[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadUpcomingBirthdays();
  }, []);

  const loadUpcomingBirthdays = async () => {
    try {
      const employees = await getEmployees();
      const birthdays = getUpcomingBirthdays(employees);
      setUpcomingBirthdays(birthdays);
    } catch (error) {
      console.error('Error loading upcoming birthdays:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUpcomingBirthdays = (employees: EmployeeDisplayData[]): UpcomingBirthday[] => {
    const today = new Date();
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(today.getDate() + 30);

    const birthdays: UpcomingBirthday[] = [];

    employees.forEach(employee => {
      const birthDate = new Date(employee.birthDate);
      const currentYear = today.getFullYear();
      
      // Create birthday for current year
      const thisYearBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
      
      // If birthday already passed this year, check next year's birthday
      let nextBirthday = thisYearBirthday;
      if (thisYearBirthday < today) {
        nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
      }

      // Check if birthday is within next 30 days
      if (nextBirthday <= thirtyDaysFromNow) {
        const daysUntil = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        const age = currentYear - birthDate.getFullYear() + (nextBirthday.getFullYear() > currentYear ? 1 : 0);
        
        birthdays.push({
          employee,
          daysUntil: Math.max(0, daysUntil),
          age,
          isToday: daysUntil === 0,
          isThisWeek: daysUntil <= 7
        });
      }
    });

    // Sort by days until birthday
    return birthdays.sort((a, b) => a.daysUntil - b.daysUntil);
  };

  const formatBirthdayDate = (employee: EmployeeDisplayData, daysUntil: number) => {
    const birthDate = new Date(employee.birthDate);
    const today = new Date();
    const currentYear = today.getFullYear();
    
    let nextBirthday = new Date(currentYear, birthDate.getMonth(), birthDate.getDate());
    if (nextBirthday < today) {
      nextBirthday = new Date(currentYear + 1, birthDate.getMonth(), birthDate.getDate());
    }

    return nextBirthday.toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric'
    });
  };

  const getDaysUntilText = (daysUntil: number, isToday: boolean) => {
    if (isToday) return 'Today!';
    if (daysUntil === 1) return 'Tomorrow';
    if (daysUntil <= 7) return `In ${daysUntil} days`;
    return `In ${daysUntil} days`;
  };

  const getBirthdayBadge = (birthday: UpcomingBirthday) => {
    if (birthday.isToday) {
      return (
        <Badge className="bg-pink-100 text-pink-800 animate-pulse">
          <Gift className="h-3 w-3 mr-1" />
          Today!
        </Badge>
      );
    }
    if (birthday.isThisWeek) {
      return (
        <Badge className="bg-blue-100 text-blue-800">
          <Calendar className="h-3 w-3 mr-1" />
          This Week
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-gray-50">
        <Calendar className="h-3 w-3 mr-1" />
        {getDaysUntilText(birthday.daysUntil, birthday.isToday)}
      </Badge>
    );
  };

  const displayedBirthdays = showAll ? upcomingBirthdays : upcomingBirthdays.slice(0, 5);
  const todaysBirthdays = upcomingBirthdays.filter(b => b.isToday);
  const thisWeekBirthdays = upcomingBirthdays.filter(b => b.isThisWeek && !b.isToday);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cake className="h-5 w-5" />
            <span>Upcoming Birthdays</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="flex-1 space-y-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (upcomingBirthdays.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Cake className="h-5 w-5" />
            <span>Upcoming Birthdays</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Cake className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No upcoming birthdays in the next 30 days</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Cake className="h-5 w-5" />
            <span>Upcoming Birthdays</span>
            <Badge variant="outline" className="ml-2">
              {upcomingBirthdays.length}
            </Badge>
          </div>
          {upcomingBirthdays.length > 5 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowAll(!showAll)}
              className="text-blue-600 hover:text-blue-700"
            >
              {showAll ? 'Show Less' : 'View All'}
              <ChevronRight className={`h-4 w-4 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Today's Birthdays - Special Section */}
          {todaysBirthdays.length > 0 && (
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-4 rounded-lg border border-pink-200">
              <div className="flex items-center space-x-2 mb-3">
                <Gift className="h-4 w-4 text-pink-600" />
                <span className="font-medium text-pink-800">Birthday Today!</span>
              </div>
              <div className="space-y-3">
                {todaysBirthdays.map(birthday => (
                  <div key={birthday.employee.id} className="flex items-center space-x-3">
                    <Avatar className="h-10 w-10 ring-2 ring-pink-200">
                      <AvatarImage src={birthday.employee.avatar} alt={birthday.employee.firstName} />
                      <AvatarFallback className="bg-pink-100 text-pink-600">
                        {birthday.employee.firstName[0]}{birthday.employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-gray-900 truncate">
                          {birthday.employee.firstName} {birthday.employee.lastName}
                        </p>
                        <span className="text-sm text-pink-600 font-medium">
                          🎉 {birthday.age} years old!
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {birthday.employee.jobTitle ?? 'No Title'} • {birthday.employee.department ?? 'No Department'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* This Week's Birthdays */}
          {thisWeekBirthdays.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span className="font-medium text-blue-800">This Week</span>
              </div>
              <div className="space-y-3">
                {thisWeekBirthdays.slice(0, showAll ? thisWeekBirthdays.length : 3).map(birthday => (
                  <div key={birthday.employee.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-blue-50 transition-colors">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={birthday.employee.avatar} alt={birthday.employee.firstName} />
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {birthday.employee.firstName[0]}{birthday.employee.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900 truncate">
                          {birthday.employee.firstName} {birthday.employee.lastName}
                        </p>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-500">
                            {formatBirthdayDate(birthday.employee, birthday.daysUntil)}
                          </span>
                          {getBirthdayBadge(birthday)}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 truncate">
                        {birthday.employee.jobTitle ?? 'No Title'} • Turning {birthday.age}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other Upcoming Birthdays */}
          {upcomingBirthdays.filter(b => !b.isThisWeek).length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Users className="h-4 w-4 text-gray-600" />
                <span className="font-medium text-gray-800">Coming Up</span>
              </div>
              <div className="space-y-3">
                {upcomingBirthdays
                  .filter(b => !b.isThisWeek)
                  .slice(0, showAll ? undefined : 3)
                  .map(birthday => (
                    <div key={birthday.employee.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={birthday.employee.avatar} alt={birthday.employee.firstName} />
                        <AvatarFallback className="bg-gray-100 text-gray-600">
                          {birthday.employee.firstName[0]}{birthday.employee.lastName[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 truncate">
                            {birthday.employee.firstName} {birthday.employee.lastName}
                          </p>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500">
                              {formatBirthdayDate(birthday.employee, birthday.daysUntil)}
                            </span>
                            {getBirthdayBadge(birthday)}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {birthday.employee.jobTitle ?? 'No Title'} • Turning {birthday.age}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Summary Footer */}
          <div className="pt-3 border-t border-gray-100">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                {upcomingBirthdays.length} birthday{upcomingBirthdays.length !== 1 ? 's' : ''} in next 30 days
              </span>
              {todaysBirthdays.length > 0 && (
                <span className="text-pink-600 font-medium">
                  🎂 {todaysBirthdays.length} today!
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}