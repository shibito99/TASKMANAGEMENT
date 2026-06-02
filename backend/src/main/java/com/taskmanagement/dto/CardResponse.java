package com.taskmanagement.dto;

import java.time.LocalDateTime;
import java.util.List;

public record CardResponse(
        Long id,
        String title,
        String description,
        LocalDateTime dueDate,
        int position,
        List<LabelResponse> labels
) {}
