package com.placeshala.repository;

import com.placeshala.entity.Job;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface JobRepository extends JpaRepository<Job, Long> {
    List<Job> findByStatus(String status);
    List<Job> findByTitleContainingIgnoreCase(String title);

    @Query("SELECT j FROM Job j WHERE LOWER(j.requiredSkills) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Job> findBySkill(@Param("skill") String skill);

    List<Job> findByCompanyId(Long companyId);
}
