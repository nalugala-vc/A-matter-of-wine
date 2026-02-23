# Ethnovino Backend Requirements

A comprehensive guide for building the Ethnovino backend using FastAPI, MongoDB, FastAPI Users, and Resend.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Dependencies](#dependencies)
5. [Configuration](#configuration)
6. [Database Models](#database-models)
7. [Authentication](#authentication)
8. [API Endpoints](#api-endpoints)
9. [Services](#services)
10. [Environment Variables](#environment-variables)
11. [Deployment](#deployment)

---

## Overview

Ethnovino is a wine community platform with the following core features:

| Feature | Description |
|---------|-------------|
| **Personal Wine Cellar** | Users can log, rate, and organize wines into categories (Tried, Wishlist, Favorite) |
| **Events & Meetups** | Create, discover, and RSVP to wine tastings and vineyard tours |
| **AI Sommelier** | AI-powered wine recommendations and pairing suggestions |
| **Stories** | Wine articles, winemaker interviews, and travel journals |
| **Community** | Social features for sharing wine moments (future) |

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| **Framework** | FastAPI | High-performance async Python web framework |
| **Database** | MongoDB Atlas | NoSQL database for flexible data storage |
| **ODM** | Beanie | Async MongoDB ODM with Pydantic integration |
| **Authentication** | FastAPI Users | Complete auth system with OAuth support |
| **Email** | Resend | Transactional email service |
| **AI** | OpenAI API | AI Sommelier chat functionality |
| **File Storage** | Cloudinary | Image upload and management |
| **Hosting** | Railway / Render | Platform-as-a-Service deployment |

---

## Project Structure

```
ethnovino-backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI app entry point
│   ├── config.py               # Settings and environment variables
│   ├── database.py             # MongoDB connection setup
│   │
│   ├── auth/
│   │   ├── __init__.py         # FastAPI Users configuration
│   │   ├── users.py            # User model and database
│   │   ├── schemas.py          # User Pydantic schemas
│   │   ├── manager.py          # User manager with email hooks
│   │   └── google.py           # Google OAuth setup
│   │
│   ├── models/
│   │   ├── __init__.py
│   │   ├── wine.py             # Wine document model
│   │   ├── event.py            # Event document model
│   │   ├── conversation.py     # AI conversation model
│   │   └── story.py            # Story/article model
│   │
│   ├── schemas/
│   │   ├── __init__.py
│   │   ├── wine.py             # Wine request/response schemas
│   │   ├── event.py            # Event schemas
│   │   ├── conversation.py     # Conversation schemas
│   │   └── story.py            # Story schemas
│   │
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── wines.py            # Wine CRUD endpoints
│   │   ├── events.py           # Event endpoints
│   │   ├── sommelier.py        # AI chat endpoints
│   │   ├── stories.py          # Story endpoints
│   │   └── newsletter.py       # Newsletter subscription
│   │
│   ├── services/
│   │   ├── __init__.py
│   │   ├── email.py            # Resend email service
│   │   ├── ai.py               # OpenAI integration
│   │   └── storage.py          # Cloudinary file uploads
│   │
│   └── utils/
│       ├── __init__.py
│       └── dependencies.py     # Common FastAPI dependencies
│
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── test_wines.py
│   ├── test_events.py
│   └── test_auth.py
│
├── requirements.txt
├── pyproject.toml
├── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

---

## Dependencies

### requirements.txt

```txt
# Core
fastapi>=0.109.0
uvicorn[standard]>=0.27.0
pydantic>=2.5.0
pydantic-settings>=2.1.0

# Database
motor>=3.3.0
beanie>=1.24.0

# Authentication
fastapi-users[beanie]>=13.0.0
httpx-oauth>=0.13.0

# Email
resend>=0.7.0

# AI
openai>=1.10.0

# File uploads
cloudinary>=1.38.0
python-multipart>=0.0.6

# Utils
python-dotenv>=1.0.0

# Testing
pytest>=7.4.0
pytest-asyncio>=0.21.0
httpx>=0.25.0
```

---

## Configuration

### app/config.py

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # Application
    app_name: str = "Ethnovino API"
    debug: bool = False
    api_version: str = "v1"
    
    # MongoDB
    mongodb_uri: str
    database_name: str = "ethnovino"
    
    # Authentication
    jwt_secret: str
    jwt_lifetime_seconds: int = 604800  # 7 days
    
    # Google OAuth
    google_client_id: str
    google_client_secret: str
    
    # Resend
    resend_api_key: str
    email_from_address: str = "Ethnovino <noreply@ethnovino.com>"
    
    # OpenAI
    openai_api_key: str
    openai_model: str = "gpt-4-turbo-preview"
    
    # Cloudinary
    cloudinary_cloud_name: str
    cloudinary_api_key: str
    cloudinary_api_secret: str
    
    # Frontend URL (for email links and CORS)
    frontend_url: str = "http://localhost:5173"
    
    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"

settings = Settings()
```

---

## Database Models

### User Model (app/auth/users.py)

```python
from beanie import Document, PydanticObjectId
from fastapi_users.db import BeanieBaseUser
from pydantic import Field
from typing import Optional
from datetime import datetime

class User(BeanieBaseUser, Document):
    username: str
    avatar_url: Optional[str] = None
    cover_image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "users"
```

### Wine Model (app/models/wine.py)

```python
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field
from typing import Literal, Optional
from datetime import datetime

class Wine(Document):
    user_id: Indexed(PydanticObjectId)
    name: str
    year: int
    region: str
    rating: int = Field(ge=1, le=5)
    tasting_notes: str
    pairing_details: str
    category: Literal["tried", "wishlist", "favorite"]
    image_url: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "wines"
        indexes = [
            [("user_id", 1), ("category", 1)],
        ]
```

### Event Model (app/models/event.py)

```python
from beanie import Document, Indexed, PydanticObjectId
from pydantic import BaseModel, Field
from typing import Optional, Union, List, Literal
from datetime import datetime, date

class Attendee(BaseModel):
    user_id: PydanticObjectId
    status: Literal["interested", "going", "maybe"]
    joined_at: datetime = Field(default_factory=datetime.utcnow)

class Event(Document):
    title: Indexed(str)
    description: str
    location: str
    date: date
    start_time: str
    end_time: str
    price: Union[float, Literal["Free"]]
    image_url: Optional[str] = None
    is_featured: bool = False
    category: Optional[str] = None
    organizer_id: PydanticObjectId
    max_attendees: Optional[int] = None
    attendees: List[Attendee] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "events"
        indexes = [
            [("date", 1)],
            [("is_featured", 1)],
        ]
```

### Conversation Model (app/models/conversation.py)

```python
from beanie import Document, PydanticObjectId
from pydantic import BaseModel, Field
from typing import List, Literal, Optional
from datetime import datetime

class Message(BaseModel):
    id: PydanticObjectId = Field(default_factory=PydanticObjectId)
    content: str
    sender: Literal["user", "ai"]
    created_at: datetime = Field(default_factory=datetime.utcnow)

class Conversation(Document):
    user_id: PydanticObjectId
    title: Optional[str] = None
    messages: List[Message] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "conversations"
```

### Story Model (app/models/story.py)

```python
from beanie import Document, Indexed, PydanticObjectId
from pydantic import Field
from typing import Optional
from datetime import datetime

class Story(Document):
    title: Indexed(str)
    description: str
    content: str  # Full article content (markdown)
    image_url: str
    author_id: PydanticObjectId
    author_name: str
    read_time_minutes: int
    is_published: bool = False
    published_at: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    class Settings:
        name = "stories"
        indexes = [
            [("is_published", 1), ("published_at", -1)],
        ]
```

---

## Authentication

### FastAPI Users Setup (app/auth/__init__.py)

```python
from fastapi import Depends
from fastapi_users import FastAPIUsers
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
)
from fastapi_users.db import BeanieUserDatabase
from httpx_oauth.clients.google import GoogleOAuth2
from beanie import PydanticObjectId

from app.config import settings
from app.auth.users import User
from app.auth.manager import get_user_manager

# Google OAuth client
google_oauth_client = GoogleOAuth2(
    settings.google_client_id,
    settings.google_client_secret,
)

# JWT Strategy
def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(
        secret=settings.jwt_secret,
        lifetime_seconds=settings.jwt_lifetime_seconds,
    )

# Bearer transport (Authorization header)
bearer_transport = BearerTransport(tokenUrl="auth/jwt/login")

# Authentication backend
auth_backend = AuthenticationBackend(
    name="jwt",
    transport=bearer_transport,
    get_strategy=get_jwt_strategy,
)

# User database dependency
async def get_user_db():
    yield BeanieUserDatabase(User)

# FastAPI Users instance
fastapi_users = FastAPIUsers[User, PydanticObjectId](
    get_user_manager,
    [auth_backend],
)

# Current user dependencies
current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
```

### User Manager with Email Hooks (app/auth/manager.py)

```python
from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, UUIDIDMixin
from beanie import PydanticObjectId

from app.auth.users import User
from app.auth import get_user_db
from app.services.email import send_verification_email, send_password_reset_email
from app.config import settings

class UserManager(BaseUserManager[User, PydanticObjectId]):
    reset_password_token_secret = settings.jwt_secret
    verification_token_secret = settings.jwt_secret

    async def on_after_register(
        self, user: User, request: Optional[Request] = None
    ):
        print(f"User {user.id} has registered.")

    async def on_after_forgot_password(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        await send_password_reset_email(user.email, token)

    async def on_after_request_verify(
        self, user: User, token: str, request: Optional[Request] = None
    ):
        await send_verification_email(user.email, token)

async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
```

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/jwt/login` | Login with email/password |
| POST | `/auth/jwt/logout` | Logout (invalidate token) |
| POST | `/auth/register` | Register new user |
| POST | `/auth/forgot-password` | Request password reset |
| POST | `/auth/reset-password` | Reset password with token |
| POST | `/auth/request-verify-token` | Request email verification |
| POST | `/auth/verify` | Verify email with token |
| GET | `/auth/google/authorize` | Initiate Google OAuth |
| GET | `/auth/google/callback` | Google OAuth callback |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/users/me` | Get current user profile |
| PATCH | `/users/me` | Update current user profile |
| GET | `/users/{id}` | Get user by ID (admin) |
| PATCH | `/users/{id}` | Update user by ID (admin) |
| DELETE | `/users/{id}` | Delete user (admin) |

### Wine Cellar Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/wines` | List user's wines (filterable by category) |
| GET | `/wines/{id}` | Get wine details |
| POST | `/wines` | Add wine to cellar |
| PUT | `/wines/{id}` | Update wine |
| DELETE | `/wines/{id}` | Delete wine |
| POST | `/wines/{id}/image` | Upload wine image |

### Event Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/events` | List events (with search/filters) |
| GET | `/events/{id}` | Get event details |
| POST | `/events` | Create event (organizers) |
| PUT | `/events/{id}` | Update event |
| DELETE | `/events/{id}` | Delete event |
| POST | `/events/{id}/rsvp` | RSVP to event |
| DELETE | `/events/{id}/rsvp` | Cancel RSVP |
| GET | `/events/{id}/attendees` | List attendees |

### AI Sommelier Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sommelier/conversations` | List user's conversations |
| POST | `/sommelier/conversations` | Start new conversation |
| GET | `/sommelier/conversations/{id}` | Get conversation with messages |
| POST | `/sommelier/conversations/{id}/messages` | Send message, get AI response |
| DELETE | `/sommelier/conversations/{id}` | Delete conversation |

### Story Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/stories` | List published stories |
| GET | `/stories/{id}` | Get story details |
| POST | `/stories` | Create story (admin/writers) |
| PUT | `/stories/{id}` | Update story |
| DELETE | `/stories/{id}` | Delete story |

### Newsletter Endpoint

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/newsletter/subscribe` | Subscribe email to newsletter |

---

## Services

### Email Service (app/services/email.py)

```python
import resend
from app.config import settings

resend.api_key = settings.resend_api_key

async def send_verification_email(email: str, token: str):
    """Send email verification link."""
    verify_url = f"{settings.frontend_url}/verify-email?token={token}"
    
    resend.Emails.send({
        "from": settings.email_from_address,
        "to": email,
        "subject": "Verify your Ethnovino account",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #722F37;">Welcome to Ethnovino!</h1>
                <p>Thank you for joining our wine community.</p>
                <p>Click the button below to verify your email address:</p>
                <a href="{verify_url}" 
                   style="display: inline-block; background: #722F37; color: white; 
                          padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    Verify Email
                </a>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    If you didn't create an account, you can safely ignore this email.
                </p>
            </div>
        """,
    })

async def send_password_reset_email(email: str, token: str):
    """Send password reset link."""
    reset_url = f"{settings.frontend_url}/reset-password?token={token}"
    
    resend.Emails.send({
        "from": settings.email_from_address,
        "to": email,
        "subject": "Reset your Ethnovino password",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #722F37;">Password Reset</h1>
                <p>You requested to reset your password.</p>
                <p>Click the button below to set a new password:</p>
                <a href="{reset_url}" 
                   style="display: inline-block; background: #722F37; color: white; 
                          padding: 12px 24px; text-decoration: none; border-radius: 4px;">
                    Reset Password
                </a>
                <p style="margin-top: 20px; color: #666; font-size: 14px;">
                    If you didn't request this, you can safely ignore this email.
                </p>
            </div>
        """,
    })

async def send_event_reminder(email: str, event_title: str, event_date: str, event_location: str):
    """Send event reminder email."""
    resend.Emails.send({
        "from": "Ethnovino Events <events@ethnovino.com>",
        "to": email,
        "subject": f"Reminder: {event_title} is tomorrow!",
        "html": f"""
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #722F37;">Event Reminder</h1>
                <h2>{event_title}</h2>
                <p><strong>Date:</strong> {event_date}</p>
                <p><strong>Location:</strong> {event_location}</p>
                <p>We look forward to seeing you there!</p>
            </div>
        """,
    })
```

### AI Service (app/services/ai.py)

```python
from openai import AsyncOpenAI
from typing import List, Optional
from app.config import settings
from app.models.wine import Wine

client = AsyncOpenAI(api_key=settings.openai_api_key)

SYSTEM_PROMPT = """You are an expert AI sommelier for Ethnovino, a wine community platform.
You help users discover wines, suggest pairings, and answer wine-related questions.

Guidelines:
- Be knowledgeable, friendly, and passionate about wine
- Provide specific wine recommendations when possible
- Consider the user's taste preferences and past wines
- Suggest food pairings when relevant
- Explain wine terminology in accessible terms
- If unsure, be honest and suggest consulting a local sommelier

When the user shares their favorite wines, use that information to personalize recommendations."""

async def get_sommelier_response(
    user_message: str,
    conversation_history: List[dict],
    user_wines: Optional[List[Wine]] = None,
) -> str:
    """Generate AI sommelier response."""
    
    # Build context from user's wine preferences
    context = ""
    if user_wines:
        favorites = [w for w in user_wines if w.category == "favorite"]
        if favorites:
            wine_list = "\n".join(
                f"- {w.name} ({w.year}) from {w.region}, rated {w.rating}/5"
                for w in favorites[:5]
            )
            context = f"\n\nUser's favorite wines:\n{wine_list}"
    
    messages = [
        {"role": "system", "content": SYSTEM_PROMPT + context},
        *conversation_history,
        {"role": "user", "content": user_message},
    ]
    
    response = await client.chat.completions.create(
        model=settings.openai_model,
        messages=messages,
        temperature=0.7,
        max_tokens=1000,
    )
    
    return response.choices[0].message.content
```

### Storage Service (app/services/storage.py)

```python
import cloudinary
import cloudinary.uploader
from fastapi import UploadFile
from app.config import settings

cloudinary.config(
    cloud_name=settings.cloudinary_cloud_name,
    api_key=settings.cloudinary_api_key,
    api_secret=settings.cloudinary_api_secret,
)

async def upload_image(file: UploadFile, folder: str = "wines") -> str:
    """Upload image to Cloudinary and return URL."""
    
    contents = await file.read()
    
    result = cloudinary.uploader.upload(
        contents,
        folder=f"ethnovino/{folder}",
        resource_type="image",
        transformation=[
            {"width": 800, "height": 800, "crop": "limit"},
            {"quality": "auto:good"},
            {"fetch_format": "auto"},
        ],
    )
    
    return result["secure_url"]

async def delete_image(public_id: str) -> bool:
    """Delete image from Cloudinary."""
    result = cloudinary.uploader.destroy(public_id)
    return result.get("result") == "ok"
```

---

## Environment Variables

### .env.example

```env
# Application
DEBUG=false
API_VERSION=v1

# MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DATABASE_NAME=ethnovino

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_LIFETIME_SECONDS=604800

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Resend
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx
EMAIL_FROM_ADDRESS=Ethnovino <noreply@ethnovino.com>

# OpenAI
OPENAI_API_KEY=sk-xxxxxxxxxxxxxxxxxxxx
OPENAI_MODEL=gpt-4-turbo-preview

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## Deployment

### Docker Setup

#### Dockerfile

```dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application
COPY app/ ./app/

# Run with uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### docker-compose.yml (for local development)

```yaml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "8000:8000"
    env_file:
      - .env
    volumes:
      - ./app:/app/app
    command: uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Running Locally

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment variables
cp .env.example .env
# Edit .env with your values

# Run development server
uvicorn app.main:app --reload
```

### Production Deployment (Railway/Render)

1. Connect your GitHub repository
2. Set environment variables in the dashboard
3. Deploy automatically on push to main

**Railway:**
```bash
# railway.json
{
  "build": {
    "builder": "DOCKERFILE"
  },
  "deploy": {
    "startCommand": "uvicorn app.main:app --host 0.0.0.0 --port $PORT"
  }
}
```

---

## Next Steps

1. **Set up MongoDB Atlas** - Create a free cluster
2. **Configure Google OAuth** - Set up in Google Cloud Console
3. **Create Resend account** - Get API key and verify domain
4. **Set up Cloudinary** - For image uploads
5. **Get OpenAI API key** - For AI Sommelier
6. **Initialize the project** - Create the folder structure
7. **Implement core features** - Start with auth, then wines
8. **Add tests** - Use pytest with pytest-asyncio
9. **Deploy** - Railway or Render for easy deployment

---

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [FastAPI Users Documentation](https://fastapi-users.github.io/fastapi-users/)
- [Beanie ODM Documentation](https://beanie-odm.dev/)
- [MongoDB Atlas](https://www.mongodb.com/atlas)
- [Resend Documentation](https://resend.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Cloudinary Documentation](https://cloudinary.com/documentation)
