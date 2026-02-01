-- Insert sample users with image_url
INSERT INTO users (name, email, password, role, image_url) VALUES 
('Admin User', '202301100047@mitaoe.ac.in', '$2a$10$NqKjpX.25l4.zI.C5xaiOORU5jeN2/GbmonMQMMVYyinv24WLNcXW', 'ADMIN', 'https://randomuser.me/api/portraits/men/1.jpg'),
('Owner', 'dummy200612@gmail.com', '$2a$10$NqKjpX.25l4.zI.C5xaiOORU5jeN2/GbmonMQMMVYyinv24WLNcXW', 'OWNER', 'https://randomuser.me/api/portraits/men/2.jpg'),
('Customer', 'rairishabh281@gmail.com', '$2a$10$NqKjpX.25l4.zI.C5xaiOORU5jeN2/GbmonMQMMVYyinv24WLNcXW', 'CUSTOMER', 'https://randomuser.me/api/portraits/women/1.jpg'),
('Mike Johnson', 'mike@example.com', '$2a$10$NqKjpX.25l4.zI.C5xaiOORU5jeN2/GbmonMQMMVYyinv24WLNcXW', 'OWNER', 'https://randomuser.me/api/portraits/men/3.jpg'),
('Sarah Wilson', 'sarah@example.com', '$2a$10$NqKjpX.25l4.zI.C5xaiOORU5jeN2/GbmonMQMMVYyinv24WLNcXW', 'CUSTOMER', 'https://randomuser.me/api/portraits/women/2.jpg');

-- Insert sample properties with photo_url
INSERT INTO properties (title, description, price, address, city, state, country, verified, type, area, owner_id, latitude, longitude, photo_url) VALUES 
('Downtown Office Space', 'Modern office space in the heart of downtown with excellent amenities and parking facilities.', 2500.00, '123 Main St', 'Pune', 'Maharashtra', 'India', true, 'OFFICE', 2500, 2, 18.5204, 73.8567, 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop'),
('Retail Shop in Mall', 'Prime retail space in popular shopping mall with high foot traffic and modern facilities.', 1800.00, 'Mall Road', 'Pune', 'Maharashtra', 'India', true, 'SHOP', 1200, 2, 18.5310, 73.8446, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=250&fit=crop'),
('Warehouse Storage Facility', 'Large warehouse space suitable for storage and distribution with loading docks.', 3500.00, 'Industrial Area 5', 'Mumbai', 'Maharashtra', 'India', true, 'WAREHOUSE', 5000, 4, 19.0760, 72.8777, 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop'),
('Commercial Land Plot', 'Prime commercial land plot ready for development with all necessary permits.', 50000.00, 'Plot 42, Suburban Area', 'Delhi', 'Delhi', 'India', true, 'LAND', 10000, 4, 28.7041, 77.1025, 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=250&fit=crop'),
('Co-working Office Space', 'Flexible co-working space with modern amenities, meeting rooms, and high-speed internet.', 1200.00, 'Tech Hub Ave', 'Bangalore', 'Karnataka', 'India', false, 'OFFICE', 1800, 2, 12.9716, 77.5946, 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=400&h=250&fit=crop'),
('Cold Storage Warehouse', 'Specialized cold storage facility with temperature control systems.', 4200.00, 'Warehouse Lane', 'Ahmedabad', 'Gujarat', 'India', true, 'WAREHOUSE', 8000, 2, 23.0225, 72.5714, 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&h=250&fit=crop');