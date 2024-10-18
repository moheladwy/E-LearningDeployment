package com.online.wrappers;

import com.online.model.Rating;

public class RatingRequest {
  private String jwt;
  private Rating rating;

  public String getJwt() {
    return jwt;
  }

  public void setJwt(String jwt) {
    this.jwt = jwt;
  }

  public Rating getRating() {
    return rating;
  }

  public void setRating(Rating rating) {
    this.rating = rating;
  }
}
