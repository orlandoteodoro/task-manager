package com.example.taskmanager.service;

import com.example.taskmanager.dto.TaskCreateRequest;
import com.example.taskmanager.dto.TaskStatusUpdateRequest;
import com.example.taskmanager.dto.TaskUpdateRequest;
import com.example.taskmanager.entity.Task;
import com.example.taskmanager.entity.TaskStatus;
import com.example.taskmanager.exception.ResourceNotFoundException;
import com.example.taskmanager.repository.TaskRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class TaskService {

  private final TaskRepository repository;

  public TaskService(TaskRepository repository) {
    this.repository = repository;
  }

  @Transactional
  public Task create(TaskCreateRequest dto) {
    Task task = new Task();
    task.setTitle(dto.title().trim());
    task.setDescription(dto.description());
    task.setDueDate(dto.dueDate());
    task.setPriority(dto.priority());
    task.setStatus(TaskStatus.TODO);
    return repository.save(task);
  }

  @Transactional(readOnly = true)
  public List<Task> findAll(TaskStatus status) {
    return status == null ? repository.findAll() : repository.findByStatus(status);
  }

  @Transactional(readOnly = true)
  public Task findById(UUID id) {
    return repository.findById(id).orElseThrow(() ->
        new ResourceNotFoundException("Task não encontrada: " + id)
    );
  }

  @Transactional
  public Task update(UUID id, TaskUpdateRequest dto) {
    Task task = findById(id);

    if (dto.title() != null) {
      String t = dto.title().trim();
      if (!t.isEmpty()) task.setTitle(t);
    }
    if (dto.description() != null) task.setDescription(dto.description());
    if (dto.status() != null) task.setStatus(dto.status());
    if (dto.priority() != null) task.setPriority(dto.priority());
    if (dto.dueDate() != null) task.setDueDate(dto.dueDate());

    return repository.save(task);
  }

  @Transactional
  public Task updateStatus(UUID id, TaskStatusUpdateRequest dto) {
    Task task = findById(id);
    task.setStatus(dto.status());
    return repository.save(task);
  }

  @Transactional
  public void delete(UUID id) {
    Task task = findById(id);
    repository.delete(task);
  }
}
