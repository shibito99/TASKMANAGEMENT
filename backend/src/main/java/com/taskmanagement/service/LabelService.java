package com.taskmanagement.service;

import com.taskmanagement.dto.LabelResponse;
import com.taskmanagement.entity.Card;
import com.taskmanagement.entity.Label;
import com.taskmanagement.exception.ResourceNotFoundException;
import com.taskmanagement.repository.CardRepository;
import com.taskmanagement.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class LabelService {

    private final LabelRepository labelRepository;
    private final CardRepository cardRepository;

    @Transactional(readOnly = true)
    public List<LabelResponse> findAll() {
        return labelRepository.findAll().stream()
                .map(l -> new LabelResponse(l.getId(), l.getName(), l.getColor()))
                .toList();
    }

    @Transactional
    public void attach(Long cardId, Long labelId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found: id=" + cardId));
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found: id=" + labelId));

        if (!card.getLabels().contains(label)) {
            card.getLabels().add(label);
            cardRepository.save(card);
        }
    }

    @Transactional
    public void detach(Long cardId, Long labelId) {
        Card card = cardRepository.findById(cardId)
                .orElseThrow(() -> new ResourceNotFoundException("Card not found: id=" + cardId));
        Label label = labelRepository.findById(labelId)
                .orElseThrow(() -> new ResourceNotFoundException("Label not found: id=" + labelId));

        card.getLabels().remove(label);
        cardRepository.save(card);
    }
}
