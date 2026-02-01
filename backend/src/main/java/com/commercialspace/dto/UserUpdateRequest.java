package com.commercialspace.dto;

public class UserUpdateRequest {
    private String name;
    private String password;

    public UserUpdateRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
} 