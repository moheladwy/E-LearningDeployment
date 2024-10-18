package com.online.controllers;

import java.util.List;

import com.online.model.Notification;

import jakarta.ejb.Stateful;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;

@Stateful
public class NotificationRepository {
  @PersistenceContext(unitName = "AppDB")
  private EntityManager em;

  public Notification makeNotification(long studentId, String content) {
    try {
      Notification obj = new Notification();
      obj.setStudentId(studentId);
      obj.setContent(content);
      em.persist(obj);
      return obj;
    } catch (Exception e) {
      return null;
    }
  }

  public List<Notification> getNotificationsByStudentId(long studentId) {
    try {
      TypedQuery<Notification> query = em.createQuery("SELECT n FROM Notification n WHERE n.studentId = :studentId",
          Notification.class);
      query.setParameter("studentId", studentId); 
      return query.getResultList();
    } catch (Exception e) {
      return null;
    }
  }

}
