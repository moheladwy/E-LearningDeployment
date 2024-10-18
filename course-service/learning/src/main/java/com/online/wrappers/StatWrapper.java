package com.online.wrappers;

import lombok.Data;

@Data
public class StatWrapper {
  private int accepted;
  private int rejected;
  private int pending;

  public StatWrapper(int accepted, int rejected, int pending) {
    this.accepted = accepted;
    this.rejected = rejected;
    this.pending = pending;
  }

}
