package com.taskmanagement.initializer;

import com.taskmanagement.entity.Board;
import com.taskmanagement.entity.BoardList;
import com.taskmanagement.entity.Card;
import com.taskmanagement.entity.Label;
import com.taskmanagement.repository.BoardRepository;
import com.taskmanagement.repository.BoardListRepository;
import com.taskmanagement.repository.CardRepository;
import com.taskmanagement.repository.LabelRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final BoardRepository boardRepository;
    private final BoardListRepository listRepository;
    private final CardRepository cardRepository;
    private final LabelRepository labelRepository;

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void init() {
        if (boardRepository.count() > 0) {
            log.info("テストデータは投入済みのためスキップします");
            return;
        }

        log.info("テストデータを投入します...");

        // ===== ラベル =====
        Label urgent = saveLabel("🔴 緊急", "#ef4444");
        Label medium = saveLabel("🟡 中",   "#f59e0b");
        Label low    = saveLabel("🟢 低",   "#22c55e");

        // ===== ボード =====
        Board board = new Board();
        board.setTitle("タスク管理ボード");
        board = boardRepository.save(board);

        // ===== リスト =====
        BoardList todo       = saveList(board, "📋 To Do",        0);
        BoardList inProgress = saveList(board, "🔄 In Progress",  1);
        BoardList done       = saveList(board, "✅ Done",          2);

        // ===== To Do のカード =====
        saveCard(todo, "デザインの修正",        "トップページのバナーを修正する",   LocalDate.of(2026, 5, 10), 0, List.of(urgent));
        saveCard(todo, "仕様書のレビュー",       "",                                 LocalDate.of(2026, 5, 8),  1, List.of(medium));
        saveCard(todo, "APIエンドポイント設計", "",                                  null,                      2, List.of());

        // ===== In Progress のカード =====
        saveCard(inProgress, "ログイン画面の実装",  "React + Tailwind で実装",      LocalDate.of(2026, 4, 30), 0, List.of(urgent));
        saveCard(inProgress, "データベース設計",    "ER図をもとにSQLite設定",       null,                      1, List.of(medium));

        // ===== Done のカード =====
        saveCard(done, "要件定義書の作成",   "", null, 0, List.of(low));
        saveCard(done, "技術スタックの選定", "", null, 1, List.of(low));

        log.info("テストデータの投入が完了しました");
    }

    private Label saveLabel(String name, String color) {
        Label label = new Label();
        label.setName(name);
        label.setColor(color);
        return labelRepository.save(label);
    }

    private BoardList saveList(Board board, String title, int position) {
        BoardList list = new BoardList();
        list.setBoard(board);
        list.setTitle(title);
        list.setPosition(position);
        return listRepository.save(list);
    }

    private void saveCard(BoardList list, String title, String description,
                          LocalDate dueDate, int position, List<Label> labels) {
        Card card = new Card();
        card.setList(list);
        card.setTitle(title);
        card.setDescription(description);
        card.setDueDate(dueDate);
        card.setPosition(position);
        card.setLabels(labels);
        cardRepository.save(card);
    }
}
