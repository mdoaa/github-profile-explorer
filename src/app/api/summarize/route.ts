import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

type GitHubUser = {
  login: string;
  name: string;
  bio: string | null;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
};

type GitHubRepo = {
  name: string;
  html_url: string;
  language: string | null;
};

async function fetchGitHubProfile(username: string) {
 const userRes = await fetch(`https://api.github.com/users/${username}`, {
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "nextjs-app",
  },
});

  if (!userRes.ok) throw new Error("User not found");
  const user: GitHubUser = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`,{
  headers: {
    Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
    "User-Agent": "nextjs-app",
  },
}
  );
  const repos: GitHubRepo[] = await reposRes.json();

  return { user, repos };
}

export async function POST(req: Request) {
  try {
    const { username } = await req.json();
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const { user, repos } = await fetchGitHubProfile(username);

    const repoSummary = repos
      .map((r) => `${r.name} (${r.language || "Unknown"})`)
      .join(", ");

    const prompt = `
      Summarize this GitHub profile in 2-3 sentences:
      Name: ${user.name || user.login}
      Bio: ${user.bio || "No bio"}
      Followers: ${user.followers}
      Following: ${user.following}
      Public repos: ${user.public_repos}
      Repos: ${repoSummary}
    `;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const result = await model.generateContent(prompt);

    //const result = await model.generateContent("Hi");       // test 

    const summary = result.response.text() || "No summary generated";

    //console.log(summary);

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
