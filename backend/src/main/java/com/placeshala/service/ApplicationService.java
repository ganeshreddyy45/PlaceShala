package com.placeshala.service;

import com.placeshala.entity.*;
import com.placeshala.exception.*;
import com.placeshala.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public ApplicationService(ApplicationRepository applicationRepository,
                              StudentRepository studentRepository,
                              JobRepository jobRepository) {
        this.applicationRepository = applicationRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    public Application applyForJob(Long studentId, Long jobId) {
        Student student = studentRepository.findById(studentId)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        if ("CLOSED".equals(job.getStatus())) {
            throw new BadRequestException("This job is no longer accepting applications");
        }
        if (applicationRepository.existsByStudentIdAndJobId(studentId, jobId)) {
            throw new DuplicateResourceException("You have already applied for this job");
        }

        Application application = new Application();
        application.setStudent(student);
        application.setJob(job);
        application.setMatchPercentage(calculateMatchPercentage(student, job));
        return applicationRepository.save(application);
    }

    public List<Application> getStudentApplications(Long studentId) {
        return applicationRepository.findByStudentId(studentId);
    }

    public List<Application> getAllApplications() {
        return applicationRepository.findAll();
    }

    public List<Application> getApplicationsByStatus(String status) {
        return applicationRepository.findByStatus(status);
    }

    public List<Application> getApplicationsByJob(Long jobId) {
        return applicationRepository.findByJobId(jobId);
    }

    public Application updateStatus(Long applicationId, String status) {
        Application app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResourceNotFoundException("Application not found"));
        app.setStatus(status);
        return applicationRepository.save(app);
    }

    public List<Application> getTopCandidates(Long jobId) {
        List<Application> apps = applicationRepository.findByJobId(jobId);
        return apps.stream()
                .sorted((a, b) -> Double.compare(
                        b.getMatchPercentage() != null ? b.getMatchPercentage() : 0,
                        a.getMatchPercentage() != null ? a.getMatchPercentage() : 0))
                .limit(10)
                .collect(Collectors.toList());
    }

    public double calculateMatchPercentage(Student student, Job job) {
        if (student.getSkills() == null || job.getRequiredSkills() == null) return 0;
        Set<String> studentSkills = Arrays.stream(student.getSkills().toLowerCase().split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
        Set<String> requiredSkills = Arrays.stream(job.getRequiredSkills().toLowerCase().split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
        if (requiredSkills.isEmpty()) return 100;
        long matched = requiredSkills.stream().filter(studentSkills::contains).count();
        return Math.round((double) matched / requiredSkills.size() * 100.0);
    }
}
