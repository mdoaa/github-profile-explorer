import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
  const userRes = await fetch(`https://api.github.com/users/${username}`);
  if (!userRes.ok) throw new Error("User not found");
  const user: GitHubUser = await userRes.json();

  const reposRes = await fetch(
    `https://api.github.com/users/${username}/repos?per_page=100`
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
    //const prompt = `hi`;
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    //console.log(completion);

    const summary = completion.choices[0].message?.content || "No summary generated";

    return NextResponse.json({ summary });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
