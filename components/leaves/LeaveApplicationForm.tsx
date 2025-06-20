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
  AlertCircle
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
import { LeaveApplication, LeaveType, LeaveBalance } from '@/types';
import { createLeaveApplication, updateLeaveApplication, getLeaveBalance, calculateLeaveDays, getAvailablePaidLeave } from '@/lib/leaves';
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
    reason: '',
    isPaid: true
  });
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalDays, setTotalDays] = useState(0);
  const [availablePaidLeave, setAvailablePaidLeave] = useState(0);

  useEffect(() => {
    if (leaveApplication) {
      setFormData({
        leaveType: leaveApplication.leaveType,
        startDate: leaveApplication.startDate,
        endDate: leaveApplication.endDate,
        reason: leaveApplication.reason,
        isPaid: leaveApplication.isPaid
      });
    }
    loadLeaveBalance();
  }, [leaveApplication]);

  useEffect(() => {
    if (formData.startDate && formData.endDate) {
      const days = calculateLeaveDays(formData.startDate, formData.endDate);
      setTotalDays(days);
    } else {
      setTotalDays(0);
    }
  }, [formData.startDate, formData.endDate]);

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

    // Paid leave balance validation (only if it's a paid leave)
    if (formData.isPaid && totalDays > 0 && availablePaidLeave < totalDays) {
      newErrors.isPaid = `Insufficient paid leave balance. Available: ${availablePaidLeave} days, Requested: ${totalDays} days`;
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

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
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

      <div className="max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Leave Application Details</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
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

              {/* Paid/Unpaid Toggle */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="isPaid">Paid Leave</Label>
                    <p className="text-sm text-gray-500">
                      Toggle to request paid or unpaid leave
                    </p>
                  </div>
                  <Switch
                    id="isPaid"
                    checked={formData.isPaid}
                    onCheckedChange={(checked) => handleInputChange('isPaid', checked)}
                  />
                </div>
                {errors.isPaid && (
                  <p className="text-sm text-red-600">{errors.isPaid}</p>
                )}
              </div>

              {/* Leave Summary */}
              {totalDays > 0 && (
                <Alert>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="space-y-1">
                      <p><strong>Total Days Requested:</strong> {totalDays} day{totalDays > 1 ? 's' : ''}</p>
                      <p><strong>Leave Type:</strong> {formData.isPaid ? 'Paid' : 'Unpaid'}</p>
                      {formData.isPaid && leaveBalance && (
                        <>
                          <p><strong>Available Paid Leave:</strong> {availablePaidLeave} day{availablePaidLeave > 1 ? 's' : ''}</p>
                          {totalDays > availablePaidLeave && (
                            <p className="text-red-600"><strong>Warning:</strong> Insufficient paid leave balance!</p>
                          )}
                        </>
                      )}
                      {!formData.isPaid && (
                        <p className="text-blue-600"><strong>Note:</strong> This will be unpaid leave and won't affect your paid leave balance.</p>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              {/* Current Balance Display */}
              {leaveBalance && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Your Leave Balance</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-blue-700">Total Paid Leave:</span>
                      <p className="font-medium text-blue-900">{leaveBalance.totalPaidLeave} days</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Used Paid Leave:</span>
                      <p className="font-medium text-blue-900">{leaveBalance.usedPaidLeave} days</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Available Paid Leave:</span>
                      <p className="font-medium text-blue-900">{availablePaidLeave} days</p>
                    </div>
                    <div>
                      <span className="text-blue-700">Unpaid Leave:</span>
                      <p className="font-medium text-blue-900">Unlimited</p>
                    </div>
                  </div>
                </div>
              )}

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

              {/* Form Actions */}
              <div className="flex items-center justify-end space-x-4 pt-6">
                <Button type="button" variant="outline" onClick={onBack}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={loading || (formData.isPaid && totalDays > 0 && availablePaidLeave < totalDays)} 
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
}