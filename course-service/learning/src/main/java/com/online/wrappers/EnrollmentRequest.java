package com.online.wrappers;

import com.online.model.Enrollment;

public class EnrollmentRequest {
  private String jwt;
  private Enrollment enrollment;

  public String getJwt() {
    return jwt;
  }

  public void setJwt(String jwt) {
    this.jwt = jwt;
  }

  public Enrollment getEnrollment() {
    return enrollment;
  }

  public void setEnrollment(Enrollment enrollment) {
    this.enrollment = enrollment;
  }
}
