package com.online.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

@Data
@Entity
@Table(name = "Enrollment", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "studentId", "courseId" })
})
public class Enrollment {

  @Id
  @Column
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column
  private long studentId;

  @Column
  private long courseId;

  @Column
  @NotEmpty
  private String status;
}
