package com.taskmanagement.controller;

import com.taskmanagement.dto.CreateListRequest;
import com.taskmanagement.dto.ListResponse;
import com.taskmanagement.dto.UpdateListRequest;
import com.taskmanagement.service.BoardListService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class BoardListController {

    private final BoardListService boardListService;

    @PostMapping("/boards/{boardId}/lists")
    @ResponseStatus(HttpStatus.CREATED)
    public ListResponse createList(@PathVariable Long boardId,
                                   @RequestBody @Valid CreateListRequest req) {
        return boardListService.create(boardId, req);
    }

    @PatchMapping("/lists/{id}")
    public ListResponse updateList(@PathVariable Long id,
                                   @RequestBody UpdateListRequest req) {
        return boardListService.update(id, req);
    }

    @DeleteMapping("/lists/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteList(@PathVariable Long id) {
        boardListService.delete(id);
    }
}
