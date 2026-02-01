package com.commercialspace.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@com.fasterxml.jackson.annotation.JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "properties")
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private String address;
    private String state;
    private String country;
    private String city;


    private boolean verified;

    @Column(name = "photo_url")
    private String photoUrl;
    public String getPhotoUrl() { return photoUrl; }
    public void setPhotoUrl(String photoUrl) { this.photoUrl = photoUrl; }

    @Enumerated(EnumType.STRING)
    private PropertyType type;

    private Integer area; // Area in square feet

    private Double latitude;
    private Double longitude;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id", nullable = false)
    @com.fasterxml.jackson.annotation.JsonBackReference
    private User owner;

    // Constructors
    public Property() {}

    public Property(Long id, String title, String description, BigDecimal price, String address, String state, String country, boolean verified, PropertyType type, Integer area, User owner) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.address = address;
        this.state = state;
        this.country = country;
        this.verified = verified;
        this.type = type;
        this.area = area;
        this.owner = owner;
    }

    // Getters & Setters

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }
    public String getState() { return state; }
    public void setState(String state) { this.state = state; }
    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }
    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public boolean isVerified() { return verified; }
    public void setVerified(boolean verified) { this.verified = verified; }

    public PropertyType getType() { return type; }
    public void setType(PropertyType type) { this.type = type; }

    public Integer getArea() { return area; }
    public void setArea(Integer area) { this.area = area; }

    public Double getLatitude() { return latitude; }
    public void setLatitude(Double latitude) { this.latitude = latitude; }
    public Double getLongitude() { return longitude; }
    public void setLongitude(Double longitude) { this.longitude = longitude; }

    public User getOwner() { return owner; }
    public void setOwner(User owner) { this.owner = owner; }
}
