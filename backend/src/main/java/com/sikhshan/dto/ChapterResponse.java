package com.sikhshan.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ChapterResponse {
    private Long id;
    private String title;
    private String description;
    private Integer chapterNumber;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<CourseAttachmentResponse> attachments;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public Integer getChapterNumber() { return chapterNumber; }
    public void setChapterNumber(Integer chapterNumber) { this.chapterNumber = chapterNumber; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<CourseAttachmentResponse> getAttachments() { return attachments; }
    public void setAttachments(List<CourseAttachmentResponse> attachments) { this.attachments = attachments; }
} 