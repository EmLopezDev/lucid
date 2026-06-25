# Entity Relationship Diagram

```mermaid
erDiagram
    User {
        ObjectId _id PK
        string first_name
        string last_name
        string email UK
        boolean email_verified
        string bio
        date created_at
        date updated_at
        date deleted_at
    }

    Auth {
        ObjectId _id PK
        string user_id FK
        string hash
        string reset_token_hash
        date reset_token_expires
        string email_verification_token_hash
        date email_verification_token_expires
        date created_at
        date updated_at
        date deleted_at
    }

    UserLibrary {
        ObjectId _id PK
        string user_id FK
        string title
        string genre
        string platform
        string status
        boolean favorite
        date date_played
        date date_purchased
        number hours_played
        number rating
        string comment
        string price
        string cover_url
        date created_at
        date updated_at
        date deleted_at
    }

    PlayedWithClub {
        string name
        date end_date
    }

    GamingClub {
        ObjectId _id PK
        string name
        string owner FK
        string avatar_url
        string description
        string visibility
        string invite_code
        array members
        array past_games
        date created_at
        date updated_at
        date deleted_at
    }

    ClubMember {
        string user_id FK
        date joined_at
    }

    CurrentGame {
        string title
        string cover_url
        date start_date
        date end_date
    }

    PastGame {
        string title
        string cover_url
        date end_date
        string game_status
    }

    GamingClubPost {
        ObjectId _id PK
        string club_id FK
        string author FK
        string content
        boolean is_spoiler
        date created_at
        date updated_at
        date deleted_at
    }

    User ||--|| Auth : "has credentials"
    User ||--o{ UserLibrary : "has games"
    UserLibrary ||--o| PlayedWithClub : "played with club"
    User ||--o{ GamingClub : "owns"
    User }o--o{ GamingClub : "member of"
    GamingClub ||--o{ GamingClubPost : "has posts"
    GamingClub ||--o{ ClubMember : "has members"
    GamingClub ||--o| CurrentGame : "currently playing"
    GamingClub ||--o{ PastGame : "has history"
    User ||--o{ GamingClubPost : "authors"
```

> **Note:** A few of these entities (`PlayedWithClub`, `ClubMember`, `CurrentGame`, `PastGame`) aren't their own collections in MongoDB — they live embedded inside their parent documents. They're shown separately here just to keep the diagram readable.
