package com.placeshala.controller;

import com.placeshala.dto.*;
import com.placeshala.entity.*;
import com.placeshala.service.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/admin")
public class AdminController {

    private final AuthService authService;
    private final StudentService studentService;
    private final CompanyService companyService;
    private final JobService jobService;
    private final ApplicationService applicationService;
    private final InterviewService interviewService;
    private final AIService aiService;

    public AdminController(AuthService authService, StudentService studentService,
                           CompanyService companyService, JobService jobService,
                           ApplicationService applicationService, InterviewService interviewService,
                           AIService aiService) {
        this.authService = authService;
        this.studentService = studentService;
        this.companyService = companyService;
        this.jobService = jobService;
        this.applicationService = applicationService;
        this.interviewService = interviewService;
        this.aiService = aiService;
    }

    // --- Auth ---
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.registerAdmin(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.loginAdmin(request));
    }

    // --- Dashboard ---
    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStats> getDashboard() {
        DashboardStats stats = new DashboardStats();
        stats.setTotalStudents(studentService.getAllStudents().size());
        stats.setTotalCompanies(companyService.getAllCompanies().size());
        List<Job> allJobs = jobService.getAllJobs();
        stats.setTotalJobs(allJobs.size());
        stats.setOpenJobs(allJobs.stream().filter(j -> "OPEN".equals(j.getStatus())).count());
        List<Application> allApps = applicationService.getAllApplications();
        stats.setTotalApplications(allApps.size());
        stats.setPendingApplications(allApps.stream().filter(a -> "PENDING".equals(a.getStatus())).count());
        stats.setShortlistedApplications(allApps.stream().filter(a -> "SHORTLISTED".equals(a.getStatus())).count());
        stats.setAcceptedApplications(allApps.stream().filter(a -> "ACCEPTED".equals(a.getStatus())).count());
        stats.setRejectedApplications(allApps.stream().filter(a -> "REJECTED".equals(a.getStatus())).count());
        stats.setTotalInterviews(interviewService.getAllInterviews().size());
        return ResponseEntity.ok(stats);
    }

    // --- Students ---
    @GetMapping("/students")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/student/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @DeleteMapping("/student/{id}")
    public ResponseEntity<Map<String, String>> deleteStudent(@PathVariable("id") Long id) {
        studentService.deleteStudent(id);
        return ResponseEntity.ok(Map.of("message", "Student deleted successfully"));
    }

    @GetMapping("/student/{studentId}/resume")
    public ResponseEntity<byte[]> getStudentResume(@PathVariable("studentId") Long studentId) {
        Student student = studentService.getStudentById(studentId);
        if (student.getResumeData() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + student.getResumeFileName() + "\"")
                .body(student.getResumeData());
    }

    // --- Companies ---
    @PostMapping("/company")
    public ResponseEntity<Company> createCompany(@RequestBody Company company) {
        return ResponseEntity.ok(companyService.createCompany(company));
    }

    @GetMapping("/companies")
    public ResponseEntity<List<Company>> getAllCompanies() {
        return ResponseEntity.ok(companyService.getAllCompanies());
    }

    @PutMapping("/company/{id}")
    public ResponseEntity<Company> updateCompany(@PathVariable("id") Long id, @RequestBody Company company) {
        return ResponseEntity.ok(companyService.updateCompany(id, company));
    }

    @DeleteMapping("/company/{id}")
    public ResponseEntity<Map<String, String>> deleteCompany(@PathVariable("id") Long id) {
        companyService.deleteCompany(id);
        return ResponseEntity.ok(Map.of("message", "Company deleted successfully"));
    }

    // --- Jobs ---
    @PostMapping("/job")
    public ResponseEntity<Job> createJob(@RequestBody Job job) {
        return ResponseEntity.ok(jobService.createJob(job));
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/job/{id}")
    public ResponseEntity<Job> getJob(@PathVariable("id") Long id) {
        return ResponseEntity.ok(jobService.getJobById(id));
    }

    @PutMapping("/job/{id}")
    public ResponseEntity<Job> updateJob(@PathVariable("id") Long id, @RequestBody Job job) {
        return ResponseEntity.ok(jobService.updateJob(id, job));
    }

    @DeleteMapping("/job/{id}")
    public ResponseEntity<Map<String, String>> deleteJob(@PathVariable("id") Long id) {
        jobService.deleteJob(id);
        return ResponseEntity.ok(Map.of("message", "Job deleted successfully"));
    }

    @PutMapping("/job/{id}/close")
    public ResponseEntity<Job> closeJob(@PathVariable("id") Long id) {
        return ResponseEntity.ok(jobService.closeJob(id));
    }

    // --- Applications ---
    @GetMapping("/applications")
    public ResponseEntity<List<Application>> getAllApplications() {
        return ResponseEntity.ok(applicationService.getAllApplications());
    }

    @GetMapping("/applications/status/{status}")
    public ResponseEntity<List<Application>> getApplicationsByStatus(@PathVariable("status") String status) {
        return ResponseEntity.ok(applicationService.getApplicationsByStatus(status));
    }

    @PutMapping("/application/status")
    public ResponseEntity<Application> updateApplicationStatus(@RequestParam("applicationId") Long applicationId, @RequestParam("status") String status) {
        return ResponseEntity.ok(applicationService.updateStatus(applicationId, status));
    }

    @GetMapping("/job/{jobId}/applications")
    public ResponseEntity<List<Application>> getJobApplications(@PathVariable("jobId") Long jobId) {
        return ResponseEntity.ok(applicationService.getApplicationsByJob(jobId));
    }

    @GetMapping("/job/{jobId}/top-candidates")
    public ResponseEntity<List<Application>> getTopCandidates(@PathVariable("jobId") Long jobId) {
        return ResponseEntity.ok(applicationService.getTopCandidates(jobId));
    }

    // --- Interviews ---
    @PostMapping("/interview/schedule")
    public ResponseEntity<Interview> scheduleInterview(@RequestBody InterviewRequest request) {
        return ResponseEntity.ok(interviewService.schedule(request));
    }

    @GetMapping("/interviews")
    public ResponseEntity<List<Interview>> getAllInterviews() {
        return ResponseEntity.ok(interviewService.getAllInterviews());
    }

    // --- Email Test ---
    @PostMapping("/test-email")
    public ResponseEntity<Map<String, String>> testEmail(@RequestParam String email) {
        // In production, this would use JavaMailSender
        return ResponseEntity.ok(Map.of("message", "Test email would be sent to: " + email, "status", "simulated"));
    }
}
