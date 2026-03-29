package com.placeshala.dto;

public class DashboardStats {
    private long totalStudents;
    private long totalCompanies;
    private long totalJobs;
    private long openJobs;
    private long totalApplications;
    private long pendingApplications;
    private long shortlistedApplications;
    private long acceptedApplications;
    private long rejectedApplications;
    private long totalInterviews;

    public long getTotalStudents() { return totalStudents; }
    public void setTotalStudents(long v) { this.totalStudents = v; }
    public long getTotalCompanies() { return totalCompanies; }
    public void setTotalCompanies(long v) { this.totalCompanies = v; }
    public long getTotalJobs() { return totalJobs; }
    public void setTotalJobs(long v) { this.totalJobs = v; }
    public long getOpenJobs() { return openJobs; }
    public void setOpenJobs(long v) { this.openJobs = v; }
    public long getTotalApplications() { return totalApplications; }
    public void setTotalApplications(long v) { this.totalApplications = v; }
    public long getPendingApplications() { return pendingApplications; }
    public void setPendingApplications(long v) { this.pendingApplications = v; }
    public long getShortlistedApplications() { return shortlistedApplications; }
    public void setShortlistedApplications(long v) { this.shortlistedApplications = v; }
    public long getAcceptedApplications() { return acceptedApplications; }
    public void setAcceptedApplications(long v) { this.acceptedApplications = v; }
    public long getRejectedApplications() { return rejectedApplications; }
    public void setRejectedApplications(long v) { this.rejectedApplications = v; }
    public long getTotalInterviews() { return totalInterviews; }
    public void setTotalInterviews(long v) { this.totalInterviews = v; }
}
