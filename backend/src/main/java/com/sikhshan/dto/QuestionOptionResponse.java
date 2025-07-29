package com.sikhshan.dto;

public class QuestionOptionResponse {
    private Long id;
    private String text;
    private Boolean isCorrect;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
} 