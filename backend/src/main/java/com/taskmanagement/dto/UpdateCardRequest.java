package com.taskmanagement.dto;

import java.time.LocalDateTime;

public record UpdateCardRequest(
        String title,
        String description,
        LocalDateTime dueDate,
        Integer position,
        Long listId
) {}
