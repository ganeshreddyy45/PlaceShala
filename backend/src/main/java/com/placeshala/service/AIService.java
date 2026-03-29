package com.placeshala.service;

import com.placeshala.dto.ResumeAnalysis;
import com.placeshala.entity.*;
import com.placeshala.repository.*;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class AIService {

    private final StudentRepository studentRepository;
    private final JobRepository jobRepository;

    private static final List<String> TOP_SKILLS = Arrays.asList(
            "java", "python", "javascript", "react", "angular", "spring boot", "node.js",
            "sql", "mongodb", "git", "docker", "aws", "html", "css", "typescript",
            "c++", "data structures", "algorithms", "machine learning", "deep learning",
            "communication", "teamwork", "problem solving", "linux", "rest api"
    );

    public AIService(StudentRepository studentRepository, JobRepository jobRepository) {
        this.studentRepository = studentRepository;
        this.jobRepository = jobRepository;
    }

    public ResumeAnalysis analyzeResume(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        ResumeAnalysis analysis = new ResumeAnalysis();
        if (student == null) {
            analysis.setScore(0);
            analysis.setExtractedSkills(Collections.emptyList());
            analysis.setMissingSkills(TOP_SKILLS);
            analysis.setSuggestions(Arrays.asList("Create your profile first"));
            return analysis;
        }

        List<String> extracted = new ArrayList<>();
        if (student.getSkills() != null) {
            extracted = Arrays.stream(student.getSkills().split(","))
                    .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toList());
        }
        Set<String> extractedLower = extracted.stream().map(String::toLowerCase).collect(Collectors.toSet());
        List<String> missing = TOP_SKILLS.stream()
                .filter(s -> !extractedLower.contains(s)).limit(8).collect(Collectors.toList());

        int score = 30;
        score += Math.min(extracted.size() * 5, 25);
        if (student.getResumeData() != null) score += 15;
        if (student.getBio() != null && student.getBio().length() > 50) score += 10;
        if (student.getCgpa() != null && student.getCgpa() >= 7.0) score += 10;
        if (student.getCollege() != null) score += 5;
        if (student.getBranch() != null) score += 5;
        score = Math.min(score, 100);

        analysis.setScore(score);
        analysis.setExtractedSkills(extracted);
        analysis.setMissingSkills(missing);

        List<String> suggestions = new ArrayList<>();
        if (student.getResumeData() == null) suggestions.add("Upload your resume to improve your profile visibility");
        if (extracted.size() < 5) suggestions.add("Add more technical skills to your profile (aim for 5+)");
        if (student.getBio() == null || student.getBio().length() < 50) suggestions.add("Write a detailed bio (at least 50 characters)");
        if (student.getCgpa() == null) suggestions.add("Add your CGPA to your profile");
        if (missing.contains("git")) suggestions.add("Learn Git version control - essential for all tech roles");
        if (missing.contains("data structures")) suggestions.add("Strengthen your Data Structures & Algorithms knowledge");
        if (missing.contains("communication")) suggestions.add("Highlight communication skills in your profile");
        if (suggestions.isEmpty()) suggestions.add("Great profile! Keep it updated with new projects and certifications");
        analysis.setSuggestions(suggestions);

        Map<String, Integer> categoryScores = new LinkedHashMap<>();
        categoryScores.put("Technical Skills", Math.min(extracted.size() * 10, 100));
        categoryScores.put("Profile Completeness", student.getProfileCompleteness() != null ? student.getProfileCompleteness() : 0);
        categoryScores.put("Resume Quality", student.getResumeData() != null ? 80 : 20);
        categoryScores.put("Academic Score", student.getCgpa() != null ? (int)(student.getCgpa() * 10) : 0);
        analysis.setCategoryScores(categoryScores);

        return analysis;
    }

    public List<Map<String, Object>> getRecommendedJobs(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        if (student == null) return Collections.emptyList();

        List<Job> allJobs = jobRepository.findByStatus("OPEN");
        Set<String> studentSkills = new HashSet<>();
        if (student.getSkills() != null) {
            studentSkills = Arrays.stream(student.getSkills().toLowerCase().split(","))
                    .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
        }

        List<Map<String, Object>> recommended = new ArrayList<>();
        for (Job job : allJobs) {
            if (job == null) continue;
            double match = calculateMatch(studentSkills, job);
            if (match > 20) {
                Map<String, Object> rec = new LinkedHashMap<>();
                rec.put("job", job);
                rec.put("matchPercentage", match);
                rec.put("matchLevel", match >= 75 ? "Excellent" : match >= 50 ? "Good" : "Fair");
                recommended.add(rec);
            }
        }
        recommended.sort((a, b) -> Double.compare((Double) b.get("matchPercentage"), (Double) a.get("matchPercentage")));
        return recommended.stream().limit(10).collect(Collectors.toList());
    }

    public Map<String, Object> getPlacementReadiness(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        Map<String, Object> readiness = new LinkedHashMap<>();
        if (student == null) {
            readiness.put("overallScore", 0);
            readiness.put("level", "Not Ready");
            return readiness;
        }

        int profileScore = student.getProfileCompleteness() != null ? student.getProfileCompleteness() : 0;
        int resumeScore = student.getResumeScore() != null ? student.getResumeScore() : 0;
        int skillScore = 0;
        if (student.getSkills() != null) {
            skillScore = Math.min(student.getSkills().split(",").length * 10, 100);
        }
        int overall = (profileScore + resumeScore + skillScore) / 3;

        readiness.put("overallScore", overall);
        readiness.put("profileScore", profileScore);
        readiness.put("resumeScore", resumeScore);
        readiness.put("skillScore", skillScore);
        readiness.put("level", overall >= 80 ? "Placement Ready" : overall >= 60 ? "Almost Ready" : overall >= 40 ? "Needs Improvement" : "Not Ready");

        List<String> tips = new ArrayList<>();
        if (profileScore < 80) tips.add("Complete your profile to at least 80%");
        if (resumeScore < 60) tips.add("Improve your resume quality");
        if (skillScore < 60) tips.add("Add more relevant technical skills");
        readiness.put("tips", tips);
        return readiness;
    }

    public List<Map<String, Object>> getInterviewQuestions(Long jobId) {
        Job job = jobRepository.findById(jobId).orElse(null);
        List<Map<String, Object>> questions = new ArrayList<>();
        if (job == null) return questions;

        addQuestion(questions, "Tell me about yourself and why you're interested in this role.", "Behavioral", "Easy");
        addQuestion(questions, "What are your strengths and weaknesses?", "Behavioral", "Easy");

        if (job.getRequiredSkills() != null) {
            String[] skills = job.getRequiredSkills().split(",");
            for (String skill : skills) {
                String s = skill.trim();
                if (!s.isEmpty()) {
                    addQuestion(questions, "Explain your experience with " + s + " and a project where you used it.", "Technical", "Medium");
                    addQuestion(questions, "What are the key concepts in " + s + " that every developer should know?", "Technical", "Medium");
                }
            }
        }

        addQuestion(questions, "Where do you see yourself in 5 years?", "HR", "Easy");
        addQuestion(questions, "Describe a challenging project you worked on and how you overcame difficulties.", "Behavioral", "Medium");
        addQuestion(questions, "How do you stay updated with the latest technology trends?", "HR", "Easy");
        return questions;
    }

    public List<Map<String, String>> getSkillGapInsights(Long studentId) {
        Student student = studentRepository.findById(studentId).orElse(null);
        List<Map<String, String>> insights = new ArrayList<>();
        if (student == null || student.getSkills() == null) {
            Map<String, String> insight = new LinkedHashMap<>();
            insight.put("skill", "Profile Setup");
            insight.put("importance", "Critical");
            insight.put("suggestion", "Set up your profile with skills to get personalized insights");
            insights.add(insight);
            return insights;
        }

        Set<String> hasSkills = Arrays.stream(student.getSkills().toLowerCase().split(","))
                .map(String::trim).collect(Collectors.toSet());

        List<Job> hotJobs = jobRepository.findByStatus("OPEN");
        Map<String, Integer> demandCount = new LinkedHashMap<>();
        for (Job job : hotJobs) {
            if (job.getRequiredSkills() != null) {
                for (String skill : job.getRequiredSkills().toLowerCase().split(",")) {
                    String s = skill.trim();
                    if (!s.isEmpty() && !hasSkills.contains(s)) {
                        demandCount.merge(s, 1, Integer::sum);
                    }
                }
            }
        }

        demandCount.entrySet().stream()
                .sorted(Map.Entry.<String, Integer>comparingByValue().reversed())
                .limit(6)
                .forEach(e -> {
                    Map<String, String> insight = new LinkedHashMap<>();
                    insight.put("skill", e.getKey());
                    insight.put("demand", e.getValue() + " open jobs require this");
                    insight.put("importance", e.getValue() >= 3 ? "High" : e.getValue() >= 2 ? "Medium" : "Low");
                    insight.put("suggestion", "Consider learning " + e.getKey() + " through online courses or projects");
                    insights.add(insight);
                });
        return insights;
    }

    private double calculateMatch(Set<String> studentSkills, Job job) {
        if (job == null || job.getRequiredSkills() == null || studentSkills == null || studentSkills.isEmpty()) return 0;
        Set<String> required = Arrays.stream(job.getRequiredSkills().toLowerCase().split(","))
                .map(String::trim).filter(s -> !s.isEmpty()).collect(Collectors.toSet());
        if (required.isEmpty()) return 50;
        long matched = required.stream().filter(studentSkills::contains).count();
        return Math.round((double) matched / required.size() * 100.0);
    }

    private void addQuestion(List<Map<String, Object>> list, String q, String category, String difficulty) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("question", q);
        m.put("category", category);
        m.put("difficulty", difficulty);
        list.add(m);
    }
}
