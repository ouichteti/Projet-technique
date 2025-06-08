package com.nat.todoapp.web.rest;

import com.nat.todoapp.service.TaskService;
import com.nat.todoapp.service.dto.TaskDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/tasks")
public class TaskResource {

    private final TaskService taskService;

    public TaskResource(TaskService taskService) {
        this.taskService = taskService;
    }

    /**
     * GET /api/tasks?completed=true|false
     */
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getTasks(@RequestParam(required = false) Boolean completed) {
        List<TaskDTO> tasks = (completed != null)
            ? taskService.findByCompleted(completed)
            : taskService.findAll();
        return ResponseEntity.ok(tasks);
    }

    /**
     * GET /api/tasks/by-id?id=1
     */
    @GetMapping("/by-id")
    public ResponseEntity<TaskDTO> getTaskById(@RequestParam Long id) {
        return taskService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    /**
     * POST /api/tasks
     */
    @PostMapping
    public ResponseEntity<TaskDTO> createTask(@RequestBody TaskDTO taskDTO) {
        TaskDTO result = taskService.save(taskDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }




    /**
     * PUT /api/tasks/toggle?id=1
     */
    @PutMapping("/toggle")
    public ResponseEntity<TaskDTO> toggleTaskStatus(@RequestParam Long id) {
        TaskDTO result = taskService.toggleStatus(id);
        return ResponseEntity.ok(result);
    }
}
