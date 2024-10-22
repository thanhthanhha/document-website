

# Q&A Web Application with MDX Support

A modern web application built with Next.js that provides a dynamic Q&A platform with rich text editing capabilities and MDX documentation support.

## Features

- **Rich Text Q&A System**
  - Create questions with formatted text using Draft.js
  - Add replies to questions with rich text support
  - File attachment support with S3 integration
  - Nested comment threading

- **MDX Documentation Support**
  - Automatic page generation from MDX files
  - URL routing based on content structure
  - Powered by fuma-docs for MDX processing

- **Modern UI Components**
  - Expandable question cards
  - Rich text editor with toolbar
  - Responsive design
  - Clean and intuitive interface

## Tech Stack

- Next.js
- React
- TypeScript
- Draft.js
- react-draft-wysiwyg
- AWS S3 (for file storage)
- DynamoDB (for data persistence)
- fuma-docs (for MDX documentation)

## Project Structure

```
├── components/
│   ├── questions/
│   │   ├── QuestionForm.tsx
│   │   ├── QuestionItem.tsx
│   │   └── QuestionList.tsx
│   └── replies/
│       ├── ReplyForm.tsx
│       ├── ReplyItem.tsx
│       └── ReplyList.tsx
├── context/
│   └── QuestionProvider.tsx
├── hooks/
│   ├── useQuestions.ts
│   └── useReply.ts
├── content/
│   └── docs/  # Place your MDX files here
├── utils/
│   ├── dbUtils.ts
│   └── s3Utils.ts
```

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```env
S3_UPLOAD_BUCKET=your-bucket-name
S3_UPLOAD_BUCKET_PREFIX=your-prefix
AWS_REGION=your-aws-region
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
```

4. Configure DynamoDB tables:
- Create tables for questions and replies
- Set up appropriate partition keys and sort keys

## MDX Documentation Setup

1. Create MDX files in the `content/docs` directory:
```markdown
---
title: Your Page Title
description: Page description
---

# Your MDX Content
```

2. The application will automatically generate routes based on the file structure:
- `content/docs/guide.mdx` → `/docs/guide`
- `content/docs/api/reference.mdx` → `/docs/api/reference`

## Usage

1. Start the development server:
```bash
npm run dev
```

2. Access the application at `http://localhost:3000`

### Creating Questions

1. Fill out the question form with:
   - Title
   - Content (using rich text editor)
   - Optional file attachment

2. Submit to create a new question thread

### Adding Replies

1. Click on a question to expand it
2. Use the reply form at the bottom of the question
3. Submit to add your reply to the thread

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.