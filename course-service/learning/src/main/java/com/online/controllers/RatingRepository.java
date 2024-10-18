package com.online.controllers;

import java.util.List;

import com.online.model.Rating;

import jakarta.ejb.Stateful;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateful
public class RatingRepository {

  @PersistenceContext(unitName = "AppDB")
  private EntityManager em;

  public Rating makeRating(Rating rating) {
    try {
      Rating obj = new Rating();
      obj.setCourseId(rating.getCourseId());
      obj.setRating(rating.getRating());
      obj.setReview(rating.getReview());
      obj.setStudentId(rating.getStudentId()); // From jwt token
      em.persist(obj);
      return obj;
    } catch (Exception e) {
      return null;
    }
  }

  public int getNumberOfRatings(long courseId) {
    try {
      TypedQuery<Rating> query = em.createQuery("SELECT r FROM Rating r WHERE r.courseId = :courseId", Rating.class);
      query.setParameter("courseId", courseId);
      List<Rating> ratings = query.getResultList();
      return ratings.size();
    } catch (Exception e) {
      return -1;
    }
  }

  public List<Rating> getAllRatings() {
    try {
      TypedQuery<Rating> query = em.createQuery("SELECT r FROM Rating r", Rating.class);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

  public List<Rating> getRatingsByCourseId(long courseId) {
    try {
      TypedQuery<Rating> query = em.createQuery("SELECT r FROM Rating r WHERE r.courseId = :courseId", Rating.class);
      query.setParameter("courseId", courseId);
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

}
