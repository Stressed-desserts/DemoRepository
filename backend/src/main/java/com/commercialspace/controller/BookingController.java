package com.commercialspace.controller;

import com.commercialspace.model.Booking;
import com.commercialspace.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {
    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<Booking> createBooking(@RequestBody Map<String, Object> body, @AuthenticationPrincipal String email) {
        Long propertyId = Long.valueOf(body.get("propertyId").toString());
        LocalDate startDate = LocalDate.parse(body.get("startDate").toString());
        LocalDate endDate = LocalDate.parse(body.get("endDate").toString());
        String status = body.getOrDefault("status", "PENDING").toString();
        Booking booking = bookingService.createBooking(propertyId, email, startDate, endDate, status);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/accept")
    public ResponseEntity<Booking> acceptBookingPost(@PathVariable Long bookingId, @AuthenticationPrincipal String email) {
        Booking booking = bookingService.acceptBooking(bookingId, email);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{bookingId}/accept")
    public ResponseEntity<Booking> acceptBookingPut(@PathVariable Long bookingId, @AuthenticationPrincipal String email) {
        Booking booking = bookingService.acceptBooking(bookingId, email);
        return ResponseEntity.ok(booking);
    }

    @PostMapping("/{bookingId}/reject")
    public ResponseEntity<Booking> rejectBookingPost(@PathVariable Long bookingId, @AuthenticationPrincipal String email) {
        Booking booking = bookingService.rejectBooking(bookingId, email);
        return ResponseEntity.ok(booking);
    }

    @PutMapping("/{bookingId}/reject")
    public ResponseEntity<Booking> rejectBookingPut(@PathVariable Long bookingId, @AuthenticationPrincipal String email) {
        Booking booking = bookingService.rejectBooking(bookingId, email);
        return ResponseEntity.ok(booking);
    }

    @GetMapping("/me")
    public ResponseEntity<List<Booking>> getMyBookings(@AuthenticationPrincipal String email) {
        List<Booking> bookings = bookingService.getBookingsByCustomer(email);
        return ResponseEntity.ok(bookings);
    }

    @GetMapping("/owner")
    public ResponseEntity<List<Booking>> getOwnerBookings(@AuthenticationPrincipal String email) {
        List<Booking> bookings = bookingService.getBookingsByOwner(email);
        return ResponseEntity.ok(bookings);
    }
} 