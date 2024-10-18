package com.online.mdb;

import jakarta.ejb.MessageDriven;
import jakarta.jms.JMSException;
import jakarta.jms.Message;
import jakarta.jms.MessageListener;
import jakarta.jms.TextMessage;

import java.util.logging.Logger;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.online.controllers.EnrollmentRepository;
import com.online.model.Enrollment;

import jakarta.ejb.ActivationConfigProperty;
import jakarta.ejb.EJB;

@MessageDriven(name = "EnrollmentQueue", activationConfig = {
    @ActivationConfigProperty(propertyName = "destinationLookup", propertyValue = "queue/ENROLLMENTQueue"),
    @ActivationConfigProperty(propertyName = "destinationType", propertyValue = "jakarta.jms.Queue"),
    @ActivationConfigProperty(propertyName = "acknowledgeMode", propertyValue = "Auto-acknowledge") })
public class EnrollmentQueue implements MessageListener {

  private static final Logger LOGGER = Logger.getLogger(EnrollmentQueue.class.toString());

  @EJB
  private EnrollmentRepository repository;

  public void onMessage(Message message) {
    TextMessage msg = null;
    try {
      if (message instanceof TextMessage) {
        msg = (TextMessage) message;
        LOGGER.info("Received Message from queue: " + msg.getText());
        Enrollment enrollment = parseEnrollmentJson(msg.getText());
        String response = repository.makeEnrollment(enrollment);
        LOGGER.info("Response: " + response);
      } else {
        LOGGER.warning("Message of wrong type: " + message.getClass().getName());
      }
    } catch (JMSException e) {
      throw new RuntimeException(e);
    } catch (JsonProcessingException e) {
      throw new RuntimeException(e);
    }
  }

  public static Enrollment parseEnrollmentJson(String jsonString) throws JsonProcessingException {
    ObjectMapper mapper = new ObjectMapper();
    return mapper.readValue(jsonString, Enrollment.class);
  }
}
