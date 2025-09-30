# GitHub Profile Explorer

A Next.js app that lets you compare GitHub users by their repositories, stars, and commit activity over the past month. Also includes an AI-powered summary feature (using Google Gemini API) of a GitHub profile.

---

## 🚀 Features

- Fetch GitHub user data (name, bio, followers, public repos)  
- Fetch repositories and aggregate stars  
- Count commits by day in the last month for each repo, filtered by author  
- Compare two GitHub users side by side  
- API route to generate a short summary via Google Generative AI (Gemini)  
- Handles environment variables (GitHub token, Gemini API key)  
- Responsive UI with Tailwind CSS  

---

## 📦 Tech Stack

- Next.js (App Router)  
- TypeScript  
- Tailwind CSS  
- Google Generative AI (Gemini)  
- GitHub REST API  

---

## 🛠️ Setup & Installation

1. Clone the repo:
   ```bash
   git clone https://github.com/mdoaa/github-profile-explorer.git
   cd github-profile-explorer

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install

3. Create a .env.local file in the root and add:
   ```bash
     GITHUB_TOKEN=your_github_personal_access_token
     GEMINI_API_KEY=your_gemini_api_key
The GitHub token is to avoid rate limit issues.

The Gemini API key is for using Google’s generative model.


4.Run dev server:
 ```bash
   npm run dev
   # or
   yarn dev
