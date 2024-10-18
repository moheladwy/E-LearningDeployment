package com.online.controllers;

import java.util.List;

import com.online.model.Enrollment;

import jakarta.ejb.Stateful;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateful
public class EnrollmentRepository {

  @PersistenceContext(unitName = "AppDB")
  private EntityManager em;

  public String makeEnrollment(Enrollment enrollment) {
    try {
      Enrollment obj = new Enrollment();
      obj.setCourseId(enrollment.getCourseId());
      obj.setStudentId(enrollment.getStudentId()); // From jwt token
      obj.setStatus("PENDING");
      em.persist(obj);
      return "Enrollment request sent!";
    } catch (Exception e) {
      return "Enrollment request failed!";
    }
  }

  public String acceptEnrollment(long id) {
    Enrollment enrollment = em.find(Enrollment.class, id);
    if (enrollment != null) {
      try {
        enrollment.setStatus("ACCEPTED");
        em.merge(enrollment);
        return "Enrollment accepted successfuly!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Enrollment not found!";
  }

  public String rejectEnrollment(long id) {
    Enrollment enrollment = em.find(Enrollment.class, id);
    if (enrollment != null) {
      try {
        enrollment.setStatus("REJECTED");
        em.merge(enrollment);
        return "Enrollment rejected successfuly!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Enrollment not found!";
  }

  public Enrollment getEnrollmentById(long id) {
    return em.find(Enrollment.class, id);
  }

  public String deleteEnrollment(long id) {
    Enrollment enrollment = em.find(Enrollment.class, id);
    if (enrollment != null) {
      try {
        em.remove(enrollment);
        return "Enrollment deleted successfuly!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Enrollment not found!";
  }

  public List<Enrollment> getEnrollmentsByStudentId(long studentId) {
    try {
      TypedQuery<Enrollment> query = em
          .createQuery("SELECT e FROM Enrollment e WHERE e.studentId = :studentId", Enrollment.class)
          .setParameter("studentId", studentId);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Enrollment> getEnrollmentsByCourseId(long courseId) {
    try {
      TypedQuery<Enrollment> query = em
          .createQuery("SELECT e FROM Enrollment e WHERE e.courseId = :courseId", Enrollment.class)
          .setParameter("courseId", courseId);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Enrollment> getEnrollmentsByInstructorId(long instructorId) {
    try {
      TypedQuery<Enrollment> query = em
          .createQuery(
              "SELECT e FROM Enrollment e JOIN Course c ON e.courseId = c.id WHERE c.instructorId = :instructorId AND e.status = 'PENDING'",
              Enrollment.class)
          .setParameter("instructorId", instructorId);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public boolean checkIfEnrolled(long courseId, long studentId) {
    try {
      TypedQuery<Enrollment> query = em.createQuery(
          "SELECT e FROM Enrollment e WHERE e.courseId = :courseId AND e.studentId = :studentId AND e.status = 'ACCEPTED'",
          Enrollment.class).setParameter("courseId", courseId).setParameter("studentId", studentId);
      Enrollment obj = query.getSingleResult();
      return obj != null;
    } catch (Exception e) {
      return false;
    }
  }

  public int getNumAcceptedEnrollments() {
    try {
      TypedQuery<Enrollment> query = em.createQuery(
          "SELECT e FROM Enrollment e WHERE e.status = 'ACCEPTED'", Enrollment.class);
      return query.getResultList().size();
    } catch (Exception e) {
      return -1;
    }
  }

  public int getNumPendingEnrollments() {
    try {
      TypedQuery<Enrollment> query = em.createQuery(
          "SELECT e FROM Enrollment e WHERE e.status = 'PENDING'", Enrollment.class);
      return query.getResultList().size();
    } catch (Exception e) {
      return -1;
    }
  }

  public int getNumRejectedEnrollments() {
    try {
      TypedQuery<Enrollment> query = em.createQuery(
          "SELECT e FROM Enrollment e WHERE e.status = 'REJECTED'", Enrollment.class);
      return query.getResultList().size();
    } catch (Exception e) {
      return -1;
    }
  }

  public String cancelEnrollment(long courseId, long studentId) {
    try {
      TypedQuery<Enrollment> query = em.createQuery(
          "SELECT e FROM Enrollment e WHERE e.courseId = :courseId AND e.studentId = :studentId AND e.status = 'PENDING'",
          Enrollment.class).setParameter("courseId", courseId).setParameter("studentId", studentId);
      Enrollment obj = query.getSingleResult();
      if (obj != null) {
        em.remove(obj);
        return "Enrollment cancelled successfuly!";
      }
      return "Enrollment not found!";
    } catch (Exception e) {
      return "Enrollment not found!";
    }
  }

}
