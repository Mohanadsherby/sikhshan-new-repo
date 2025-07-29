package com.sikhshan.dto;

public class QuestionOptionRequest {
    private String text;
    private Boolean isCorrect = false;

    public String getText() { return text; }
    public void setText(String text) { this.text = text; }

    public Boolean getIsCorrect() { return isCorrect; }
    public void setIsCorrect(Boolean isCorrect) { this.isCorrect = isCorrect; }
} 