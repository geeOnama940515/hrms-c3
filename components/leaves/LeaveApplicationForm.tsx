'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  Calendar,
  Loader2,
  AlertCircle,
  DollarSign,
  Ban
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import { LeaveApplication, LeaveType, LeaveBalance, LeaveDay } from '@/types';
import { createLeaveApplication, updateLeaveApplication, getLeaveBalance, calculateLeaveDays, getAvailablePaidLeave, generateLeaveDaysArray } from '@/lib/leaves';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface LeaveApplicationFormProps {
  leaveApplication?: LeaveApplication;
  onBack: () => void;
  onSave: (leaveApplication: LeaveApplication) => void;
}

export default function LeaveApplicationForm({ leaveApplication, onBack, onSave }: LeaveApplicationFormProps) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    leaveType: '' as LeaveType | '',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [leaveDays, setLeaveDays] = useState<LeaveDay[]>([]);
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalDays, setTotalDays] = useState(0);
  const [paidDays, setPaidDays] = useState(0);
  const [unpaidDays, setUnpaidDays] = useState(0);
  const [availablePaidLeave, setAvailablePaidLeave] = useState(0);

  useEffect(() => {
    if (leaveApplication) {
      setFormData({
        leaveType: leaveApplication.leaveType,
        startDate: leaveApplication.startDate,
        endDate: leaveApplication.endDate,
        reason: leaveApplication.reason
      });
      setLeaveDays(leaveApplication.leaveDays);
    }
    loadLeaveBalance();
  }, [leaveApplication]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateLeaveDays(formData.startDate, formData.endDate);
      setTotalDays(days);
      
      // Generate leave days array if not editing existing application
      if (!leaveApplication) {
        const daysList = generateLeaveDaysArray(formData.startDate, formData.endDate);
        const newLeaveDays: LeaveDay[] = daysList.map(date => ({
          date,
          isPaid: true // Default to paid
        }));
        setLeaveDays(newLeaveDays);
      }
    } else {
      setTotalDays(0);
      setLeaveDays([]);
    }
  }, [formData.startDate, formData.endDate, leaveApplication]);

  useEffect(() => {
    const paid = leaveDays.filter(day => day.isPaid).length;
    const unpaid = leaveDays.filter(day => !day.isPaid).length;
    setPaidDays(paid);
    setUnpaidDays(unpaid);
  }, [leaveDays]);

  useEffect(() => {
    if (leaveBalance) {
      const available = getAvailablePaidLeave(leaveBalance);
      setAvailablePaidLeave(available);
    } else {
      setAvailablePaidLeave(0);
    }
  }, [leaveBalance]);

  const loadLeaveBalance = async () => {
    if (!user) return;
    
    try {
      // For demo purposes, we'll use employee ID '1' - in real app, you'd get this from user context
      const balance = await getLeaveBalance('1');
      setLeaveBalance(balance);
    } catch (error) {
      console.error('Error loading leave balance:', error);
      toast.error('Failed to load leave balance');
    } finally {
      setLoadingBalance(false);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.leaveType) newErrors.leaveType = 'Leave type is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.endDate) newErrors.endDate = 'End date is required';
    if (!formData.reason.trim()) newErrors.reason = 'Reason is required';

    // Date validation
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        newErrors.startDate = 'Start date cannot be in the past';
      }
      if (endDate < startDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }

    // Paid leave balance validation
    if (paidDays > 0 && availablePaidLeave < paidDays) {
      newErrors.leaveDays = `Insufficient paid leave balance. Available: ${availablePaidLeave} days, Requested: ${paidDays} days`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !user) return;

    setLoading(true);
    try {
      let savedApplication: LeaveApplication;
      
      const applicationData = {
        ...formData,
        leaveType: formData.leaveType as LeaveType,
        totalDays,
        paidDays,
        unpaidDays,
        leaveDays,
        employeeId: '1' // In real app, get from user context
      };
      
      if (leaveApplication) {
        // Update existing application (only if still pending)
        if (leaveApplication.status !== 'Pending') {
          throw new Error('Cannot edit application that has been processed');
        }
        savedApplication = await updateLeaveApplication(leaveApplication.id, applicationData);
        toast.success('Leave application updated successfully');
      } else {
        // Create new application
        savedApplication = await createLeaveApplication(applicationData);
        toast.success('Leave application submitted successfully');
      }
      
      onSave(savedApplication);
    } catch (error) {
      console.error('Error saving leave application:', error);
      toast.error('Failed to save leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleDayToggle = (index: number, isPaid: boolean) => {
    const newLeaveDays = [...leaveDays];
    newLeaveDays[index] = { ...newLeaveDays[index], isPaid };
    setLeaveDays(newLeaveDays);
    
    if (errors.leaveDays) {
      setErrors(prev => ({ ...prev, leaveDays: '' }));
    }
  };

  const handleBulkToggle = (isPaid: boolean) => {
    const newLeaveDays = leaveDays.map(day => ({ ...day, isPaid }));
    setLeaveDays(newLeaveDays);
  };

  const getLeaveTypeOptions = (): { value: LeaveType; label: string }[] => {
    return [
      { value: 'Vacation', label: 'Vacation Leave' },
      { value: 'Sick', label: 'Sick Leave' },
      { value: 'Emergency', label: 'Emergency Leave' },
      { value: 'Personal', label: 'Personal Leave' },
      { value: 'Maternity', label: 'Maternity Leave' },
      { value: 'Paternity', label: 'Paternity Leave' },
      { value: 'Bereavement', label: 'Bereavement Leave' }
    ];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loadingBalance) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-32 bg-gray-100 rounded animate-pulse"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {leaveApplication ? 'Edit Leave Application' : 'Apply for Leave'}
          </h2>
          <p className="text-gray-600">
            {leaveApplication ? 'Update your leave application' : 'Submit a new leave application'}
          </p>
        </div>
      </div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5" />
                    <span>Leave Application Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Leave Type */}
                  <div className="space-y-2">
                    <Label htmlFor="leaveType">Leave Type *</Label>
                    <Select
                      value={formData.leaveType}
                      onValueChange={(value) => handleInputChange('leaveType', value)}
                    >
                      <SelectTrigger className={errors.leaveType ? 'border-red-500' : ''}>
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {getLeaveTypeOptions().map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.leaveType && (
                      <p className="text-sm text-red-600">{errors.leaveType}</p>
                    )}
                  </div>

                  {/* Date Range */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="startDate">Start Date *</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={formData.startDate}
                        onChange={(e) => handleInputChange('startDate', e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className={errors.startDate ? 'border-red-500' : ''}
                      />
                      {errors.startDate && (
                        <p className="text-sm text-red-600">{errors.startDate}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="endDate">End Date *</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={formData.endDate}
                        onChange={(e) => handleInputChange('endDate', e.target.value)}
                        min={formData.startDate || new Date().toISOString().split('T')[0]}
                        className={errors.endDate ? 'border-red-500' : ''}
                      />
                      {errors.endDate && (
                        <p className="text-sm text-red-600">{errors.endDate}</p>
                      )}
                    </div>
                  </div>

                  {/* Reason */}
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Leave *</Label>
                    <Textarea
                      id="reason"
                      value={formData.reason}
                      onChange={(e) => handleInputChange('reason', e.target.value)}
                      placeholder="Please provide a detailed reason for your leave application"
                      rows={4}
                      className={errors.reason ? 'border-red-500' : ''}
                    />
                    {errors.reason && (
                      <p className="text-sm text-red-600">{errors.reason}</p>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Leave Days Configuration */}
              {leaveDays.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <DollarSign className="h-5 w-5" />
                        <span>Configure Leave Days</span>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkToggle(true)}
                        >
                          All Paid
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => handleBulkToggle(false)}
                        >
                          All Unpaid
                        </Button>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-600">
                        Select which days should be paid or unpaid. You have {availablePaidLeave} paid leave days available.
                      </p>
                      
                      {errors.leaveDays && (
                        <p className="text-sm text-red-600">{errors.leaveDays}</p>
                      )}
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {leaveDays.map((day, index) => (
                          <div
                            key={day.date}
                            className={`flex items-center justify-between p-3 rounded-lg border ${
                              day.isPaid ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                            }`}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="text-sm font-medium">
                                {formatDate(day.date)}
                              </div>
                              <div className={`flex items-center space-x-1 text-xs px-2 py-1 rounded ${
                                day.isPaid ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                              }`}>
                                {day.isPaid ? (
                                  <>
                                    <DollarSign className="h-3 w-3" />
                                    <span>Paid</span>
                                  </>
                                ) : (
                                  <>
                                    <Ban className="h-3 w-3" />
                                    <span>Unpaid</span>
                                  </>
                                )}
                              </div>
                            </div>
                            <Switch
                              checked={day.isPaid}
                              onCheckedChange={(checked) => handleDayToggle(index, checked)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Leave Summary */}
              {totalDays > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <AlertCircle className="h-5 w-5" />
                      <span>Leave Summary</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Total Days:</span>
                        <span className="font-medium">{totalDays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Paid Days:</span>
                        <span className="font-medium text-green-600">{paidDays}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Unpaid Days:</span>
                        <span className="font-medium text-gray-600">{unpaidDays}</span>
                      </div>
                    </div>
                    
                    {paidDays > availablePaidLeave && (
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-red-600">
                          <strong>Warning:</strong> You're requesting {paidDays} paid days but only have {availablePaidLeave} available.
                        </AlertDescription>
                      </Alert>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Current Balance */}
              {leaveBalance && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <DollarSign className="h-5 w-5" />
                      <span>Leave Balance</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Total Allocation:</span>
                        <p className="font-medium">{leaveBalance.totalPaidLeave} days</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Used:</span>
                        <p className="font-medium">{leaveBalance.usedPaidLeave} days</p>
                      </div>
                      <div className="col-span-2">
                        <span className="text-gray-600">Available:</span>
                        <p className="font-medium text-green-600">{availablePaidLeave} days</p>
                      </div>
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-xs text-blue-700">
                        <strong>Note:</strong> You can take unlimited unpaid leave days beyond your paid allocation.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6">
            <Button type="button" variant="outline" onClick={onBack}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading || (paidDays > 0 && availablePaidLeave < paidDays)} 
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {leaveApplication ? 'Updating...' : 'Submitting...'}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {leaveApplication ? 'Update Application' : 'Submit Application'}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}