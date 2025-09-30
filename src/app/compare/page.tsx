import React from "react";
import CompareForm from "@/components/CompareForm";

interface Params {
  searchParams: {
    u1?: string;
    u2?: string;
  };
}

interface UserStats {
  name: string;
  repoCount: number;
  totalStars: number;
  commitFreq: {
    totalCommits: number;
    activeDays: number;
    avgPerActiveDay: number;
  };
}

async function fetchCommitsLastMonth(username: string, repos: any[]) {
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

  let totalCommits = 0;
  const commitsByDay: Record<string, number> = {};

  for (const repo of repos) {
    if (repo.fork) continue;

    let page = 1;
    while (true) {
      const commitsRes = await fetch(
        `https://api.github.com/repos/${repo.owner.login}/${repo.name}/commits?since=${oneMonthAgo.toISOString()}&author=${username}&per_page=100&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "User-Agent": "nextjs-app",
          },
          next: { revalidate: 60 },
        }
      );

      if (!commitsRes.ok) break;

      const commits = await commitsRes.json();
      if (commits.length === 0) break;

      commits.forEach((c: any) => {
        const day = c.commit.author.date.split("T")[0];
        commitsByDay[day] = (commitsByDay[day] || 0) + 1;
        totalCommits++;
      });

      if (commits.length < 100) break; // no more pages
      page++;
    }
  }

  const activeDays = Object.keys(commitsByDay).length;
  const avgPerActiveDay = activeDays > 0 ? totalCommits / activeDays : 0;

  return { totalCommits, activeDays, avgPerActiveDay };
}

async function fetchUserStats(username: string): Promise<UserStats | null> {
  try {
    const userRes = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "nextjs-app",
      },
      next: { revalidate: 60 },
    });
    if (!userRes.ok) return null;
    const userData = await userRes.json();

    const reposRes = await fetch(userData.repos_url, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "nextjs-app",
      },
      next: { revalidate: 60 },
    });
    if (!reposRes.ok) return null;
    const repos = await reposRes.json();

    const repoCount = repos.length;
    const totalStars = repos.reduce(
      (sum: number, r: any) => sum + r.stargazers_count,
      0
    );

    const commitFreq = await fetchCommitsLastMonth(username, repos);

    return {
      name: userData.login,
      repoCount,
      totalStars,
      commitFreq,
    };
  } catch (err) {
    console.error("fetchUserStats error:", err);
    return null;
  }
}

export default async function ComparePage({ searchParams }: Params) {
  const u1 = searchParams.u1?.trim();
  const u2 = searchParams.u2?.trim();

  const [user1, user2] =
    u1 && u2
      ? await Promise.all([fetchUserStats(u1), fetchUserStats(u2)])
      : [null, null];

  console.log("user1:", user1);
  console.log("user2:", user2);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">GitHub Compare</h1>

      <CompareForm initU1={u1 || ""} initU2={u2 || ""} />

      <div className="mt-8">
        {!u1 || !u2 ? (
          <p className="text-gray-500">Enter two usernames to compare.</p>
        ) : !user1 || !user2 ? (
          <p className="text-red-500">❌ Failed to fetch user data.</p>
        ) : (
          <table className="table-auto border-collapse border border-gray-400 w-full text-center">
            <thead>
              <tr className="bg-gray-500 text-white">
                <th className="border px-4 py-2">Metric</th>
                <th className="border px-4 py-2">{user1.name}</th>
                <th className="border px-4 py-2">{user2.name}</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border px-4 py-2">Repositories</td>
                <td className="border px-4 py-2">{user1.repoCount}</td>
                <td className="border px-4 py-2">{user2.repoCount}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Total Stars ⭐</td>
                <td className="border px-4 py-2">{user1.totalStars}</td>
                <td className="border px-4 py-2">{user2.totalStars}</td>
              </tr>
              <tr>
                <td className="border px-4 py-2">Commits (last month)</td>
                <td className="border px-4 py-2">
                  {user1.commitFreq.totalCommits} total <br />
                  {user1.commitFreq.avgPerActiveDay.toFixed(2)} / active day
                </td>
                <td className="border px-4 py-2">
                  {user2.commitFreq.totalCommits} total <br />
                  {user2.commitFreq.avgPerActiveDay.toFixed(2)} / active day
                </td>
              </tr>
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
