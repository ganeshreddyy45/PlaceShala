package com.placeshala.dto;

import java.util.List;
import java.util.Map;

public class ResumeAnalysis {
    private int score;
    private List<String> extractedSkills;
    private List<String> missingSkills;
    private List<String> suggestions;
    private Map<String, Integer> categoryScores;

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }
    public List<String> getExtractedSkills() { return extractedSkills; }
    public void setExtractedSkills(List<String> extractedSkills) { this.extractedSkills = extractedSkills; }
    public List<String> getMissingSkills() { return missingSkills; }
    public void setMissingSkills(List<String> missingSkills) { this.missingSkills = missingSkills; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public Map<String, Integer> getCategoryScores() { return categoryScores; }
    public void setCategoryScores(Map<String, Integer> categoryScores) { this.categoryScores = categoryScores; }
}
