package com.nat.todoapp.service.impl;

import com.nat.todoapp.domain.Task;
import com.nat.todoapp.repository.TaskRepository;
import com.nat.todoapp.service.dto.TaskDTO;
import com.nat.todoapp.service.mapper.TaskMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TaskServiceImplTest {

    @Mock
    private TaskRepository taskRepository;

    @Mock
    private TaskMapper taskMapper;

    @InjectMocks
    private TaskServiceImpl taskService;

    private Task task;
    private TaskDTO taskDTO;

    @BeforeEach
    void setup() {
        task = new Task();
        task.setId(1L);
        task.setLabel("Test");
        task.setDescription("Description");
        task.setCompleted(false);

        taskDTO = new TaskDTO();
        taskDTO.setId(1L);
        taskDTO.setLabel("Test");
        taskDTO.setDescription("Description");
        taskDTO.setCompleted(false);
    }

    @Test
    void shouldFindAllTasks() {
        when(taskRepository.findAll()).thenReturn(List.of(task));
        when(taskMapper.toDto(List.of(task))).thenReturn(List.of(taskDTO));

        List<TaskDTO> result = taskService.findAll();

        assertThat(result).hasSize(1).containsExactly(taskDTO);
        verify(taskRepository).findAll();
    }

    @Test
    void shouldFindByCompleted() {
        when(taskRepository.findByCompleted(true)).thenReturn(List.of(task));
        when(taskMapper.toDto(List.of(task))).thenReturn(List.of(taskDTO));

        List<TaskDTO> result = taskService.findByCompleted(true);

        assertThat(result).hasSize(1);
        verify(taskRepository).findByCompleted(true);
    }

    @Test
    void shouldFindById() {
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskMapper.toDto(task)).thenReturn(taskDTO);

        Optional<TaskDTO> result = taskService.findById(1L);

        assertThat(result).isPresent().contains(taskDTO);
        verify(taskRepository).findById(1L);
    }

    @Test
    void shouldSaveTask() {
        when(taskMapper.toEntity(taskDTO)).thenReturn(task);
        when(taskRepository.save(task)).thenReturn(task);
        when(taskMapper.toDto(task)).thenReturn(taskDTO);

        TaskDTO result = taskService.save(taskDTO);

        assertThat(result).isEqualTo(taskDTO);
        verify(taskRepository).save(task);
    }

    @Test
    void shouldToggleStatus() {
        Task toggledTask = new Task();
        toggledTask.setId(1L);
        toggledTask.setCompleted(true);

        TaskDTO toggledDTO = new TaskDTO();
        toggledDTO.setId(1L);
        toggledDTO.setCompleted(true);

        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));
        when(taskRepository.save(any(Task.class))).thenReturn(toggledTask);
        when(taskMapper.toDto(toggledTask)).thenReturn(toggledDTO);

        TaskDTO result = taskService.toggleStatus(1L);

        assertThat(result.isCompleted()).isTrue();
        verify(taskRepository).findById(1L);
        verify(taskRepository).save(any(Task.class));
    }

    @Test
    void shouldThrowWhenToggleStatusWithUnknownId() {
        when(taskRepository.findById(99L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> taskService.toggleStatus(99L));

        assertThat(exception.getMessage()).contains("Task with id 99 not found");
        verify(taskRepository).findById(99L);
    }
}
