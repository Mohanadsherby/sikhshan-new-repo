package com.sikhshan.dto;

import java.util.List;

public class QuestionResponse {
    private Long id;
    private String text;
    private String type;
    private Integer points;
    private String correctAnswer;
    private List<QuestionOptionResponse> options;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public Integer getPoints() { return points; }
    public void setPoints(Integer points) { this.points = points; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }

    public List<QuestionOptionResponse> getOptions() { return options; }
    public void setOptions(List<QuestionOptionResponse> options) { this.options = options; }
} 