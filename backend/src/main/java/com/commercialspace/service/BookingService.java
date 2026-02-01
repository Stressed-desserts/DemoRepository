package com.commercialspace.service;

import com.commercialspace.model.Booking;
import com.commercialspace.model.User;
import com.commercialspace.model.Property;
import com.commercialspace.repository.BookingRepository;
import com.commercialspace.repository.UserRepository;
import com.commercialspace.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import jakarta.mail.internet.MimeMessage;
import org.springframework.mail.javamail.MimeMessageHelper;
import com.commercialspace.util.PdfGenerator;
import java.time.LocalDate;
import java.util.List;

@Service
public class BookingService {
    @Autowired
    private BookingRepository bookingRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private JavaMailSender mailSender;

    public Booking createBooking(Long propertyId, String customerEmail, LocalDate startDate, LocalDate endDate, String status) {
        Property property = propertyRepository.findById(propertyId).orElseThrow();
        User customer = userRepository.findByEmail(customerEmail).orElseThrow();
        User owner = property.getOwner();
        Booking booking = new Booking();
        booking.setProperty(property);
        booking.setCustomer(customer);
        booking.setOwner(owner);
        booking.setStartDate(startDate);
        booking.setEndDate(endDate);
        booking.setStatus(status);
        Booking savedBooking = bookingRepository.save(booking);
        // Beautiful HTML email logic
        try {
            org.slf4j.LoggerFactory.getLogger(BookingService.class).info("Sending booking confirmation email to customer: {} and owner: {}", customer.getEmail(), owner.getEmail());
            MimeMessage customerMsg = mailSender.createMimeMessage();
            MimeMessageHelper customerHelper = new MimeMessageHelper(customerMsg, true);
            customerHelper.setTo(customer.getEmail());
            customerHelper.setSubject("Booking Request Submitted - Commercial Space");
            customerHelper.setText("<div style='font-family:sans-serif;padding:24px;background:#f8fafc;border-radius:8px;'>"
                + "<h2 style='color:#2563eb;'>Booking Request Submitted</h2>"
                + "<p style='font-size:16px;color:#334155;'>Your booking request for property <b>" + property.getTitle() + "</b> has been submitted and is pending owner approval.<br>"
                + "Thank you for choosing Commercial Space!<br><br>"
                + "<span style='color:#0ea5e9;'>For legal advice, contact our legal team.</span></p>"
                + "<hr style='margin:24px 0;border:0;border-top:1px solid #e2e8f0;'>"
                + "<p style='font-size:14px;color:#64748b;'>Commercial Space Team</p></div>", true);
            mailSender.send(customerMsg);

            MimeMessage ownerMsg = mailSender.createMimeMessage();
            MimeMessageHelper ownerHelper = new MimeMessageHelper(ownerMsg, true);
            ownerHelper.setTo(owner.getEmail());
            ownerHelper.setSubject("New Booking Request - Commercial Space");
            ownerHelper.setText("<div style='font-family:sans-serif;padding:24px;background:#f8fafc;border-radius:8px;'>"
                + "<h2 style='color:#2563eb;'>New Booking Request</h2>"
                + "<p style='font-size:16px;color:#334155;'>You have received a new booking request for your property <b>" + property.getTitle() + "</b> from " + customer.getName() + " (" + customer.getEmail() + ").<br>"
                + "Thank you for using Commercial Space!<br><br>"
                + "<span style='color:#0ea5e9;'>For legal advice, contact our legal team.</span></p>"
                + "<hr style='margin:24px 0;border:0;border-top:1px solid #e2e8f0;'>"
                + "<p style='font-size:14px;color:#64748b;'>Commercial Space Team</p></div>", true);
            mailSender.send(ownerMsg);
            org.slf4j.LoggerFactory.getLogger(BookingService.class).info("Booking emails sent successfully.");
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(BookingService.class).error("Error sending booking emails: {}", e.getMessage());
        }
        return savedBooking;
    }

