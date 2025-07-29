package com.sikhshan.dto;

import java.util.List;

public class QuestionRequest {
    private String text;
    private String type; // MULTIPLE_CHOICE, TRUE_FALSE, SHORT_ANSWER
    private Integer points = 1;
    private String correctAnswer;
    private List<QuestionOptionRequest> options;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<QuestionOptionRequest> getOptions() { return options; }
    public void setOptions(List<QuestionOptionRequest> options) { this.options = options; }
} 