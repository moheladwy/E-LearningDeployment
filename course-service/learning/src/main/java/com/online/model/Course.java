package com.online.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "Course")
public class Course {
  @Id
  @Column
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column
  private String name;

  @Column
  private Integer duration;

  @Column
  private String category;

  @Column
  private Double rating;

  @Column
  private Integer capacity;

  @Column
  private Integer enrolled;

  @Column
  private String content;

  @Column
  private String status;

  @Column
  private Long instructorId;

}
