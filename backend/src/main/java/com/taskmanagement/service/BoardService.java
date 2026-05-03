package com.taskmanagement.service;

import com.taskmanagement.dto.*;
import com.taskmanagement.entity.Board;
import com.taskmanagement.entity.BoardList;
import com.taskmanagement.entity.Card;
import com.taskmanagement.entity.Label;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardService {

    private final BoardRepository boardRepository;

    @Transactional(readOnly = true)
    public List<BoardSummaryResponse> findAll() {
        return boardRepository.findAll().stream()
                .map(b -> new BoardSummaryResponse(b.getId(), b.getTitle(), b.getCreatedAt()))
                .toList();
    }

    @Transactional(readOnly = true)
    public BoardDetailResponse findById(Long id) {
        Board board = boardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found: id=" + id));
        return toDetailResponse(board);
    }

    private BoardDetailResponse toDetailResponse(Board board) {
        List<ListResponse> lists = board.getLists().stream()
                .map(this::toListResponse)
                .toList();
        return new BoardDetailResponse(board.getId(), board.getTitle(), board.getCreatedAt(), lists);
    }

    private ListResponse toListResponse(BoardList list) {
        List<CardResponse> cards = list.getCards().stream()
                .map(this::toCardResponse)
                .toList();
        return new ListResponse(list.getId(), list.getTitle(), list.getPosition(), cards);
    }

    private CardResponse toCardResponse(Card card) {
        List<LabelResponse> labels = card.getLabels().stream()
                .map(l -> new LabelResponse(l.getId(), l.getName(), l.getColor()))
                .toList();
        return new CardResponse(
                card.getId(),
                card.getTitle(),
                card.getDescription(),
                card.getDueDate(),
                card.getPosition(),
                labels
        );
    }
}
