package com.placeshala.config;

import com.placeshala.entity.*;
import com.placeshala.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;
    private final CompanyRepository companyRepository;
    private final JobRepository jobRepository;

    public DataSeeder(UserRepository userRepository, AdminRepository adminRepository,
                      StudentRepository studentRepository, CompanyRepository companyRepository,
                      JobRepository jobRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
        this.companyRepository = companyRepository;
        this.jobRepository = jobRepository;
    }

    @Override
    public void run(String... args) {
        // Seed Admin only if not present
        if (!adminRepository.existsByEmail("admin@placeshala.com")) {
            Admin admin = new Admin("Admin User", "admin@placeshala.com", "admin123");
            adminRepository.save(admin);
        }

        // Seed Student Users only if not present
        User user1 = userRepository.findByEmail("rahul@gmail.com")
                .orElseGet(() -> userRepository.save(new User("Rahul Sharma", "rahul@gmail.com", "pass123")));
        User user2 = userRepository.findByEmail("priya@gmail.com")
                .orElseGet(() -> userRepository.save(new User("Priya Patel", "priya@gmail.com", "pass123")));
        User user3 = userRepository.findByEmail("amit@gmail.com")
                .orElseGet(() -> userRepository.save(new User("Amit Kumar", "amit@gmail.com", "pass123")));

        // Seed Student Profiles only if not present
        if (!studentRepository.existsByEmail("rahul@gmail.com")) {
            Student s1 = new Student();
            s1.setUserId(user1.getId());
            s1.setName("Rahul Sharma");
            s1.setEmail("rahul@gmail.com");
            s1.setPhone("9876543210");
            s1.setBranch("Computer Science");
            s1.setCollege("IIT Delhi");
            s1.setCgpa(8.5);
            s1.setPassoutYear(2026);
            s1.setSkills("Java,Python,React,Spring Boot,SQL,Git,Data Structures,Algorithms");
            s1.setBio("Passionate software developer with expertise in full-stack development and a strong foundation in data structures and algorithms.");
            s1.setProfileCompleteness(90);
            s1.setResumeScore(85);
            studentRepository.save(s1);
        }

        if (!studentRepository.existsByEmail("priya@gmail.com")) {
            Student s2 = new Student();
            s2.setUserId(user2.getId());
            s2.setName("Priya Patel");
            s2.setEmail("priya@gmail.com");
            s2.setPhone("9876543211");
            s2.setBranch("Electronics");
            s2.setCollege("IIT Bombay");
            s2.setCgpa(9.0);
            s2.setPassoutYear(2026);
            s2.setSkills("C++,JavaScript,Angular,SQL,Machine Learning");
            s2.setBio("Electronics engineer with a passion for software development and machine learning.");
            s2.setProfileCompleteness(88);
            s2.setResumeScore(82);
            studentRepository.save(s2);
        }

        // You can continue similarly for Amit Kumar or other seed data
    }
}
