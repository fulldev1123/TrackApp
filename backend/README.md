# Symfony Backend API

A REST API for managing music tracks built with Symfony 6+ and Doctrine ORM.

## 🚀 Quick Start

### Prerequisites

- PHP 8.1+
- MySQL/MariaDB
- Composer

### Installation

1. **Install dependencies:**

   ```bash
   composer install
   ```

2. **Configure database:**

   - Copy `.env` to `.env.local`
   - Update `DATABASE_URL` in `.env.local` with your database credentials:
     ```
     DATABASE_URL="mysql://username:password@127.0.0.1:3306/track_app?serverVersion=8.0&charset=utf8mb4"
     ```

3. **Set up database:**

   ```bash
   php bin/console doctrine:database:create --if-not-exists
   php bin/console doctrine:migrations:sync-metadata-storage
   php bin/console doctrine:migrations:migrate --no-interaction
   ```

4. **Start the server:**

   ```bash
   symfony serve
   ```

The API will be available at `http://localhost:8000`

## 📋 API Endpoints

### Tracks Management

| Method | Endpoint           | Description           | Request Body         |
| ------ | ------------------ | --------------------- | -------------------- |
| `GET`  | `/api/tracks`      | List all tracks       | -                    |
| `POST` | `/api/tracks`      | Create a new track    | JSON with track data |
| `PUT`  | `/api/tracks/{id}` | Update existing track | JSON with track data |

### Track Data Structure

```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "duration": 180,
  "isrc": "US-ABC-12-34567"
}
```

### Field Validation

- **title**: Required, string
- **artist**: Required, string
- **duration**: Required, positive integer (seconds)
- **isrc**: Optional, must match format `XX-XXX-XX-XXXXX` (e.g., `US-ABC-12-34567`)

### Response Examples

**Success Response:**

```json
{
  "id": 1,
  "title": "Bohemian Rhapsody",
  "artist": "Queen",
  "duration": 355,
  "isrc": "GB-EMI-74-12345"
}
```

**Error Response:**

```json
{
  "error": "Title is required, Duration must be a positive number"
}
```

## 🏗️ Architecture

### Key Components

- **Entity**: `Track` - Doctrine entity with validation constraints
- **Controller**: `TrackController` - Handles HTTP requests and responses
- **Service**: `TrackService` - Business logic for track operations
- **Repository**: `TrackRepository` - Database queries

### Features Implemented

- ✅ REST API with JSON responses
- ✅ Form validation with Symfony Validator
- ✅ CORS support for frontend integration
- ✅ Service layer for business logic
- ✅ Clean error message handling
- ✅ Doctrine ORM with migrations
