package com.commercialspace.util;

import com.commercialspace.model.Booking;
import com.commercialspace.model.User;
import com.commercialspace.model.Property;
import com.itextpdf.text.Document;
import com.itextpdf.text.DocumentException;
import com.itextpdf.text.Element;
import com.itextpdf.text.Font;
import com.itextpdf.text.PageSize;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.pdf.PdfWriter;
import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;

public class PdfGenerator {
    public static byte[] generateLeaseAgreement(Booking booking) throws DocumentException {
        Document document = new Document(PageSize.A4, 40, 40, 40, 40);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter.getInstance(document, baos);
        document.open();

        Font titleFont = new Font(Font.FontFamily.HELVETICA, 26, Font.BOLD, new com.itextpdf.text.BaseColor(37,99,235)); // blue
        Font subtitleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD, new com.itextpdf.text.BaseColor(14,165,233)); // cyan
        Font sectionFont = new Font(Font.FontFamily.HELVETICA, 15, Font.BOLD, new com.itextpdf.text.BaseColor(99,102,241)); // indigo
        Font labelFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, new com.itextpdf.text.BaseColor(71,85,105)); // slate
        Font normalFont = new Font(Font.FontFamily.HELVETICA, 12, Font.NORMAL, new com.itextpdf.text.BaseColor(51,65,85)); // dark slate

        Paragraph title = new Paragraph("Commercial Space Lease Agreement", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        document.add(title);
        document.add(new Paragraph("\n"));

        Paragraph subtitle = new Paragraph("This is a legal agreement form for your booking on Commercial Space.", subtitleFont);
        subtitle.setAlignment(Element.ALIGN_CENTER);
        document.add(subtitle);
        document.add(new Paragraph("You can meet and discuss further details. For legal advice, contact our legal team.", normalFont));
        document.add(new Paragraph("\n"));

        document.add(new Paragraph("Property Details", sectionFont));
        Property property = booking.getProperty();
        document.add(new Paragraph("Title: " + property.getTitle(), normalFont));
        document.add(new Paragraph("Address: " + property.getAddress() + ", " + property.getCity() + ", " + property.getState() + ", " + property.getCountry(), normalFont));
        document.add(new Paragraph("Price: ₹" + property.getPrice(), normalFont));
        document.add(new Paragraph("Type: " + property.getType(), normalFont));
        document.add(new Paragraph("Area: " + property.getArea() + " sq.ft.", normalFont));
        document.add(new Paragraph("\n"));

        document.add(new Paragraph("Booking Details", sectionFont));
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd MMM yyyy");
        document.add(new Paragraph("Start Date: " + dtf.format(booking.getStartDate()), normalFont));
        document.add(new Paragraph("End Date: " + dtf.format(booking.getEndDate()), normalFont));
        document.add(new Paragraph("\n"));

        document.add(new Paragraph("Customer Details", sectionFont));
        User customer = booking.getCustomer();
        document.add(new Paragraph("Name: " + customer.getName(), normalFont));
        document.add(new Paragraph("Email: " + customer.getEmail(), normalFont));
        document.add(new Paragraph("\n"));

        document.add(new Paragraph("Owner Details", sectionFont));
        User owner = booking.getOwner();
        document.add(new Paragraph("Name: " + owner.getName(), normalFont));
        document.add(new Paragraph("Email: " + owner.getEmail(), normalFont));
        document.add(new Paragraph("\n"));

        Paragraph thanks = new Paragraph("Thank you for using Commercial Space!", subtitleFont);
        thanks.setAlignment(Element.ALIGN_CENTER);
        document.add(thanks);
        document.close();
        return baos.toByteArray();
    }
}
