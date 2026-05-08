package com.taskmanagement.controller;

import com.taskmanagement.dto.LabelResponse;
import com.taskmanagement.service.LabelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class LabelController {

    private final LabelService labelService;

    @GetMapping("/labels")
    public List<LabelResponse> getLabels() {
        return labelService.findAll();
    }

    @PostMapping("/cards/{cardId}/labels/{labelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void attachLabel(@PathVariable Long cardId, @PathVariable Long labelId) {
        labelService.attach(cardId, labelId);
    }

    @DeleteMapping("/cards/{cardId}/labels/{labelId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void detachLabel(@PathVariable Long cardId, @PathVariable Long labelId) {
        labelService.detach(cardId, labelId);
    }
}
