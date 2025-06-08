package com.nat.todoapp.service.mapper;

import com.nat.todoapp.domain.Task;
import com.nat.todoapp.service.dto.TaskDTO;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDTO toDto(Task task);
    Task toEntity(TaskDTO taskDTO);
    List<TaskDTO> toDto(List<Task> tasks);
    List<Task> toEntity(List<TaskDTO> taskDTOs);
}
