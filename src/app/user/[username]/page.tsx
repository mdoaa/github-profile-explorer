import Image from "next/image";
import UserNotes from "@/components/UserNotes";
import Link from "next/link";


type Params = {
  params: {
    username: string;
  };
};

type User = {
  login: string;
  avatar_url: string;
  name: string;
  bio: string;
  followers: number;
  following: number;
  public_repos: number;
  html_url: string;
};

type Repo = {
  id: number;
  name: string;
  html_url: string;
  description: string;
  stargazers_count: number;
  forks_count: number;
};

async function fetchUserData(username: string): Promise<User | null> {
      console.log("user:", username);
  try {
    const res = await fetch(`https://api.github.com/users/${username}`, {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "User-Agent": "nextjs-app",
      },
      cache: "no-store",
    });
     console.log("Fetch user response:", res);
    if (res.ok) return res.json();
    return null;
  } catch (err) {
  console.error("Fetch user failed:", err);
  return null;
}
}

async function fetchUserRepos(username: string): Promise<Repo[]> {
  const allRepos: Repo[] = [];
  let page = 1;
  const perPage = 100; // max allowed by GitHub API

  while (true) {
    try {
      const res = await fetch(
        `https://api.github.com/users/${username}/repos?per_page=${perPage}&page=${page}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
            "User-Agent": "nextjs-app",
          },
          cache: "no-store",
        });
      
      if (!res.ok) break;

      const repos: Repo[] = await res.json();
      if (repos.length === 0) break;

      allRepos.push(...repos);

      if (repos.length < perPage) break;
      page++;
    } catch {
      break;
    }
  }

  return allRepos;
}


export default async function UserPage( { params }: Params) {

    const  user  = params.username;
    const userData = await fetchUserData(user);
    const userRepos = await fetchUserRepos(user);

    if (!userData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-red-500">User not found</h1>
        <p className="text-gray-600 mt-2">
          Try searching for another GitHub username.
        </p>
      </div>
        );
    }
    
  return (
      <>
      <Link
  href="/"
  className="inline-block mt-10 ml-10 mb-6 px-4 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition"
>
  ← Back to Home
</Link>
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center gap-6 mb-8">
        <Image
          src={userData.avatar_url}
          alt={userData.login}
          width={100}
          height={100}
          className="rounded-full border"
        />
        <div>
          <h1 className="text-2xl font-bold">{userData.name || userData.login}</h1>
          <p className="text-gray-600">@{userData.login}</p>
          <p className="mt-2">{userData.bio}</p>
          <div className="flex gap-4 mt-2 text-sm text-gray-700">
            <span>👥 {userData.followers} followers</span>
            <span>•</span>
            <span>🔗 {userData.following} following</span>
            <span>•</span>
            <span>📦 {userData.public_repos} repos</span>
          </div>
          <a
            href={userData.html_url}
            target="_blank"
            className="text-blue-600 hover:underline mt-2 inline-block"
          >
            View on GitHub
          </a>
        </div>
        </div>
        
        <UserNotes username={userData.login} />


      <h2 className="text-xl font-semibold mb-4">Repositories</h2>
      {userRepos.length === 0 ? (
        <p className="text-gray-500">No repositories found.</p>
      ) : (
        <ul className="grid gap-4">
          {userRepos.map((userRepos) => (
            <li
              key={userRepos.id}
              className="p-4 border rounded-lg shadow-sm hover:shadow-md transition"
            >
              <a
                href={userRepos.html_url}
                target="_blank"
                className="text-lg font-semibold text-blue-600 hover:underline"
              >
                {userRepos.name}
              </a>
              <p className="text-gray-600 mt-1">
                {userRepos.description || "No description"}
              </p>
              <div className="flex gap-4 text-sm text-gray-700 mt-2">
                <span>⭐ {userRepos.stargazers_count}</span>
                <span>🍴 {userRepos.forks_count}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
      </div>
      </>
  );
}