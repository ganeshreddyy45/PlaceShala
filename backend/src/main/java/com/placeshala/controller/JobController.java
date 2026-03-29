package com.placeshala.controller;

import com.placeshala.entity.Job;
import com.placeshala.service.JobService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
public class JobController {

    private final JobService jobService;

    public JobController(JobService jobService) {
        this.jobService = jobService;
    }

    @GetMapping("/all")
    public ResponseEntity<List<Job>> getAllJobs() {
        return ResponseEntity.ok(jobService.getAllJobs());
    }

    @GetMapping("/search/title")
    public ResponseEntity<List<Job>> searchByTitle(@RequestParam String title) {
        return ResponseEntity.ok(jobService.searchByTitle(title));
    }

    @GetMapping("/search/skill")
    public ResponseEntity<List<Job>> searchBySkill(@RequestParam String skill) {
        return ResponseEntity.ok(jobService.searchBySkill(skill));
    }

    @GetMapping("/page")
    public ResponseEntity<Page<Job>> getJobsPaginated(@RequestParam(defaultValue = "0") int page,
                                                       @RequestParam(defaultValue = "10") int size) {
        return ResponseEntity.ok(jobService.getJobsPaginated(page, size));
    }
}
