# Quiet Hours

A web app for automatically generating, scheduling, and auto-posting AI-created Instagram Reels and carousels. Built for hands-off content growth with a clean, calm aesthetic.

## Features

- 🤖 **AI Content Generation**: Automatically generates Instagram captions using OpenAI GPT-4
- 📅 **Smart Scheduling**: Schedule posts with customizable frequency (daily, weekly, bi-weekly)
- 📊 **Analytics Dashboard**: Track likes, comments, views, and engagement metrics
- 📝 **Content Series Management**: Organize content into series (POV, Soft Life, Truth Bombs)
- 🔄 **Autopilot Mode**: Runs on full autopilot once configured
- 📋 **Posting Logs**: Track all posting activity and status
- 🎨 **Calm Aesthetic**: Clean, minimal UI with sage and calm color palette

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **AI**: OpenAI GPT-4
- **Styling**: Tailwind CSS
- **Instagram API**: Instagram Graph API

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- OpenAI API key
- Instagram Business Account with API access

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd quiet-hours-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
DATABASE_URL="file:./dev.db"
OPENAI_API_KEY="your_openai_api_key"
INSTAGRAM_ACCESS_TOKEN="your_instagram_access_token"
INSTAGRAM_USER_ID="your_instagram_user_id"
```

4. Initialize the database:
```bash
npm run db:generate
npm run db:push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

### Generate Content

1. Navigate to the "Generate Content" page
2. Select your content series (POV, Soft Life, or Truth Bombs)
3. Choose content type (Reel or Carousel)
4. Specify the number of posts to generate
5. Optionally add a theme
6. Click "Generate Content"

### Schedule Posts

1. Go to the "Schedule Posts" page
2. Select the content series to schedule
3. Choose posting frequency
4. Set the time of day for posting
5. Click "Schedule Posts"

Posts will be automatically published at the scheduled times.

### View Analytics

The dashboard shows:
- Total posts published
- Total likes, comments, and views
- Average engagement rate
- Recent activity logs
- Upcoming scheduled posts

## Project Structure

```
quiet-hours-app/
├── app/
│   ├── api/              # API routes
│   │   ├── analytics/    # Analytics endpoints
│   │   ├── content/      # Content generation
│   │   ├── posts/        # Post logs
│   │   └── schedule/     # Scheduling
│   ├── dashboard/        # Dashboard pages
│   │   ├── analytics/
│   │   ├── generate/
│   │   └── schedule/
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── lib/
│   ├── services/         # Business logic
│   │   ├── ai-generator.ts    # AI content generation
│   │   ├── instagram.ts       # Instagram API integration
│   │   └── scheduler.ts       # Post scheduling
│   ├── prisma.ts         # Prisma client
│   └── utils/            # Utility functions
├── prisma/
│   └── schema.prisma     # Database schema
└── components/           # Reusable components
```

## Database Schema

The app uses the following main models:

- **ContentSeries**: Manages content series (POV, Soft Life, Truth Bombs)
- **Post**: Stores generated content and metadata
- **Analytics**: Tracks performance metrics
- **PostingLog**: Logs all posting activities
- **AppConfig**: Stores app configuration

## API Endpoints

- `POST /api/content` - Generate new content
- `GET /api/content` - Fetch generated posts
- `POST /api/schedule` - Schedule posts for autopilot
- `GET /api/schedule` - Get scheduled posts
- `GET /api/analytics` - Fetch analytics data
- `GET /api/posts/logs` - Get posting logs

## Development

### Running Tests

```bash
npm test
```

### Building for Production

```bash
npm run build
npm start
```

### Database Management

```bash
# Generate Prisma client
npm run db:generate

# Push schema changes
npm run db:push

# Open Prisma Studio
npm run db:studio
```

## Configuration

The app supports configuration through environment variables:

- `DATABASE_URL`: Database connection string
- `OPENAI_API_KEY`: OpenAI API key for content generation
- `INSTAGRAM_ACCESS_TOKEN`: Instagram API access token
- `INSTAGRAM_USER_ID`: Instagram user/page ID

## License

ISC

## Support

For issues and questions, please open an issue on GitHub.
