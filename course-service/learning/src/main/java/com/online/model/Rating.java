package com.online.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Entity
@Table(name = "Rating", uniqueConstraints = {
    @UniqueConstraint(columnNames = { "studentId", "courseId" })
})
public class Rating {

  @Id
  @Column
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Column
  private long studentId;

  @Column
  private long courseId;

  @Column
  @NotNull
  private Double rating;

  @Column
  private String review;
}
