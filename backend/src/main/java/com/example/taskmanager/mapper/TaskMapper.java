package com.example.taskmanager.mapper;

import com.example.taskmanager.dto.TaskResponse;
import com.example.taskmanager.entity.Task;

public class TaskMapper {
  private TaskMapper() {}

  public static TaskResponse toResponse(Task t) {
    return new TaskResponse(
        t.getId(),
        t.getTitle(),
        t.getDescription(),
        t.getStatus(),
        t.getPriority(),
        t.getDueDate(),
        t.getCreatedAt()
    );
  }
}
