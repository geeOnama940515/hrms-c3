using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace HRMS.Models
{
    // Enums
    public enum UserRole
    {
        HR_MANAGER,
        HR_SUPERVISOR,
        HR_COMPANY,
        DEPARTMENT_HEAD,
        EMPLOYEE
    }

    public enum Gender
    {
        Male,
        Female,
        Other
    }

    public enum CivilStatus
    {
        Single,
        Married,
        Divorced,
        Widowed,
        Separated
    }

    public enum EmploymentStatus
    {
        Probationary,
        Regular,
        Contractual,
        ProjectBased,
        Resigned,
        Terminated
    }

    public enum LeaveType
    {
        Vacation,
        Sick,
        Emergency,
        Paternity,
        Maternity,
        Bereavement,
        Personal
    }

    public enum LeaveStatus
    {
        Pending,
        Approved_by_Department,
        Approved,
        Rejected,
        Cancelled
    }

    // Base Entity
    public abstract class BaseEntity
    {
        public string Id { get; set; } = Guid.NewGuid().ToString();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }

    // User Entity
    public class User : BaseEntity
    {
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        [Required]
        public UserRole Role { get; set; }
        
        public string? Department { get; set; }
        public string? CompanyId { get; set; }
        public string? Avatar { get; set; }
        
        // Navigation properties
        [JsonIgnore]
        public string PasswordHash { get; set; } = string.Empty;
        public Company? Company { get; set; }
    }

    // Company Entity
    public class Company : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        public string? Address { get; set; }
        public string? ContactEmail { get; set; }
        public string? ContactPhone { get; set; }
        
        // Navigation properties
        public ICollection<Department> Departments { get; set; } = new List<Department>();
        public ICollection<User> Users { get; set; } = new List<User>();
    }

    // Department Entity
    public class Department : BaseEntity
    {
        [Required]
        public string Name { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        public string CompanyId { get; set; } = string.Empty;
        
        public string? HeadId { get; set; }
        
        // Navigation properties
        public Company Company { get; set; } = null!;
        public User? Head { get; set; }
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
        public ICollection<JobTitle> JobTitles { get; set; } = new List<JobTitle>();
    }

    // Job Title Entity
    public class JobTitle : BaseEntity
    {
        [Required]
        public string Title { get; set; } = string.Empty;
        
        public string? Description { get; set; }
        
        [Required]
        public string DepartmentId { get; set; } = string.Empty;
        
        // Navigation properties
        public Department Department { get; set; } = null!;
        public ICollection<Employee> Employees { get; set; } = new List<Employee>();
    }

    // Employee Entity
    public class Employee : BaseEntity
    {
        // Personal Info
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        public string? MiddleName { get; set; }
        
        [Required]
        public DateTime BirthDate { get; set; }
        
        [Required]
        public Gender Gender { get; set; }
        
        [Required]
        public CivilStatus CivilStatus { get; set; }
        
        // Contact Info
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        // Government IDs
        public string? SssNumber { get; set; }
        public string? PhilHealthNumber { get; set; }
        public string? PagIbigNumber { get; set; }
        public string? Tin { get; set; }
        
        // Employment Info
        [Required]
        public string EmployeeNumber { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateHired { get; set; }
        
        [Required]
        public string CompanyId { get; set; } = string.Empty;
        
        [Required]
        public string DepartmentId { get; set; } = string.Empty;
        
        [Required]
        public string JobTitleId { get; set; } = string.Empty;
        
        [Required]
        public EmploymentStatus EmploymentStatus { get; set; }
        
        public string? Avatar { get; set; }
        
        // Navigation properties
        public Company Company { get; set; } = null!;
        public Department Department { get; set; } = null!;
        public JobTitle JobTitle { get; set; } = null!;
        public ICollection<LeaveApplication> LeaveApplications { get; set; } = new List<LeaveApplication>();
        public ICollection<Attendance> Attendances { get; set; } = new List<Attendance>();
        public ICollection<Payroll> Payrolls { get; set; } = new List<Payroll>();
    }

    // Leave Day Entity
    public class LeaveDay
    {
        public DateTime Date { get; set; }
        public bool IsPaid { get; set; }
    }

    // Leave Application Entity
    public class LeaveApplication : BaseEntity
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;
        
        [Required]
        public LeaveType LeaveType { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        [Required]
        public int TotalDays { get; set; }
        
        [Required]
        public int PaidDays { get; set; }
        
        [Required]
        public int UnpaidDays { get; set; }
        
        [Required]
        public List<LeaveDay> LeaveDays { get; set; } = new List<LeaveDay>();
        
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        [Required]
        public LeaveStatus Status { get; set; }
        
        [Required]
        public DateTime AppliedDate { get; set; }
        
        // Approval workflow
        public ApprovalInfo? DepartmentHeadApproval { get; set; }
        public ApprovalInfo? HrAcknowledgment { get; set; }
        
        // Navigation properties
        public Employee Employee { get; set; } = null!;
        public Employee? DepartmentHead { get; set; }
        public Employee? HrPersonnel { get; set; }
    }

    // Approval Info Entity
    public class ApprovalInfo
    {
        [Required]
        public string ApprovedBy { get; set; } = string.Empty;
        
        [Required]
        public DateTime ApprovedDate { get; set; }
        
        public string? Comments { get; set; }
    }

    // Leave Balance Entity
    public class LeaveBalance : BaseEntity
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;
        
        [Required]
        public int Year { get; set; }
        
        [Required]
        public int TotalPaidLeave { get; set; }
        
        [Required]
        public int UsedPaidLeave { get; set; }
        
        // Navigation properties
        public Employee Employee { get; set; } = null!;
    }

    // Attendance Entity
    public class Attendance : BaseEntity
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;
        
        [Required]
        public DateTime Date { get; set; }
        
        public DateTime? TimeIn { get; set; }
        public DateTime? TimeOut { get; set; }
        
        [Required]
        public decimal TotalHours { get; set; }
        
        // Navigation properties
        public Employee Employee { get; set; } = null!;
    }

    // Payroll Entity
    public class Payroll : BaseEntity
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;
        
        [Required]
        public DateTime PeriodStart { get; set; }
        
        [Required]
        public DateTime PeriodEnd { get; set; }
        
        [Required]
        public decimal BasicPay { get; set; }
        
        [Required]
        public decimal Allowances { get; set; }
        
        [Required]
        public decimal Deductions { get; set; }
        
        [Required]
        public decimal NetPay { get; set; }
        
        // Navigation properties
        public Employee Employee { get; set; } = null!;
    }

    // DTOs for API responses
    public class EmployeeDisplayDto
    {
        public string Id { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string? MiddleName { get; set; }
        public DateTime BirthDate { get; set; }
        public Gender Gender { get; set; }
        public CivilStatus CivilStatus { get; set; }
        public string Email { get; set; } = string.Empty;
        public string PhoneNumber { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string? SssNumber { get; set; }
        public string? PhilHealthNumber { get; set; }
        public string? PagIbigNumber { get; set; }
        public string? Tin { get; set; }
        public string EmployeeNumber { get; set; } = string.Empty;
        public DateTime DateHired { get; set; }
        public string CompanyId { get; set; } = string.Empty;
        public string DepartmentId { get; set; } = string.Empty;
        public string JobTitleId { get; set; } = string.Empty;
        public EmploymentStatus EmploymentStatus { get; set; }
        public string? Avatar { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Display properties
        public string? Department { get; set; }
        public string? JobTitle { get; set; }
        public string? Company { get; set; }
    }

    public class LeaveApplicationDisplayDto
    {
        public string Id { get; set; } = string.Empty;
        public string EmployeeId { get; set; } = string.Empty;
        public LeaveType LeaveType { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public int TotalDays { get; set; }
        public int PaidDays { get; set; }
        public int UnpaidDays { get; set; }
        public List<LeaveDay> LeaveDays { get; set; } = new List<LeaveDay>();
        public string Reason { get; set; } = string.Empty;
        public LeaveStatus Status { get; set; }
        public DateTime AppliedDate { get; set; }
        public ApprovalInfo? DepartmentHeadApproval { get; set; }
        public ApprovalInfo? HrAcknowledgment { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        
        // Display properties
        public EmployeeDisplayDto? Employee { get; set; }
        public EmployeeDisplayDto? DepartmentHead { get; set; }
        public EmployeeDisplayDto? HrPersonnel { get; set; }
    }

    // Request DTOs
    public class CreateEmployeeRequest
    {
        [Required]
        public string FirstName { get; set; } = string.Empty;
        
        [Required]
        public string LastName { get; set; } = string.Empty;
        
        public string? MiddleName { get; set; }
        
        [Required]
        public DateTime BirthDate { get; set; }
        
        [Required]
        public Gender Gender { get; set; }
        
        [Required]
        public CivilStatus CivilStatus { get; set; }
        
        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        public string PhoneNumber { get; set; } = string.Empty;
        
        [Required]
        public string Address { get; set; } = string.Empty;
        
        public string? SssNumber { get; set; }
        public string? PhilHealthNumber { get; set; }
        public string? PagIbigNumber { get; set; }
        public string? Tin { get; set; }
        
        [Required]
        public string EmployeeNumber { get; set; } = string.Empty;
        
        [Required]
        public DateTime DateHired { get; set; }
        
        [Required]
        public string CompanyId { get; set; } = string.Empty;
        
        [Required]
        public string DepartmentId { get; set; } = string.Empty;
        
        [Required]
        public string JobTitleId { get; set; } = string.Empty;
        
        [Required]
        public EmploymentStatus EmploymentStatus { get; set; }
        
        public string? Avatar { get; set; }
    }

    public class CreateLeaveApplicationRequest
    {
        [Required]
        public string EmployeeId { get; set; } = string.Empty;
        
        [Required]
        public LeaveType LeaveType { get; set; }
        
        [Required]
        public DateTime StartDate { get; set; }
        
        [Required]
        public DateTime EndDate { get; set; }
        
        [Required]
        public string Reason { get; set; } = string.Empty;
        
        [Required]
        public List<LeaveDay> LeaveDays { get; set; } = new List<LeaveDay>();
    }

    public class ApproveLeaveRequest
    {
        [Required]
        public string ApprovedBy { get; set; } = string.Empty;
        
        public string? Comments { get; set; }
    }

    public class RejectLeaveRequest
    {
        [Required]
        public string RejectedBy { get; set; } = string.Empty;
        
        [Required]
        public string Comments { get; set; } = string.Empty;
    }

    public class AcknowledgeLeaveRequest
    {
        [Required]
        public string AcknowledgedBy { get; set; } = string.Empty;
        
        public string? Comments { get; set; }
    }

    // Filter DTOs
    public class EmployeeFilters
    {
        public string? DepartmentId { get; set; }
        public string? JobTitleId { get; set; }
        public EmploymentStatus? EmploymentStatus { get; set; }
        public string? SearchTerm { get; set; }
    }

    public class LeaveApplicationFilters
    {
        public string? EmployeeId { get; set; }
        public string? DepartmentId { get; set; }
        public LeaveStatus? Status { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    // Response DTOs
    public class ApiResponse<T>
    {
        public bool Success { get; set; }
        public string? Message { get; set; }
        public T? Data { get; set; }
        public List<string>? Errors { get; set; }
    }

    public class PaginatedResponse<T>
    {
        public List<T> Items { get; set; } = new List<T>();
        public int TotalCount { get; set; }
        public int PageNumber { get; set; }
        public int PageSize { get; set; }
        public int TotalPages { get; set; }
        public bool HasNextPage { get; set; }
        public bool HasPreviousPage { get; set; }
    }
} 