package com.taskmanagement.dto;

import java.time.LocalDateTime;

public record BoardSummaryResponse(Long id, String title, LocalDateTime createdAt) {}
