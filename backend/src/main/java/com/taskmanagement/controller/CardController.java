package com.taskmanagement.controller;

import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.dto.CreateCardRequest;
import com.taskmanagement.dto.UpdateCardRequest;
import com.taskmanagement.service.CardService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class CardController {

    private final CardService cardService;

    @PostMapping("/lists/{listId}/cards")
    @ResponseStatus(HttpStatus.CREATED)
    public CardResponse createCard(@PathVariable Long listId,
                                   @RequestBody @Valid CreateCardRequest req) {
        return cardService.create(listId, req);
    }

    @PatchMapping("/cards/{id}")
    public CardResponse updateCard(@PathVariable Long id,
                                   @RequestBody UpdateCardRequest req) {
        return cardService.update(id, req);
    }

    @DeleteMapping("/cards/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCard(@PathVariable Long id) {
        cardService.delete(id);
    }
}
