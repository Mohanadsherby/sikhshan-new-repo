package com.sikhshan.dto;

public class EnrollmentRequest {
    private Long studentId;
    private Long courseId;
    private Integer progress;
    private String grade;

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }
} 