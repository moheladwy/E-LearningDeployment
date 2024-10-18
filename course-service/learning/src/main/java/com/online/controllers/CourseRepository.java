package com.online.controllers;

import java.util.List;

import com.online.model.Course;

import jakarta.ejb.Stateful;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateful
public class CourseRepository {

  @PersistenceContext(unitName = "AppDB")
  private EntityManager em;

  public Course create(Course course) {
    try {
      Course obj = new Course();
      obj.setName(course.getName());
      obj.setDuration(course.getDuration());
      obj.setCapacity(course.getCapacity());
      obj.setCategory(course.getCategory());
      obj.setContent(course.getContent());
      obj.setRating(0.0);
      obj.setStatus("PENDING");
      obj.setInstructorId(course.getInstructorId()); // From jwt token
      obj.setEnrolled(0);
      em.persist(obj);
      return obj;
    } catch (Exception e) {
      return null;
    }
  }

  public Course findCourseById(long id) {
    Course course = em.find(Course.class, id);
    if (course != null) {
      return course;
    }
    return null;
  }

  public String acceptCourse(long id) {
    Course course = em.find(Course.class, id);
    if (course != null) {
      try {
        course.setStatus("ACCEPTED");
        em.merge(course);
        return "Course accepted successfuly!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Course not found!";
  }

  public String rejectCourse(long id) {
    Course course = em.find(Course.class, id);
    if (course != null) {
      try {
        course.setStatus("REJECTED");
        em.merge(course);
        return "Course rejected successfuly!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Course not found!";
  }

  public String removeCourse(long id) {
    Course course = em.find(Course.class, id);
    if (course != null) {
      try {
        em.remove(course);
        return "Course removed successfully!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Course not found!";
  }

  public String updateCourse(long id, Course course) {
    Course obj = em.find(Course.class, id);
    if (obj != null) {
      try {
        obj.setName(course.getName());
        obj.setDuration(course.getDuration());
        obj.setCapacity(course.getCapacity());
        obj.setCategory(course.getCategory());
        obj.setContent(course.getContent());
        em.merge(obj);
        return "Course updated successfuly!";
      } catch (Exception e) {
        return null;
      }
    }
    return "Course not found!";
  }

  public List<Course> fetchAllCourses() {
    try {
      TypedQuery<Course> courses = em.createQuery("SELECT c.id, c.name, c.rating FROM Course c", Course.class);
      return courses.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Course> listAllCourses() {
    try {
      TypedQuery<Course> courses = em.createQuery("SELECT c FROM Course c", Course.class);
      return courses.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Course> listAllValidCourses() {
    try {
      TypedQuery<Course> courses = em.createQuery("SELECT c FROM Course c WHERE c.status = 'ACCEPTED'", Course.class);
      return courses.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Course> findCourses(String searchTerm) {
    try {
      searchTerm = searchTerm.toLowerCase();
      TypedQuery<Course> query = em
          .createQuery(
              "SELECT c FROM Course c WHERE (LOWER(c.name) LIKE :searchTerm OR LOWER(c.category) LIKE :searchTerm) AND c.status = 'ACCEPTED'",
              Course.class);
      query.setParameter("searchTerm", searchTerm);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Course> getCoursesByInstructorId(long id) {
    try {
      TypedQuery<Course> query = em.createQuery("SELECT c FROM Course c WHERE c.instructorId = :id", Course.class);
      query.setParameter("id", id);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public Double getCourseRating(long id) {
    try {
      TypedQuery<Double> query = em.createQuery("SELECT c.rating FROM Course c WHERE c.id = :id",
          Double.class);
      query.setParameter("id", id);
      return query.getSingleResult();
    } catch (Exception e) {
      // e.printStackTrace();
      return -1.0;
    }
  }

  public boolean updateCourseRating(long id, double rating, double numberOfRatings) {
    try {
      Course course = em.find(Course.class, id);
      double avgRating = getCourseRating(course.getId());
      double newRating = (avgRating * (numberOfRatings - 1) + rating) / numberOfRatings;

      if (avgRating == -1) {
        return false;
      }
      if (course != null && course.getStatus().equals("ACCEPTED")) {
        course.setRating(newRating);
        em.merge(course);
        return true;
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }

  public boolean updateEnrolled(long id) {
    try {
      Course course = em.find(Course.class, id);
      if (course != null && course.getEnrolled() < course.getCapacity()) {
        course.setEnrolled(course.getEnrolled() + 1);
        em.merge(course);
        return true;
      }
      return false;
    } catch (Exception e) {
      return false;
    }
  }

  public List<Course> listAllPendingCourses() {
    try {
      TypedQuery<Course> courses = em.createQuery("SELECT c FROM Course c WHERE c.status = 'PENDING'", Course.class);
      return courses.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public int getNumAcceptedCourses() {
    try {
      TypedQuery<Long> query = em.createQuery("SELECT COUNT(c) FROM Course c WHERE c.status = 'ACCEPTED'", Long.class);
      return query.getSingleResult().intValue();
    } catch (Exception e) {
      return -1;
    }
  }

  public int getNumPendingCourses() {
    try {
      TypedQuery<Long> query = em.createQuery("SELECT COUNT(c) FROM Course c WHERE c.status = 'PENDING'", Long.class);
      return query.getSingleResult().intValue();
    } catch (Exception e) {
      return -1;
    }
  }

  public int getNumRejectedCourses() {
    try {
      TypedQuery<Long> query = em.createQuery("SELECT COUNT(c) FROM Course c WHERE c.status = 'REJECTED'", Long.class);
      return query.getSingleResult().intValue();
    } catch (Exception e) {
      return -1;
    }
  }

}
