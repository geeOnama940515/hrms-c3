'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Clock, 
  User, 
  CheckCircle,
  XCircle,
  MessageSquare,
  Loader2
} from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LeaveApplication } from '@/types';
import { approveLeaveByDepartmentHead, acknowledgeLeaveByHR, rejectLeaveApplication, getLeaveTypeColor, getStatusColor, getStatusDisplayName } from '@/lib/leaves';
import { useAuth } from '@/contexts/AuthContext';
import { canApproveDepartmentLeave, canAcknowledgeLeave } from '@/lib/auth';
import { toast } from 'sonner';

interface LeaveApplicationDetailProps {
  leaveApplication: LeaveApplication;
  onBack: () => void;
  onEdit: (leave: LeaveApplication) => void;
  onUpdate: (leave: LeaveApplication) => void;
}

export default function LeaveApplicationDetail({ 
  leaveApplication, 
  onBack, 
  onEdit,
  onUpdate 
}: LeaveApplicationDetailProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [approvalDialogOpen, setApprovalDialogOpen] = useState(false);
  const [rejectionDialogOpen, setRejectionDialogOpen] = useState(false);
  const [acknowledgmentDialogOpen, setAcknowledgmentDialogOpen] = useState(false);
  const [comments, setComments] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-PH', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleApprove = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedLeave = await approveLeaveByDepartmentHead(
        leaveApplication.id,
        user.id,
        comments || undefined
      );
      onUpdate(updatedLeave);
      toast.success('Leave application approved successfully');
      setApprovalDialogOpen(false);
      setComments('');
    } catch (error) {
      console.error('Error approving leave:', error);
      toast.error('Failed to approve leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async () => {
    if (!user || !comments.trim()) return;
    
    setLoading(true);
    try {
      const updatedLeave = await rejectLeaveApplication(
        leaveApplication.id,
        user.id,
        comments
      );
      onUpdate(updatedLeave);
      toast.success('Leave application rejected');
      setRejectionDialogOpen(false);
      setComments('');
    } catch (error) {
      console.error('Error rejecting leave:', error);
      toast.error('Failed to reject leave application');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const updatedLeave = await acknowledgeLeaveByHR(
        leaveApplication.id,
        user.id,
        comments || undefined
      );
      onUpdate(updatedLeave);
      toast.success('Leave application acknowledged successfully');
      setAcknowledgmentDialogOpen(false);
      setComments('');
    } catch (error) {
      console.error('Error acknowledging leave:', error);
      toast.error('Failed to acknowledge leave application');
    } finally {
      setLoading(false);
    }
  };

  const canEdit = (): boolean => {
    return leaveApplication.status === 'Pending' && leaveApplication.employeeId === '1'; // In real app, check against user ID
  };

  const canApprove = (): boolean => {
    return canApproveDepartmentLeave(user?.role || 'EMPLOYEE') && 
           leaveApplication.status === 'Pending';
  };

  const canAcknowledge = (): boolean => {
    return canAcknowledgeLeave(user?.role || 'EMPLOYEE') && 
           leaveApplication.status === 'Approved_by_Department';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-4 w-4" />;
      case 'Approved_by_Department':
      case 'Approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'Rejected':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Leave Application Details</h2>
            <p className="text-gray-600">Review and manage leave application</p>
          </div>
        </div>
        <div className="flex space-x-2">
          {canEdit() && (
            <Button onClick={() => onEdit(leaveApplication)} variant="outline">
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Button>
          )}
          {canApprove() && (
            <>
              <Button 
                onClick={() => setApprovalDialogOpen(true)}
                className="bg-green-600 hover:bg-green-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Approve
              </Button>
              <Button 
                onClick={() => setRejectionDialogOpen(true)}
                variant="destructive"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Reject
              </Button>
            </>
          )}
          {canAcknowledge() && (
            <Button 
              onClick={() => setAcknowledgmentDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Acknowledge
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>Leave Application Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Employee Info */}
            <div className="flex items-start space-x-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={leaveApplication.employee?.avatar} alt={leaveApplication.employee?.firstName} />
                <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                  {leaveApplication.employee?.firstName?.[0]}{leaveApplication.employee?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900">
                  {leaveApplication.employee?.firstName} {leaveApplication.employee?.lastName}
                </h3>
                <p className="text-gray-600">{leaveApplication.employee?.jobTitle}</p>
                <p className="text-gray-500 text-sm">{leaveApplication.employee?.department}</p>
                <p className="text-gray-500 text-sm">ID: {leaveApplication.employee?.employeeNumber}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <Badge className={getLeaveTypeColor(leaveApplication.leaveType)}>
                  {leaveApplication.leaveType}
                </Badge>
                <Badge className={`${getStatusColor(leaveApplication.status)} flex items-center space-x-1`}>
                  {getStatusIcon(leaveApplication.status)}
                  <span>{getStatusDisplayName(leaveApplication.status)}</span>
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Leave Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Leave Period</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">{formatDate(leaveApplication.startDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">End Date:</span>
                    <span className="font-medium">{formatDate(leaveApplication.endDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Days:</span>
                    <span className="font-medium">{leaveApplication.totalDays} day{leaveApplication.totalDays > 1 ? 's' : ''}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Application Info</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Applied Date:</span>
                    <span className="font-medium">{formatDate(leaveApplication.appliedDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Leave Type:</span>
                    <span className="font-medium">{leaveApplication.leaveType}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium">{getStatusDisplayName(leaveApplication.status)}</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Reason */}
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900">Reason for Leave</h4>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">{leaveApplication.reason}</p>
            </div>
          </CardContent>
        </Card>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Approval Workflow */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Approval Workflow</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Department Head Approval */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Department Head</span>
                  {leaveApplication.departmentHeadApproval ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {leaveApplication.status === 'Rejected' ? 'Rejected' : 'Approved'}
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  )}
                </div>
                {leaveApplication.departmentHeadApproval && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>By: {leaveApplication.departmentHead?.firstName} {leaveApplication.departmentHead?.lastName}</p>
                    <p>Date: {formatDateTime(leaveApplication.departmentHeadApproval.approvedDate)}</p>
                    {leaveApplication.departmentHeadApproval.comments && (
                      <p className="italic">"{leaveApplication.departmentHeadApproval.comments}"</p>
                    )}
                  </div>
                )}
              </div>

              <Separator />

              {/* HR Acknowledgment */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">HR Acknowledgment</span>
                  {leaveApplication.hrAcknowledgment ? (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Acknowledged
                    </Badge>
                  ) : leaveApplication.status === 'Approved_by_Department' ? (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Pending
                    </Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">
                      <Clock className="h-3 w-3 mr-1" />
                      Waiting
                    </Badge>
                  )}
                </div>
                {leaveApplication.hrAcknowledgment && (
                  <div className="text-xs text-gray-600 space-y-1">
                    <p>By: {leaveApplication.hrPersonnel?.firstName} {leaveApplication.hrPersonnel?.lastName}</p>
                    <p>Date: {formatDateTime(leaveApplication.hrAcknowledgment.acknowledgedDate)}</p>
                    {leaveApplication.hrAcknowledgment.comments && (
                      <p className="italic">"{leaveApplication.hrAcknowledgment.comments}"</p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Timeline</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Applied:</span>
                  <span className="font-medium">{formatDateTime(leaveApplication.appliedDate)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">{formatDateTime(leaveApplication.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Approval Dialog */}
      <AlertDialog open={approvalDialogOpen} onOpenChange={setApprovalDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Approve Leave Application</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to approve this leave application?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="approval-comments">Comments (Optional)</Label>
            <Textarea
              id="approval-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments for the approval..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleApprove}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Approving...
                </>
              ) : (
                'Approve'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Rejection Dialog */}
      <AlertDialog open={rejectionDialogOpen} onOpenChange={setRejectionDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Leave Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this leave application.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="rejection-comments">Reason for Rejection *</Label>
            <Textarea
              id="rejection-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Please explain why this leave application is being rejected..."
              rows={3}
              required
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              disabled={loading || !comments.trim()}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Rejecting...
                </>
              ) : (
                'Reject'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Acknowledgment Dialog */}
      <AlertDialog open={acknowledgmentDialogOpen} onOpenChange={setAcknowledgmentDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Acknowledge Leave Application</AlertDialogTitle>
            <AlertDialogDescription>
              Acknowledge this leave application to complete the approval process.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-2">
            <Label htmlFor="acknowledgment-comments">Comments (Optional)</Label>
            <Textarea
              id="acknowledgment-comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Add any comments for the acknowledgment..."
              rows={3}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleAcknowledge}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Acknowledging...
                </>
              ) : (
                'Acknowledge'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}