    public Booking acceptBooking(Long bookingId, String ownerEmail) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("Unauthorized: Only the owner can accept this booking.");
        }
        booking.setStatus("ACCEPTED");
        Booking savedBooking = bookingRepository.save(booking);
        // Send lease agreement PDF to both users
        try {
            byte[] pdfBytes = com.commercialspace.util.PdfGenerator.generateLeaseAgreement(savedBooking);
            MimeMessage customerMsg = mailSender.createMimeMessage();
            MimeMessageHelper customerHelper = new MimeMessageHelper(customerMsg, true);
            customerHelper.setTo(savedBooking.getCustomer().getEmail());
            customerHelper.setSubject("Lease Agreement - Commercial Space Booking Accepted");
            customerHelper.setText("<div style='font-family:sans-serif;padding:24px;background:#f8fafc;border-radius:8px;'>"
                + "<h2 style='color:#2563eb;'>Congratulations! Your booking has been accepted.</h2>"
                + "<p style='font-size:16px;color:#334155;'>Please find attached your lease agreement for property <b>" + savedBooking.getProperty().getTitle() + "</b>.<br>"
                + "Thank you for choosing Commercial Space!<br><br>"
                + "<span style='color:#0ea5e9;'>For legal advice, contact our legal team.</span></p>"
                + "<hr style='margin:24px 0;border:0;border-top:1px solid #e2e8f0;'>"
                + "<p style='font-size:14px;color:#64748b;'>Commercial Space Team</p></div>", true);
            customerHelper.addAttachment("LeaseAgreement.pdf", new org.springframework.core.io.ByteArrayResource(pdfBytes));
            mailSender.send(customerMsg);

            MimeMessage ownerMsg = mailSender.createMimeMessage();
            MimeMessageHelper ownerHelper = new MimeMessageHelper(ownerMsg, true);
            ownerHelper.setTo(savedBooking.getOwner().getEmail());
            ownerHelper.setSubject("Lease Agreement - Booking Accepted for Your Property");
            ownerHelper.setText("<div style='font-family:sans-serif;padding:24px;background:#f8fafc;border-radius:8px;'>"
                + "<h2 style='color:#2563eb;'>Your property booking has been accepted.</h2>"
                + "<p style='font-size:16px;color:#334155;'>Please find attached the lease agreement for property <b>" + savedBooking.getProperty().getTitle() + "</b>.<br>"
                + "Thank you for using Commercial Space!<br><br>"
                + "<span style='color:#0ea5e9;'>For legal advice, contact our legal team.</span></p>"
                + "<hr style='margin:24px 0;border:0;border-top:1px solid #e2e8f0;'>"
                + "<p style='font-size:14px;color:#64748b;'>Commercial Space Team</p></div>", true);
            ownerHelper.addAttachment("LeaseAgreement.pdf", new org.springframework.core.io.ByteArrayResource(pdfBytes));
            mailSender.send(ownerMsg);
            org.slf4j.LoggerFactory.getLogger(BookingService.class).info("Lease agreement PDF sent to customer and owner.");
        } catch (Exception e) {
            org.slf4j.LoggerFactory.getLogger(BookingService.class).error("Error sending lease agreement PDF: {}", e.getMessage());
        }
        return savedBooking;
    }

    public Booking rejectBooking(Long bookingId, String ownerEmail) {
        Booking booking = bookingRepository.findById(bookingId).orElseThrow();
        if (!booking.getOwner().getEmail().equals(ownerEmail)) {
            throw new RuntimeException("Unauthorized: Only the owner can reject this booking.");
        }
        booking.setStatus("REJECTED");
        return bookingRepository.save(booking);
    }

    public List<Booking> getBookingsByCustomer(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail).orElseThrow();
        return bookingRepository.findByCustomer(customer);
    }

    public List<Booking> getBookingsByOwner(String ownerEmail) {
        User owner = userRepository.findByEmail(ownerEmail).orElseThrow();
        return bookingRepository.findByOwner(owner);
    }
}