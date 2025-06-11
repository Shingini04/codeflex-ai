# Fitness AI Assistant - Project Documentation  

## Overview  
This project is a comprehensive AI-powered fitness assistant that generates personalized workout and diet plans based on user input. Built with modern web technologies, it integrates conversational AI, real-time data processing, and secure authentication to deliver a seamless user experience.  

## Technical Stack  

### Core Technologies  
- **Frontend**: Next.js (App Router), React  
- **Styling**: Tailwind CSS, Shadcn UI  
- **Authentication**: Clerk  
- **Database**: Convex (Real-time backend)  
- **AI Integration**: Gemini AI (LLM for plan generation)  

### Key Libraries & Tools  
- **State Management**: React Hooks, Context API  
- **Form Handling**: React Hook Form  
- **API Integration**: Convex HTTP Endpoints  
- **Deployment**: Vercel  

## Features  

### 1. AI-Powered Fitness Planning  
- **Dynamic Plan Generation**: Uses Gemini AI to create structured workout and diet plans based on user-provided details (goals, injuries, dietary restrictions).  
- **Conversational Data Collection**: Guides users through a structured input process to gather necessary fitness metrics.  

### 2. User Authentication & Management  
- **Secure Sign-In**: Supports GitHub, Google, and email/password authentication via Clerk.  
- **Protected Routes**: Middleware ensures only authenticated users can access sensitive pages.  
- **Profile Synchronization**: Webhooks sync user data between Clerk and Convex for real-time updates.  

### 3. Program Management  
- **Multi-Plan Support**: Users can generate and store multiple fitness programs, with only the latest marked as active.  
- **Structured Data Storage**: Convex enforces schema validation for workout and diet plans.  

### 4. Responsive UI  
- **Adaptive Layouts**: Optimized for desktop, tablet, and mobile.  
- **Interactive Components**: Accordions, tabs, and real-time messaging for AI interactions.  

## Project Structure  

```  
├── app/  
│   ├── (auth)/                  # Authentication routes (Clerk)  
│   ├── generate/                # AI plan generation page  
│   ├── profile/                 # User profile & program management  
│   ├── layout.tsx               # Root layout  
│   └── page.tsx                 # Landing page  
├── components/                  # Reusable UI components  
├── convex/                      # Database schema & mutations  
├── lib/                         # Utility functions & constants  
├── public/                      # Static assets  
└── styles/                      # Global CSS  
```  

## Environment Configuration  

```env  
# Clerk Authentication  
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=  
CLERK_SECRET_KEY=  

# Clerk Redirect URLs  
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in  
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up  

# Convex Database  
CONVEX_DEPLOYMENT=  
NEXT_PUBLIC_CONVEX_URL=  

# Gemini AI  
GEMINI_API_KEY=  
```  

## Development Setup  

1. **Clone the repository**  
   ```sh  
   git clone <repository-url>  
   ```  

2. **Install dependencies**  
   ```sh  
   npm install  
   ```  

3. **Configure environment variables**  
   - Create `.env.local` using the template above  
   - Obtain keys from respective services  

4. **Run the development server**  
   ```sh  
   npm run dev  
   ```  

## Deployment  

### Vercel  
1. Connect your GitHub repository to Vercel  
2. Configure environment variables in project settings  
3. Deploy via Vercel CLI or dashboard  

### Build Locally  
```sh  
npm run build  
npm run start  
```  

## Technical Insights  

### AI Integration Strategy  
- **Prompt Engineering**: Carefully constructed prompts ensure Gemini generates structured JSON outputs for workout/diet plans.  
- **Output Validation**: Server-side validation checks AI responses before database insertion.  

### Real-Time Data Flow  
1. User authentication via Clerk triggers webhooks  
2. Convex syncs user data via verified webhook handlers  
3. AI-generated plans are stored with strict schema adherence  

### Performance Considerations  
- **Static Page Optimization**: Landing page uses static generation for fast loads  
- **Dynamic Client-Side Rendering**: Profile and generation pages leverage React state for real-time updates  

## Future Enhancements  
- **Progress Tracking**: Add workout logging and progress analytics  
- **AI Refinements**: Implement iterative plan adjustments based on user feedback  
- **Community Features**: Social sharing of anonymized plan data  

## Troubleshooting  

### Common Issues  
- **Authentication Errors**: Verify Clerk keys and callback URLs  
- **Database Sync Failures**: Check webhook signatures and Convex deployment status  
- **AI Output Issues**: Review prompt structure and validation logic  

For additional support, consult the Convex and Clerk documentation or project issue tracker.  
