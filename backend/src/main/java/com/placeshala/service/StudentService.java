package com.placeshala.service;

import com.placeshala.entity.Student;
import com.placeshala.entity.Interview;
import com.placeshala.exception.*;
import com.placeshala.repository.StudentRepository;
import com.placeshala.repository.InterviewRepository;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentService {

    private final StudentRepository studentRepository;
    private final InterviewRepository interviewRepository;

    public StudentService(StudentRepository studentRepository, InterviewRepository interviewRepository) {
        this.studentRepository = studentRepository;
        this.interviewRepository = interviewRepository;
    }

    public Student createProfile(Student student) {
        student.setCreatedAt(LocalDateTime.now());
        student.setUpdatedAt(LocalDateTime.now());
        student.setProfileCompleteness(calculateCompleteness(student));
        return studentRepository.save(student);
    }

    public List<Student> getAllStudents() {
        return studentRepository.findAll();
    }

    public Student getStudentById(Long id) {
        return studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id: " + id));
    }

    public Student getStudentByUserId(Long userId) {
        return studentRepository.findByUserId(userId).orElse(null);
    }

    public Student updateStudent(Long id, Student updated) {
        Student existing = getStudentById(id);
        if (updated.getName() != null) existing.setName(updated.getName());
        if (updated.getPhone() != null) existing.setPhone(updated.getPhone());
        if (updated.getBranch() != null) existing.setBranch(updated.getBranch());
        if (updated.getCollege() != null) existing.setCollege(updated.getCollege());
        if (updated.getCgpa() != null) existing.setCgpa(updated.getCgpa());
        if (updated.getPassoutYear() != null) existing.setPassoutYear(updated.getPassoutYear());
        if (updated.getSkills() != null) existing.setSkills(updated.getSkills());
        if (updated.getBio() != null) existing.setBio(updated.getBio());
        existing.setUpdatedAt(LocalDateTime.now());
        existing.setProfileCompleteness(calculateCompleteness(existing));
        return studentRepository.save(existing);
    }

    public Student uploadResume(Long studentId, MultipartFile file) throws IOException {
        Student student = getStudentById(studentId);
        student.setResumeFileName(file.getOriginalFilename());
        student.setResumeData(file.getBytes());
        student.setResumeScore(calculateResumeScore(student));
        student.setUpdatedAt(LocalDateTime.now());
        student.setProfileCompleteness(calculateCompleteness(student));
        return studentRepository.save(student);
    }

    public List<Interview> getStudentInterviews(Long studentId) {
        return interviewRepository.findByStudentId(studentId);
    }

    public void deleteStudent(Long id) {
        if (!studentRepository.existsById(id)) {
            throw new ResourceNotFoundException("Student not found with id: " + id);
        }
        studentRepository.deleteById(id);
    }

    private int calculateCompleteness(Student s) {
        int score = 0;
        if (s.getName() != null && !s.getName().isEmpty()) score += 15;
        if (s.getEmail() != null && !s.getEmail().isEmpty()) score += 10;
        if (s.getPhone() != null && !s.getPhone().isEmpty()) score += 10;
        if (s.getBranch() != null && !s.getBranch().isEmpty()) score += 10;
        if (s.getCollege() != null && !s.getCollege().isEmpty()) score += 10;
        if (s.getCgpa() != null) score += 10;
        if (s.getPassoutYear() != null) score += 5;
        if (s.getSkills() != null && !s.getSkills().isEmpty()) score += 15;
        if (s.getBio() != null && !s.getBio().isEmpty()) score += 5;
        if (s.getResumeData() != null) score += 10;
        return Math.min(score, 100);
    }

    private int calculateResumeScore(Student s) {
        int score = 40; // base
        if (s.getSkills() != null) {
            String[] skills = s.getSkills().split(",");
            score += Math.min(skills.length * 5, 30);
        }
        if (s.getCgpa() != null && s.getCgpa() >= 7.0) score += 10;
        if (s.getBio() != null && s.getBio().length() > 50) score += 10;
        if (s.getCollege() != null) score += 5;
        if (s.getBranch() != null) score += 5;
        return Math.min(score, 100);
    }
}
