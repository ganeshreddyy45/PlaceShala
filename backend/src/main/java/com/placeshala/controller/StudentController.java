package com.placeshala.controller;

import com.placeshala.entity.Student;
import com.placeshala.entity.Interview;
import com.placeshala.service.StudentService;
import com.placeshala.service.AIService;
import com.placeshala.dto.ResumeAnalysis;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/students")
public class StudentController {

    private final StudentService studentService;
    private final AIService aiService;

    public StudentController(StudentService studentService, AIService aiService) {
        this.studentService = studentService;
        this.aiService = aiService;
    }

    @PostMapping("/profile")
    public ResponseEntity<Student> createProfile(@RequestBody Student student) {
        return ResponseEntity.ok(studentService.createProfile(student));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Student>> getAllStudents() {
        return ResponseEntity.ok(studentService.getAllStudents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(@PathVariable("id") Long id) {
        return ResponseEntity.ok(studentService.getStudentById(id));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Student> getStudentByUserId(@PathVariable("userId") Long userId) {
        Student student = studentService.getStudentByUserId(userId);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Student> updateStudent(@PathVariable("id") Long id, @RequestBody Student student) {
        return ResponseEntity.ok(studentService.updateStudent(id, student));
    }

    @PostMapping("/uploadResume")
    public ResponseEntity<Student> uploadResume(@RequestParam("studentId") Long studentId, @RequestParam("file") MultipartFile file) throws Exception {
        return ResponseEntity.ok(studentService.uploadResume(studentId, file));
    }

    @GetMapping("/downloadResume/{studentId}")
    public ResponseEntity<byte[]> downloadResume(@PathVariable("studentId") Long studentId) {
        Student student = studentService.getStudentById(studentId);
        if (student.getResumeData() == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + student.getResumeFileName() + "\"")
                .body(student.getResumeData());
    }

    @GetMapping("/interviews/{studentId}")
    public ResponseEntity<List<Interview>> getInterviews(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(studentService.getStudentInterviews(studentId));
    }

    @GetMapping("/resume-analysis/{studentId}")
    public ResponseEntity<ResumeAnalysis> getResumeAnalysis(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(aiService.analyzeResume(studentId));
    }

    @GetMapping("/recommended-jobs/{studentId}")
    public ResponseEntity<List<Map<String, Object>>> getRecommendedJobs(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(aiService.getRecommendedJobs(studentId));
    }

    @GetMapping("/placement-readiness/{studentId}")
    public ResponseEntity<Map<String, Object>> getPlacementReadiness(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(aiService.getPlacementReadiness(studentId));
    }

    @GetMapping("/skill-gap/{studentId}")
    public ResponseEntity<List<Map<String, String>>> getSkillGap(@PathVariable("studentId") Long studentId) {
        return ResponseEntity.ok(aiService.getSkillGapInsights(studentId));
    }

    @GetMapping("/interview-questions/{jobId}")
    public ResponseEntity<List<Map<String, Object>>> getInterviewQuestions(@PathVariable("jobId") Long jobId) {
        return ResponseEntity.ok(aiService.getInterviewQuestions(jobId));
    }
}
