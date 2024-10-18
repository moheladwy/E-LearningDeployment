package com.online.api;

import java.util.List;

import org.jose4j.jwt.JwtClaims;

import com.online.controllers.NotificationRepository;
import com.online.model.Notification;
import com.online.service.JwtParser;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Stateless
@Path("/notifications")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class NotificationApi {

  @EJB
  NotificationRepository notificationRepo;

  JwtParser jwtParser = new JwtParser();

  @GET
  public Response getNotificationsByStudentId(@HeaderParam("jwt") String jwt){

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    long studentId = Long.parseLong(claims.getClaimValue("id").toString());

    List<Notification> notifications = notificationRepo.getNotificationsByStudentId(studentId);
    if (notifications != null) {
      return Response.ok(notifications).build();
    }
    return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error fetching notifications").build();
  }
}
