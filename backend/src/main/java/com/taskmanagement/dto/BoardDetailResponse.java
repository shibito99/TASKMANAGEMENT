package com.taskmanagement.dto;

import java.time.LocalDateTime;
import java.util.List;

public record BoardDetailResponse(
        Long id,
        String title,
        LocalDateTime createdAt,
        List<ListResponse> lists
) {}
