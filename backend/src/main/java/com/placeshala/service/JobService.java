package com.placeshala.service;

import com.placeshala.entity.Job;
import com.placeshala.exception.ResourceNotFoundException;
import com.placeshala.repository.JobRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JobService {

    private final JobRepository jobRepository;

    public JobService(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    public List<Job> getAllJobs() {
        return jobRepository.findAll();
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found with id: " + id));
    }

    public List<Job> searchByTitle(String title) {
        return jobRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Job> searchBySkill(String skill) {
        return jobRepository.findBySkill(skill);
    }

    public Page<Job> getJobsPaginated(int page, int size) {
        return jobRepository.findAll(PageRequest.of(page, size));
    }

    public Job createJob(Job job) {
        return jobRepository.save(job);
    }

    public Job updateJob(Long id, Job updated) {
        Job existing = getJobById(id);
        if (updated.getTitle() != null) existing.setTitle(updated.getTitle());
        if (updated.getDescription() != null) existing.setDescription(updated.getDescription());
        if (updated.getLocation() != null) existing.setLocation(updated.getLocation());
        if (updated.getType() != null) existing.setType(updated.getType());
        if (updated.getSalary() != null) existing.setSalary(updated.getSalary());
        if (updated.getRequiredSkills() != null) existing.setRequiredSkills(updated.getRequiredSkills());
        if (updated.getEligibility() != null) existing.setEligibility(updated.getEligibility());
        if (updated.getMinCgpa() != null) existing.setMinCgpa(updated.getMinCgpa());
        if (updated.getDeadline() != null) existing.setDeadline(updated.getDeadline());
        if (updated.getCompany() != null) existing.setCompany(updated.getCompany());
        return jobRepository.save(existing);
    }

    public void deleteJob(Long id) {
        if (!jobRepository.existsById(id)) {
            throw new ResourceNotFoundException("Job not found with id: " + id);
        }
        jobRepository.deleteById(id);
    }

    public Job closeJob(Long id) {
        Job job = getJobById(id);
        job.setStatus("CLOSED");
        return jobRepository.save(job);
    }

    public List<Job> getOpenJobs() {
        return jobRepository.findByStatus("OPEN");
    }
}
