package com.online.api;

import java.util.List;

import org.jose4j.jwt.JwtClaims;

import com.online.controllers.CourseRepository;
import com.online.controllers.EnrollmentRepository;
import com.online.controllers.NotificationRepository;
import com.online.model.Enrollment;
import com.online.service.JwtParser;
import com.online.wrappers.StatWrapper;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.DELETE;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.HeaderParam;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/enrollment")
@Stateless
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class EnrollmentApi {

  @EJB
  private EnrollmentRepository enrollmentRepo;

  @EJB
  private NotificationRepository notificationRepo;

  @EJB
  private CourseRepository courseRepo;

  JwtParser jwtParser = new JwtParser();

  @DELETE
  @Path("/cancel/{id}")
  public Response cancelEnrollmentRequest(@PathParam("id") long id, @HeaderParam("jwt") String jwt) {

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("student")) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    String response = enrollmentRepo.cancelEnrollment(id, Long.parseLong(claims.getClaimValue("id").toString()));
    if (response != null) {

      return Response.ok(response).build();
    }
    return Response.serverError().build();
  }

  @PUT
  @Path("/accept/{id}")
  public Response acceptEnrollment(@PathParam("id") long id, @HeaderParam("jwt") String jwt) {

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("instructor")) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    String response = enrollmentRepo.acceptEnrollment(id);
    if (response != null) {
      Enrollment enrollment = enrollmentRepo.getEnrollmentById(id);
      notificationRepo.makeNotification(enrollment.getStudentId(),
          "Enrollment accepted for course " + enrollment.getCourseId());
      courseRepo.updateEnrolled(enrollment.getCourseId());

      return Response.ok(response).build();
    }
    return Response.serverError().build();
  }

  @PUT
  @Path("/reject/{id}")
  public Response rejectEnrollment(@PathParam("id") long id, @HeaderParam("jwt") String jwt) {

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("instructor")) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    String response = enrollmentRepo.rejectEnrollment(id);
    if (response != null) {
      Enrollment enrollment = enrollmentRepo.getEnrollmentById(id);
      notificationRepo.makeNotification(enrollment.getStudentId(),
          "Enrollment rejected for course " + enrollment.getCourseId());

      return Response.ok(response).build();
    }
    return Response.serverError().build();
  }

  @GET
  @Path("/{id}")
  public Response getEnrollmentById(@PathParam("id") long id) {
    Enrollment enrollment = enrollmentRepo.getEnrollmentById(id);
    if (enrollment != null) {
      return Response.ok(enrollment).build();
    }
    return Response.serverError().build();
  }

  @GET
  @Path("/student-list")
  public Response getEnrollmentsByStudentId(@HeaderParam("jwt") String jwt) {

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }
    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("student")) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    long studentId = Long.parseLong(claims.getClaimValue("id").toString());

    List<Enrollment> enrollments = enrollmentRepo.getEnrollmentsByStudentId(studentId);
    if (enrollments != null) {
      return Response.ok(enrollments).build();
    }
    return Response.serverError().build();
  }

  @GET
  @Path("/instructor-list")
  public Response getEnrollmentsByInstructorId(@HeaderParam("jwt") String jwt) {

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }
    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("instructor")) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    long instructorId = Long.parseLong(claims.getClaimValue("id").toString());

    List<Enrollment> enrollments = enrollmentRepo.getEnrollmentsByInstructorId(instructorId);
    if (enrollments != null) {
      return Response.ok(enrollments).build();
    }
    return Response.serverError().build();
  }

  @GET
  @Path("/stats")
  public Response getNumAcceptedEnrollments(@HeaderParam("jwt") String jwt) {

    if (jwt == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(jwt);
    if (claims == null) {
      System.out.println("Claims are null");
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }
    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("admin")) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    int numAccepted = enrollmentRepo.getNumAcceptedEnrollments();
    int numRejected = enrollmentRepo.getNumRejectedEnrollments();
    int numPending = enrollmentRepo.getNumPendingEnrollments();

    return Response.ok(new StatWrapper(numAccepted, numRejected, numPending)).build();
  }

}
