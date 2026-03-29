package com.placeshala.repository;

import com.placeshala.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.List;

public interface StudentRepository extends JpaRepository<Student, Long> {
    Optional<Student> findByUserId(Long userId);
    Optional<Student> findByEmail(String email);
    List<Student> findByBranch(String branch);
    boolean existsByEmail(String email);
}
