package com.nat.todoapp.service;

import com.nat.todoapp.service.dto.TaskDTO;
import java.util.List;
import java.util.Optional;

public interface TaskService {

    List<TaskDTO> findAll();

    List<TaskDTO> findByCompleted(boolean completed);

    Optional<TaskDTO> findById(Long id);

    TaskDTO save(TaskDTO taskDTO);

    TaskDTO toggleStatus(Long id);
}

