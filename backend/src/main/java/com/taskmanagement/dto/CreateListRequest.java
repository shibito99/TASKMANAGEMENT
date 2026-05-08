package com.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateListRequest(@NotBlank String title) {}
