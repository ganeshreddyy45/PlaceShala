package com.placeshala.service;

import com.placeshala.dto.InterviewRequest;
import com.placeshala.entity.*;
import com.placeshala.exception.ResourceNotFoundException;
import com.placeshala.repository.*;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    private final InterviewRepository interviewRepository;
    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    public InterviewService(InterviewRepository interviewRepository,
                            StudentRepository studentRepository,
                            JobRepository jobRepository) {
        this.interviewRepository = interviewRepository;
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    public Interview schedule(InterviewRequest request) {
        Student student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new ResourceNotFoundException("Student not found"));
        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new ResourceNotFoundException("Job not found"));

        Interview interview = new Interview();
        interview.setStudent(student);
        interview.setJob(job);
        interview.setInterviewType(request.getInterviewType());
        interview.setScheduledAt(request.getScheduledAt());
        interview.setVenue(request.getVenue());
        interview.setMeetingLink(request.getMeetingLink());
        interview.setNotes(request.getNotes());
        return interviewRepository.save(interview);
    }

    public List<Interview> getAllInterviews() {
        return interviewRepository.findAll();
    }

    public List<Interview> getByStudent(Long studentId) {
        return interviewRepository.findByStudentId(studentId);
    }
}
