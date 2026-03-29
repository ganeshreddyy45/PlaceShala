package com.placeshala.repository;

import com.placeshala.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByStudentId(Long studentId);
    List<Interview> findByJobId(Long jobId);
}
