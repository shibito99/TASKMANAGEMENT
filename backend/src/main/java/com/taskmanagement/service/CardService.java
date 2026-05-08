package com.taskmanagement.service;

import com.taskmanagement.dto.CardResponse;
import com.taskmanagement.dto.CreateCardRequest;
import com.taskmanagement.dto.LabelResponse;
import com.taskmanagement.dto.UpdateCardRequest;
import com.taskmanagement.entity.BoardList;
import com.taskmanagement.entity.Card;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.repository.BoardListRepository;
import com.taskmanagement.repository.CardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CardService {

    private final BoardListRepository listRepository;
    private final CardRepository cardRepository;

    @Transactional
    public CardResponse create(Long listId, CreateCardRequest req) {
        BoardList list = listRepository.findById(listId)
                .orElseThrow(() -> new ResourceNotFoundException("List not found: id=" + listId));

        int position = list.getCards().size();
        Card card = new Card();
        card.setList(list);
        card.setTitle(req.title());
        card.setPosition(position);
        card = cardRepository.save(card);

        return new CardResponse(card.getId(), card.getTitle(), card.getDescription(),
                card.getDueDate(), card.getPosition(), List.of());
    }

    @Transactional
    public CardResponse update(Long id, UpdateCardRequest req) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found: id=" + id));

        if (req.title() != null) card.setTitle(req.title());
        if (req.description() != null) card.setDescription(req.description());
        if (req.dueDate() != null) card.setDueDate(req.dueDate());
        if (req.position() != null) card.setPosition(req.position());
        if (req.listId() != null) {
            BoardList newList = listRepository.findById(req.listId())
                    .orElseThrow(() -> new ResourceNotFoundException("List not found: id=" + req.listId()));
            card.setList(newList);
        }
        card = cardRepository.save(card);

        List<LabelResponse> labels = card.getLabels().stream()
                .map(l -> new LabelResponse(l.getId(), l.getName(), l.getColor()))
                .toList();
        return new CardResponse(card.getId(), card.getTitle(), card.getDescription(),
                card.getDueDate(), card.getPosition(), labels);
    }

    @Transactional
    public void delete(Long id) {
        Card card = cardRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found: id=" + id));
        card.getLabels().clear();
        cardRepository.delete(card);
    }
}
