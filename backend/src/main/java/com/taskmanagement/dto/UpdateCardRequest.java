package com.taskmanagement.dto;

import java.time.LocalDate;

public record UpdateCardRequest(
        String title,
        String description,
        LocalDate dueDate,
        Integer position,
        Long listId
) {}
