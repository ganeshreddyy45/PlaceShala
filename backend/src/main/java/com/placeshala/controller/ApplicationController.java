package com.placeshala.controller;

import com.placeshala.entity.Application;
import com.placeshala.service.ApplicationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping("/apply")
    public ResponseEntity<Application> apply(@RequestParam("studentId") Long studentId, @RequestParam("jobId") Long jobId) {
        return ResponseEntity.ok(applicationService.applyForJob(studentId, jobId));
    }

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Application>> getStudentApplications(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(applicationService.getStudentApplications(studentId));
    }
}
