package com.taskmanagement.dto;

import java.time.LocalDate;
import java.util.List;

public record CardResponse(
        Long id,
        String title,
        String description,
        LocalDate dueDate,
        int position,
        List<LabelResponse> labels
) {}
