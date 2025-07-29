package com.sikhshan.utility;

public class GradeCalculator {
    
    /**
     * Calculate letter grade from percentage score according to new system
     * @param percentage The percentage score (0-100)
     * @return Letter grade (A+, A, B+, B, C+, C, D+, F)
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
     * Calculate percentage from points earned and total points
     * @param pointsEarned Points earned by student
     * @param totalPoints Total possible points
     * @return Percentage score (0-100)
     */
    public static double calculatePercentage(int pointsEarned, int totalPoints) {
        if (totalPoints <= 0) return 0.0;
        return Math.round((double) pointsEarned / totalPoints * 100.0 * 10.0) / 10.0; // Round to 1 decimal place
    }
    
    /**
     * Calculate grade point from percentage according to new system
     * @param percentage The percentage score (0-100)
     * @return Grade point (1.6 - 4.0)
     */
    public static double calculateGradePoint(double percentage) {
        if (percentage >= 90.0) return 4.0;
        if (percentage >= 80.0) return 3.6;
        if (percentage >= 70.0) return 3.2;
        if (percentage >= 60.0) return 2.8;
        if (percentage >= 50.0) return 2.4;
        if (percentage >= 40.0) return 2.0;
        if (percentage >= 35.0) return 1.6;
        return 0.0; // F grade
    }
    
    /**
     * Get performance description from percentage
     * @param percentage The percentage score (0-100)
     * @return Performance description
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
} 