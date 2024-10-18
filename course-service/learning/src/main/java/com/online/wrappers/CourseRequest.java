package com.online.wrappers;

import com.online.model.Course;

public class CourseRequest {
  private String jwt;
  private Course course;

  public String getJwt() {
    return jwt;
  }

  public void setJwt(String jwt) {
    this.jwt = jwt;
  }

  public Course getCourse() {
    return course;
  }

  public void setCourse(Course course) {
    this.course = course;
  }
}
