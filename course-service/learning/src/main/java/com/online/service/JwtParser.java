package com.online.service;

import java.security.Key;

import org.jose4j.jwt.JwtClaims;
import org.jose4j.jwt.consumer.JwtConsumer;
import org.jose4j.jwt.consumer.JwtConsumerBuilder;
import org.jose4j.keys.HmacKey;

public class JwtParser {

  String secret = "very-very-secret-key";

  public JwtClaims parseClaims(String token) {
    try {
      Key key = new HmacKey("very-very-secret-key".getBytes("UTF-8"));
      JwtConsumer jwtConsumer = new JwtConsumerBuilder()
          .setVerificationKey(key)
          .setRelaxVerificationKeyValidation()
          .build();

      JwtClaims jwtClaims = jwtConsumer.processToClaims(token);
      return jwtClaims;
    } catch (Exception e) {
      return null;
    }
  }
}
