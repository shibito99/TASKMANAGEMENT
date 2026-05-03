package com.taskmanagement.controller;

import com.taskmanagement.dto.BoardDetailResponse;
import com.taskmanagement.dto.BoardSummaryResponse;
import com.taskmanagement.service.BoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/boards")
@RequiredArgsConstructor
public class BoardController {

    private final BoardService boardService;

    @GetMapping
    public List<BoardSummaryResponse> getBoards() {
        return boardService.findAll();
    }

    @GetMapping("/{id}")
    public BoardDetailResponse getBoard(@PathVariable Long id) {
        return boardService.findById(id);
    }
}
