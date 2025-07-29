package com.sikhshan.utility;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sikhshan.model.Question;
import com.sikhshan.model.QuestionOption;

import java.util.List;
import java.util.Map;

public class QuizScoringUtility {
    
    private static final ObjectMapper objectMapper = new ObjectMapper();
    
    /**
     * Calculate score for a quiz attempt based on correct answers
     */
    public static QuizScoreResult calculateScore(List<Question> questions, Map<String, String> studentAnswers) {
        int totalPoints = 0;
        int pointsEarned = 0;
        
        for (Question question : questions) {
            totalPoints += question.getPoints();
            String studentAnswer = studentAnswers.get(question.getId().toString());
            
            if (studentAnswer != null && isAnswerCorrect(question, studentAnswer)) {
                pointsEarned += question.getPoints();
            }
        }
        
        double percentage = totalPoints > 0 ? Math.round((double) pointsEarned / totalPoints * 100.0 * 10.0) / 10.0 : 0.0;
        String letterGrade = calculateLetterGrade(percentage);
        String performanceDescription = getPerformanceDescription(percentage);
        
        return new QuizScoreResult(pointsEarned, totalPoints, percentage, letterGrade, performanceDescription);
    }
    
    /**
     * Check if a student's answer is correct for a given question
     */
    private static boolean isAnswerCorrect(Question question, String studentAnswer) {
        if (studentAnswer == null || studentAnswer.trim().isEmpty()) {
            return false;
        }
        
        switch (question.getType()) {
            case "MULTIPLE_CHOICE":
                return checkMultipleChoiceAnswer(question, studentAnswer);
            case "TRUE_FALSE":
                return checkTrueFalseAnswer(question, studentAnswer);
            case "SHORT_ANSWER":
                return checkShortAnswerAnswer(question, studentAnswer);
            default:
                return false;
        }
    }
    
    private static boolean checkMultipleChoiceAnswer(Question question, String studentAnswer) {
        try {
            Long selectedOptionId = Long.parseLong(studentAnswer);
            for (QuestionOption option : question.getOptions()) {
                if (option.getId().equals(selectedOptionId)) {
                    return option.getIsCorrect();
                }
            }
        } catch (NumberFormatException e) {
            // Invalid option ID
        }
        return false;
    }
    
    private static boolean checkTrueFalseAnswer(Question question, String studentAnswer) {
        String correctAnswer = question.getCorrectAnswer();
        return studentAnswer.trim().equalsIgnoreCase(correctAnswer);
    }
    
    private static boolean checkShortAnswerAnswer(Question question, String studentAnswer) {
        String correctAnswer = question.getCorrectAnswer();
        return studentAnswer.trim().equalsIgnoreCase(correctAnswer);
    }
    
    /**
     * Calculate letter grade based on percentage
     */
    public static String calculateLetterGrade(double percentage) {
        if (percentage >= 90.0) return "A+";
        if (percentage >= 80.0) return "A";
        if (percentage >= 70.0) return "B+";
        if (percentage >= 60.0) return "B";
        if (percentage >= 50.0) return "C+";
        if (percentage >= 40.0) return "C";
        if (percentage >= 35.0) return "D+";
        return "F";
    }
    
    /**
     * Get performance description based on percentage
     */
    public static String getPerformanceDescription(double percentage) {
        if (percentage >= 90.0) return "Outstanding";
        if (percentage >= 80.0) return "Excellent";
        if (percentage >= 70.0) return "Very Good";
        if (percentage >= 60.0) return "Good";
        if (percentage >= 50.0) return "Satisfactory";
        if (percentage >= 40.0) return "Acceptable";
        if (percentage >= 35.0) return "Basic";
        return "Fail";
    }
    
    /**
     * Parse student answers from JSON string
     */
    public static Map<String, String> parseStudentAnswers(String answersJson) {
        try {
            return objectMapper.readValue(answersJson, new TypeReference<Map<String, String>>() {});
        } catch (Exception e) {
            return Map.of();
        }
    }
    
    /**
     * Convert student answers to JSON string
     */
    public static String serializeStudentAnswers(Map<String, String> studentAnswers) {
        try {
            return objectMapper.writeValueAsString(studentAnswers);
        } catch (Exception e) {
            return "{}";
        }
    }
    
    /**
     * Result class for quiz scoring
     */
    public static class QuizScoreResult {
        private final int pointsEarned;
        private final int totalPoints;
        private final double percentage;
        private final String letterGrade;
        private final String performanceDescription;
        
        public QuizScoreResult(int pointsEarned, int totalPoints, double percentage, String letterGrade, String performanceDescription) {
            this.pointsEarned = pointsEarned;
            this.totalPoints = totalPoints;
            this.percentage = percentage;
            this.letterGrade = letterGrade;
            this.performanceDescription = performanceDescription;
        }
        
        public int getPointsEarned() { return pointsEarned; }
        public int getTotalPoints() { return totalPoints; }
        public double getPercentage() { return percentage; }
        public String getLetterGrade() { return letterGrade; }
        public String getPerformanceDescription() { return performanceDescription; }
    }
} 