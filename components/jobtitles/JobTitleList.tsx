'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Briefcase,
  Users
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { JobTitle } from '@/types';
import { getJobTitles, deleteJobTitle, getEmployees } from '@/lib/employees';
import { useAuth } from '@/contexts/AuthContext';
import { canEditEmployee, canDeleteEmployee } from '@/lib/auth';
import { toast } from 'sonner';

interface JobTitleListProps {
  onJobTitleSelect: (jobTitle: JobTitle) => void;
  onJobTitleEdit: (jobTitle: JobTitle) => void;
  onJobTitleAdd: () => void;
}

export default function JobTitleList({ 
  onJobTitleSelect, 
  onJobTitleEdit, 
  onJobTitleAdd 
}: JobTitleListProps) {
  const { user } = useAuth();
  const [jobTitles, setJobTitles] = useState<(JobTitle & { employeeCount: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [jobTitleToDelete, setJobTitleToDelete] = useState<JobTitle | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    loadJobTitles();
  }, []);

  const loadJobTitles = async () => {
    try {
      const [jobTitlesData, employeesData] = await Promise.all([
        getJobTitles(),
        getEmployees()
      ]);
      
      // Count employees per job title
      const jobTitlesWithCounts = jobTitlesData.map(title => ({
        ...title,
        employeeCount: employeesData.filter(emp => emp.jobTitle === title.title).length
      }));
      
      setJobTitles(jobTitlesWithCounts);
    } catch (error) {
      console.error('Error loading job titles:', error);
      toast.error('Failed to load job titles');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobTitles = jobTitles.filter(jobTitle =>
    jobTitle.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteClick = (jobTitle: JobTitle) => {
    setJobTitleToDelete(jobTitle);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!jobTitleToDelete) return;
    
    setDeleting(true);
    try {
      await deleteJobTitle(jobTitleToDelete.id);
      setJobTitles(jobTitles.filter(jt => jt.id !== jobTitleToDelete.id));
      toast.success('Job title deleted successfully');
    } catch (error) {
      console.error('Error deleting job title:', error);
      toast.error('Failed to delete job title');
    } finally {
      setDeleting(false);
      setDeleteDialogOpen(false);
      setJobTitleToDelete(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-100 rounded animate-pulse"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Job Title Management</h2>
          <p className="text-gray-600">Manage and organize job positions</p>
        </div>
        {canEditEmployee(user?.role || 'EMPLOYEE') && (
          <Button onClick={onJobTitleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Add Job Title
          </Button>
        )}
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search job titles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Briefcase className="h-4 w-4" />
          <span>
            Showing {filteredJobTitles.length} of {jobTitles.length} job titles
          </span>
        </div>
      </div>

      {/* Job Title Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobTitles.length === 0 ? (
          <div className="col-span-full">
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Briefcase className="h-12 w-12 text-gray-300 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No job titles found</h3>
                <p className="text-gray-500 text-center">
                  {searchTerm
                    ? 'Try adjusting your search criteria'
                    : 'Get started by adding your first job title'
                  }
                </p>
              </CardContent>
            </Card>
          </div>
        ) : (
          filteredJobTitles.map(jobTitle => (
            <Card key={jobTitle.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1" onClick={() => onJobTitleSelect(jobTitle)}>
                    <div className="flex items-center space-x-2 mb-3">
                      <Briefcase className="h-5 w-5 text-blue-600" />
                      <h3 className="font-semibold text-gray-900">{jobTitle.title}</h3>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {jobTitle.employeeCount} employee{jobTitle.employeeCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onJobTitleSelect(jobTitle)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {canEditEmployee(user?.role || 'EMPLOYEE') && (
                        <DropdownMenuItem onClick={() => onJobTitleEdit(jobTitle)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                      )}
                      {canDeleteEmployee(user?.role || 'EMPLOYEE') && (
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={() => handleDeleteClick(jobTitle)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Job Title</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{jobTitleToDelete?.title}"? 
              {jobTitleToDelete && jobTitles.find(jt => jt.id === jobTitleToDelete.id)?.employeeCount && 
               jobTitles.find(jt => jt.id === jobTitleToDelete.id)!.employeeCount > 0 && (
                <span className="text-red-600 font-medium">
                  {' '}This job title has {jobTitles.find(jt => jt.id === jobTitleToDelete.id)!.employeeCount} employee(s) assigned to it.
                </span>
              )}
              {' '}This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={deleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {deleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}