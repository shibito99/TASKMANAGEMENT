package com.taskmanagement.repository;

import com.taskmanagement.entity.BoardList;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardListRepository extends JpaRepository<BoardList, Long> {
}
