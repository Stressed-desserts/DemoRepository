# Commercial Space Booking System - Database ERD

```mermaid
erDiagram
    USERS {
        bigint id PK
        varchar email UK
        varchar name
        varchar password
        enum role
        varchar image_url
        datetime created_at
    }

    PROPERTIES {
        bigint id PK
        varchar title
        text description
        decimal price
        varchar address
        varchar city
        varchar state
        varchar country
        boolean verified
        varchar photo_url
        enum type
        int area
        double latitude
        double longitude
        bigint owner_id FK
        datetime created_at
    }

    BOOKINGS {
        bigint id PK
        bigint property_id FK
        bigint customer_id FK
        bigint owner_id FK
        date start_date
        date end_date
        varchar status
        text message
        datetime created_at
    }

    REVIEWS {
        bigint id PK
        bigint property_id FK
        bigint user_id FK
        int rating
        text comment
        datetime created_at
    }

    FAVORITES {
        bigint id PK
        bigint user_id FK
        bigint property_id FK
        datetime created_at
    }

    PASSWORD_RESET_TOKENS {
        bigint id PK
        bigint user_id FK
        varchar token UK
        datetime expiry_date
        boolean used
    }

    INQUIRIES {
        bigint id PK
        bigint property_id FK
        bigint user_id FK
        text message
        varchar status
        datetime created_at
    }

    %% Relationships
    USERS ||--o{ PROPERTIES : "owns"
    USERS ||--o{ BOOKINGS : "makes"
    USERS ||--o{ BOOKINGS : "receives"
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ FAVORITES : "creates"
    USERS ||--o{ PASSWORD_RESET_TOKENS : "has"
    USERS ||--o{ INQUIRIES : "sends"

    PROPERTIES ||--o{ BOOKINGS : "has"
    PROPERTIES ||--o{ REVIEWS : "receives"
    PROPERTIES ||--o{ FAVORITES : "is_favorited"
    PROPERTIES ||--o{ INQUIRIES : "receives"

    %% Constraints and Notes
    %% USERS
    %% - email must be unique
    %% - role can be: ADMIN, OWNER, CUSTOMER
    %% - password is hashed using BCrypt

    %% PROPERTIES
    %% - owner_id references USERS.id
    %% - type can be: OFFICE, SHOP, WAREHOUSE, LAND
    %% - verified defaults to false
    %% - price is stored as BigDecimal for precision

    %% BOOKINGS
    %% - status can be: PENDING, ACCEPTED, REJECTED, COMPLETED
    %% - start_date must be <= end_date
    %% - customer_id and owner_id reference USERS.id
    %% - property_id references PROPERTIES.id

    %% REVIEWS
    %% - rating must be between 1-5
    %% - user_id references USERS.id
    %% - property_id references PROPERTIES.id

    %% FAVORITES
    %% - Composite unique constraint on (user_id, property_id)
    %% - Prevents duplicate favorites

    %% PASSWORD_RESET_TOKENS
    %% - token must be unique
    %% - expiry_date must be in the future
    %% - used defaults to false

    %% INQUIRIES
    %% - status can be: PENDING, RESPONDED, CLOSED
    %% - user_id references USERS.id
    %% - property_id references PROPERTIES.id
```

## Database Schema Details:

### Key Features:
1. **User Management**: Multi-role system (Admin, Owner, Customer)
2. **Property Management**: Comprehensive property details with verification system
3. **Booking System**: Complete booking lifecycle with status tracking
4. **Review System**: Rating and comment system for properties
5. **Favorites**: User bookmarking system
6. **Password Reset**: Secure token-based password recovery
7. **Inquiries**: Direct communication between users and property owners

### Security Features:
- **Password Hashing**: BCrypt encryption for user passwords
- **JWT Authentication**: Token-based session management
- **Role-based Access**: Granular permissions based on user roles
- **Input Validation**: Server-side validation for all inputs
- **CORS Configuration**: Secure cross-origin requests

### Data Integrity:
- **Foreign Key Constraints**: Maintain referential integrity
- **Unique Constraints**: Prevent duplicate data
- **Check Constraints**: Ensure data validity (e.g., rating 1-5)
- **Cascade Operations**: Proper cleanup on deletions

### Performance Optimizations:
- **Indexed Fields**: Fast queries on frequently searched fields
- **Lazy Loading**: Efficient loading of related entities
- **Pagination**: Handle large datasets efficiently
- **Caching**: Reduce database load for frequently accessed data
