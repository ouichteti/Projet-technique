package com.nat.todoapp.service.impl;

import com.nat.todoapp.domain.Task;
import com.nat.todoapp.repository.TaskRepository;
import com.nat.todoapp.service.TaskService;
import com.nat.todoapp.service.dto.TaskDTO;
import com.nat.todoapp.service.mapper.TaskMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final TaskMapper taskMapper;

    public TaskServiceImpl(TaskRepository taskRepository, TaskMapper taskMapper) {
        this.taskRepository = taskRepository;
        this.taskMapper = taskMapper;
    }

    @Override
    public List<TaskDTO> findAll() {
        List<Task> tasks = taskRepository.findAll();
        return taskMapper.toDto(tasks);
    }

    @Override
    public List<TaskDTO> findByCompleted(boolean completed) {
        List<Task> tasks = taskRepository.findByCompleted(completed);
        return taskMapper.toDto(tasks);
    }

    @Override
    public Optional<TaskDTO> findById(Long id) {
        return taskRepository.findById(id).map(taskMapper::toDto);
    }

    @Override
    public TaskDTO save(TaskDTO taskDTO) {
        Task task = taskMapper.toEntity(taskDTO);
        task = taskRepository.save(task);
        return taskMapper.toDto(task);
    }

    @Override
    public TaskDTO toggleStatus(Long id) {
        Task task = taskRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Task with id " + id + " not found"));
        task.setCompleted(!task.isCompleted());
        task = taskRepository.save(task);
        return taskMapper.toDto(task);
    }
}
