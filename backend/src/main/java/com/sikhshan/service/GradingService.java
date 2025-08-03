package com.sikhshan.service;

import com.sikhshan.model.*;
import com.sikhshan.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GradingService {

    @Autowired
    private CourseGradeRepository courseGradeRepository;

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private AssignmentSubmissionRepository assignmentSubmissionRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    /**
     * Calculate and update grades for a student in a specific course
     */
    public CourseGrade calculateCourseGrade(Long studentId, Long courseId) {
        System.out.println("Starting calculateCourseGrade for studentId: " + studentId + ", courseId: " + courseId);
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found with ID: " + studentId));
        System.out.println("Found student: " + student.getName());
        
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found with ID: " + courseId));
        System.out.println("Found course: " + course.getName());

        // Get or create course grade
        CourseGrade courseGrade = courseGradeRepository.findByStudentAndCourse(student, course)
                .orElse(new CourseGrade());
        courseGrade.setStudent(student);
        courseGrade.setCourse(course);

        // Calculate assignment grades
        calculateAssignmentGrades(courseGrade, studentId, courseId);

        // Calculate quiz grades
        calculateQuizGrades(courseGrade, studentId, courseId);

        // Calculate final grade
        calculateFinalGrade(courseGrade);

        // Save the grade
        CourseGrade savedGrade = courseGradeRepository.save(courseGrade);
        System.out.println("Successfully saved course grade with ID: " + savedGrade.getId());
        return savedGrade;
    }

    /**
     * Calculate assignment grades for a student in a course
     */
    private void calculateAssignmentGrades(CourseGrade courseGrade, Long studentId, Long courseId) {
        List<Assignment> assignments = assignmentRepository.findByCourseId(courseId);
        courseGrade.setAssignmentCount(assignments.size());

        double totalPoints = 0.0;
        double earnedPoints = 0.0;
        int gradedCount = 0;

        for (Assignment assignment : assignments) {
            totalPoints += assignment.getTotalPoints();

            // Get student's submission for this assignment
            Optional<AssignmentSubmission> submission = assignmentSubmissionRepository
                    .findByAssignmentAndStudent(assignment, courseGrade.getStudent());

            if (submission.isPresent() && submission.get().getPointsEarned() != null) {
                earnedPoints += submission.get().getPointsEarned();
                gradedCount++;
            }
        }

        courseGrade.setAssignmentTotalPoints(totalPoints);
        courseGrade.setAssignmentPointsEarned(earnedPoints);
        courseGrade.setAssignmentGradedCount(gradedCount);

        if (totalPoints > 0) {
            courseGrade.setAssignmentPercentage((earnedPoints / totalPoints) * 100.0);
        } else {
            courseGrade.setAssignmentPercentage(0.0);
        }
    }

    /**
     * Calculate quiz grades for a student in a course
     */
    private void calculateQuizGrades(CourseGrade courseGrade, Long studentId, Long courseId) {
        List<Quiz> quizzes = quizRepository.findByCourseId(courseId);
        courseGrade.setQuizCount(quizzes.size());

        double totalPoints = 0.0;
        double earnedPoints = 0.0;
        int attemptedCount = 0;

        for (Quiz quiz : quizzes) {
            totalPoints += quiz.getTotalPoints();

            // Get student's best attempt for this quiz
            List<QuizAttempt> attempts = quizAttemptRepository.findByQuizAndStudent(quiz, courseGrade.getStudent());
            
            if (!attempts.isEmpty()) {
                // Find the best attempt (highest score)
                QuizAttempt bestAttempt = attempts.stream()
                        .filter(attempt -> attempt.getPointsEarned() != null)
                        .max((a, b) -> Double.compare(a.getPointsEarned(), b.getPointsEarned()))
                        .orElse(null);

                if (bestAttempt != null) {
                    earnedPoints += bestAttempt.getPointsEarned();
                    attemptedCount++;
                }
            }
        }

        courseGrade.setQuizTotalPoints(totalPoints);
        courseGrade.setQuizPointsEarned(earnedPoints);
        courseGrade.setQuizAttemptedCount(attemptedCount);

        if (totalPoints > 0) {
            courseGrade.setQuizPercentage((earnedPoints / totalPoints) * 100.0);
        } else {
            courseGrade.setQuizPercentage(0.0);
        }
    }

    /**
     * Calculate final grade based on assignment and quiz percentages
     */
    private void calculateFinalGrade(CourseGrade courseGrade) {
        double assignmentWeight = courseGrade.getAssignmentWeight() / 100.0;
        double quizWeight = courseGrade.getQuizWeight() / 100.0;

        // Calculate weighted final percentage
        double finalPercentage = (courseGrade.getAssignmentPercentage() * assignmentWeight) +
                                (courseGrade.getQuizPercentage() * quizWeight);

        courseGrade.setFinalPercentage(finalPercentage);

        // Calculate total points and earned points
        courseGrade.setTotalPoints(courseGrade.getAssignmentTotalPoints() + courseGrade.getQuizTotalPoints());
        courseGrade.setPointsEarned(courseGrade.getAssignmentPointsEarned() + courseGrade.getQuizPointsEarned());

        // Assign letter grade and grade point
        assignLetterGrade(courseGrade, finalPercentage);
    }

    /**
     * Assign letter grade and grade point based on percentage (Nepali Grading System)
     */
    private void assignLetterGrade(CourseGrade courseGrade, double percentage) {
        if (percentage >= 90.0) {
            courseGrade.setLetterGrade("A+");
            courseGrade.setGradePoint(4.0);
            courseGrade.setPerformanceDescription("Outstanding");
        } else if (percentage >= 80.0) {
            courseGrade.setLetterGrade("A");
            courseGrade.setGradePoint(3.6);
            courseGrade.setPerformanceDescription("Excellent");
        } else if (percentage >= 70.0) {
            courseGrade.setLetterGrade("B+");
            courseGrade.setGradePoint(3.2);
            courseGrade.setPerformanceDescription("Very good");
        } else if (percentage >= 60.0) {
            courseGrade.setLetterGrade("B");
            courseGrade.setGradePoint(2.8);
            courseGrade.setPerformanceDescription("Good");
        } else if (percentage >= 50.0) {
            courseGrade.setLetterGrade("C+");
            courseGrade.setGradePoint(2.4);
            courseGrade.setPerformanceDescription("Above avg");
        } else if (percentage >= 40.0) {
            courseGrade.setLetterGrade("C");
            courseGrade.setGradePoint(2.0);
            courseGrade.setPerformanceDescription("Average");
        } else if (percentage >= 20.0) {
            courseGrade.setLetterGrade("D");
            courseGrade.setGradePoint(1.6);
            courseGrade.setPerformanceDescription("Below avg");
        } else if (percentage >= 1.0) {
            courseGrade.setLetterGrade("E");
            courseGrade.setGradePoint(0.8);
            courseGrade.setPerformanceDescription("Insufficient");
        } else {
            courseGrade.setLetterGrade("N");
            courseGrade.setGradePoint(0.0);
            courseGrade.setPerformanceDescription("Not Graded");
        }
    }

    /**
     * Update grading weights for a course
     */
    public CourseGrade updateGradingWeights(Long studentId, Long courseId, Double assignmentWeight, Double quizWeight) {
        CourseGrade courseGrade = courseGradeRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElseThrow(() -> new RuntimeException("Course grade not found"));

        courseGrade.setAssignmentWeight(assignmentWeight);
        courseGrade.setQuizWeight(quizWeight);

        // Recalculate final grade with new weights
        calculateFinalGrade(courseGrade);

        return courseGradeRepository.save(courseGrade);
    }

    /**
     * Get course grade for a student
     */
    public CourseGrade getCourseGrade(Long studentId, Long courseId) {
        return courseGradeRepository.findByStudentIdAndCourseId(studentId, courseId)
                .orElse(null);
    }

    /**
     * Get all grades for a student
     */
    public List<CourseGrade> getStudentGrades(Long studentId) {
        return courseGradeRepository.findByStudentId(studentId);
    }

    /**
     * Get all grades for a course
     */
    public List<CourseGrade> getCourseGrades(Long courseId) {
        return courseGradeRepository.findByCourseId(courseId);
    }

    /**
     * Calculate overall GPA for a student
     */
    public double calculateOverallGPA(Long studentId) {
        List<CourseGrade> grades = courseGradeRepository.findByStudentId(studentId);
        
        if (grades.isEmpty()) {
            return 0.0;
        }

        double totalGradePoints = 0.0;
        int totalCredits = 0;

        for (CourseGrade grade : grades) {
            if (grade.getGradePoint() != null && grade.getCourse().getCredits() != null) {
                totalGradePoints += grade.getGradePoint() * grade.getCourse().getCredits();
                totalCredits += grade.getCourse().getCredits();
            }
        }

        return totalCredits > 0 ? totalGradePoints / totalCredits : 0.0;
    }

    /**
     * Recalculate all grades for a course (when assignments/quizzes are updated)
     */
    public void recalculateCourseGrades(Long courseId) {
        List<CourseGrade> courseGrades = courseGradeRepository.findByCourseId(courseId);
        
        for (CourseGrade courseGrade : courseGrades) {
            calculateCourseGrade(courseGrade.getStudent().getId(), courseId);
        }
    }
} 