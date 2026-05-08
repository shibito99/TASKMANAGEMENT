package com.taskmanagement.dto;

import jakarta.validation.constraints.NotBlank;

public record CreateCardRequest(@NotBlank String title) {}
