package com.placeshala.service;

import com.placeshala.dto.*;
import com.placeshala.entity.*;
import com.placeshala.exception.*;
import com.placeshala.repository.*;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    private final StudentRepository studentRepository;

    public AuthService(UserRepository userRepository, AdminRepository adminRepository, StudentRepository studentRepository) {
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.studentRepository = studentRepository;
    }

    public AuthResponse registerStudent(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        User user = new User(request.getName(), request.getEmail(), request.getPassword());
        user.setRole("STUDENT");
        user = userRepository.save(user);
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "STUDENT", "Registration successful", null);
    }

    public AuthResponse loginStudent(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        if (!user.getPassword().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        Optional<Student> student = studentRepository.findByUserId(user.getId());
        Long profileId = student.map(Student::getId).orElse(null);
        return new AuthResponse(user.getId(), user.getName(), user.getEmail(), "STUDENT", "Login successful", profileId);
    }

    public AuthResponse registerAdmin(RegisterRequest request) {
        if (adminRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email already registered");
        }
        Admin admin = new Admin(request.getName(), request.getEmail(), request.getPassword());
        admin = adminRepository.save(admin);
        return new AuthResponse(admin.getId(), admin.getName(), admin.getEmail(), "ADMIN", "Registration successful", null);
    }

    public AuthResponse loginAdmin(LoginRequest request) {
        Admin admin = adminRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password"));
        if (!admin.getPassword().equals(request.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }
        return new AuthResponse(admin.getId(), admin.getName(), admin.getEmail(), "ADMIN", "Login successful", null);
    }
}
