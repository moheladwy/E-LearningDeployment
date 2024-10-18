package com.online.api;

import java.util.List;

import org.jose4j.jwt.JwtClaims;

import com.online.controllers.CourseRepository;
import com.online.controllers.EnrollmentRepository;
import com.online.controllers.RatingRepository;
import com.online.model.Rating;
import com.online.service.JwtParser;
import com.online.wrappers.RatingRequest;

import jakarta.ejb.EJB;
import jakarta.ejb.Stateless;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Stateless
@Path("/rating")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class RatingApi {

  @EJB
  RatingRepository ratingRepo;

  @EJB
  CourseRepository courseRepo;

  @EJB
  EnrollmentRepository enrollmentRepo;

  JwtParser jwtParser = new JwtParser();

  @POST
  @Path("/submit")
  public Response submitCourseRating(RatingRequest request) {

    if (request.getRating() == null || request.getRating().getCourseId() == 0 || request.getRating().getRating() == 0) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Invalid rating").build();
    }

    if (request.getJwt() == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    JwtClaims claims = jwtParser.parseClaims(request.getJwt());
    if (claims == null) {
      return Response.status(Response.Status.UNAUTHORIZED).build();
    }

    if (!claims.getClaimValue("role").toString().equalsIgnoreCase("student")) {
      return Response.status(Response.Status.UNAUTHORIZED).entity("Only students can rate courses").build();
    }

    long studentId = Long.parseLong(claims.getClaimValue("id").toString());

    if (!enrollmentRepo.checkIfEnrolled(request.getRating().getCourseId(), studentId)) {
      return Response.status(Response.Status.BAD_REQUEST).entity("You must be enrolled in the course to rate it")
          .build();
    }

    request.getRating().setStudentId(studentId);

    if (courseRepo.findCourseById(request.getRating().getCourseId()) == null) {
      return Response.status(Response.Status.BAD_REQUEST).entity("Course not found").build();
    }

    Rating result = ratingRepo.makeRating(request.getRating());
    if (result == null) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error submitting course rating").build();
    }

    double numberOfRatings = ratingRepo.getNumberOfRatings(request.getRating().getCourseId());
    boolean updated = courseRepo.updateCourseRating(request.getRating().getCourseId(), request.getRating().getRating(),
        numberOfRatings);
    if (!updated) {
      return Response.status(Response.Status.INTERNAL_SERVER_ERROR).entity("Error submitting course rating").build();
    }
    return Response.ok("Rating submitted!").build();
  }

  @GET
  @Path("/all")
  public Response getAllRatings() {
    List<Rating> ratings = ratingRepo.getAllRatings();
    if (ratings == null) {
      return Response.serverError().build();
    }
    return Response.ok(ratings).build();
  }

  @GET
  @Path("/course/{id}")
  public Response getRatingsByCourseId(@PathParam("id") long id) {
    List<Rating> ratings = ratingRepo.getRatingsByCourseId(id);
    if (ratings == null) {
      return Response.serverError().build();
    }
    return Response.ok(ratings).build();
  }

}
