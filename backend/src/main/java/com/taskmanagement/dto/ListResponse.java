package com.taskmanagement.dto;

import java.util.List;

public record ListResponse(
        Long id,
        String title,
        int position,
        List<CardResponse> cards
) {}
