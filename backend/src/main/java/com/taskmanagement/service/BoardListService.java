package com.taskmanagement.service;

import com.taskmanagement.dto.CreateListRequest;
import com.taskmanagement.dto.ListResponse;
import com.taskmanagement.dto.UpdateListRequest;
import com.taskmanagement.entity.Board;
import com.taskmanagement.entity.BoardList;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.repository.BoardListRepository;
import com.taskmanagement.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class BoardListService {

    private final BoardRepository boardRepository;
    private final BoardListRepository listRepository;

    @Transactional
    public ListResponse create(Long boardId, CreateListRequest req) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new ResourceNotFoundException("Board not found: id=" + boardId));

        int position = board.getLists().size();
        BoardList list = new BoardList();
        list.setBoard(board);
        list.setTitle(req.title());
        list.setPosition(position);
        list = listRepository.save(list);

        return new ListResponse(list.getId(), list.getTitle(), list.getPosition(), List.of());
    }

    @Transactional
    public ListResponse update(Long id, UpdateListRequest req) {
        BoardList list = listRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("List not found: id=" + id));

        if (req.title() != null) list.setTitle(req.title());
        if (req.position() != null) list.setPosition(req.position());
        list = listRepository.save(list);

        return new ListResponse(list.getId(), list.getTitle(), list.getPosition(), List.of());
    }

    @Transactional
    public void delete(Long id) {
        if (!listRepository.existsById(id)) {
            throw new ResourceNotFoundException("List not found: id=" + id);
        }
        listRepository.deleteById(id);
    }
}
