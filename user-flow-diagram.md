# Commercial Space Booking System - User Flow Diagram

```mermaid
flowchart TD
    A[User visits website] --> B{User logged in?}
    B -->|No| C[Show landing page]
    B -->|Yes| D[Show dashboard]
    
    C --> E[User clicks Login/Signup]
    E --> F{Choose action}
    F -->|Login| G[Login form]
    F -->|Signup| H[Signup form]
    
    G --> I[Enter email/password]
    I --> J{Valid credentials?}
    J -->|No| K[Show error message]
    K --> I
    J -->|Yes| L[Redirect to dashboard]
    
    H --> M[Enter user details]
    M --> N[Choose role: Customer/Owner]
    N --> O[Submit registration]
    O --> P{Registration successful?}
    P -->|No| Q[Show error message]
    Q --> M
    P -->|Yes| L
    
    L --> R{User role?}
    R -->|Customer| S[Customer Dashboard]
    R -->|Owner| T[Owner Dashboard]
    R -->|Admin| U[Admin Dashboard]
    
    S --> V[Browse properties]
    V --> W[Apply filters/search]
    W --> X[View property details]
    X --> Y[Check availability]
    Y --> Z[Select dates]
    Z --> AA[Enter booking message]
    AA --> BB[Submit booking request]
    BB --> CC[Show confirmation]
    CC --> DD[Email notifications sent]
    
    T --> EE[View my properties]
    EE --> FF[Add new property]
    FF --> GG[Fill property details]
    GG --> HH[Upload property images]
    HH --> II[Submit for verification]
    II --> JJ[Property pending approval]
    
    T --> KK[View booking requests]
    KK --> LL{Booking status?}
    LL -->|Pending| MM[Review booking details]
    LL -->|Accepted| NN[View accepted bookings]
    LL -->|Rejected| OO[View rejected bookings]
    
    MM --> PP{Accept booking?}
    PP -->|Yes| QQ[Accept booking]
    PP -->|No| RR[Reject booking]
    
    QQ --> SS[Generate lease agreement]
    SS --> TT[Send PDF to both parties]
    TT --> UU[Update booking status]
    
    RR --> VV[Send rejection email]
    VV --> UU
    
    U --> WW[View all properties]
    WW --> XX[Verify properties]
    XX --> YY[Approve/Reject properties]
    YY --> ZZ[Update property status]
    
    U --> AAA[View all bookings]
    AAA --> BBB[Monitor system activity]
    BBB --> CCC[Generate reports]
    
    style A fill:#e3f2fd
    style L fill:#c8e6c9
    style S fill:#fff3e0
    style T fill:#f3e5f5
    style U fill:#ffcdd2
    style QQ fill:#c8e6c9
    style RR fill:#ffcdd2
```

## Key User Flows:

### Customer Flow:
1. **Registration/Login** → Browse Properties → View Details → Book Property
2. **Booking Process**: Select Dates → Add Message → Submit Request → Receive Confirmation
3. **Booking Management**: View My Bookings → Track Status → Receive Updates

### Owner Flow:
1. **Property Management**: Add Properties → Upload Images → Submit for Verification
2. **Booking Management**: Review Requests → Accept/Reject → Generate Agreements
3. **Communication**: Receive Notifications → Send Updates → Handle Inquiries

### Admin Flow:
1. **Property Verification**: Review Submissions → Approve/Reject → Update Status
2. **System Monitoring**: View All Activities → Generate Reports → Manage Users
3. **Content Management**: Monitor Properties → Track Bookings → System Analytics
