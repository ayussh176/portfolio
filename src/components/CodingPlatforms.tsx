import { Trophy } from "lucide-react";

const CodingPlatforms = () => {
  const platforms = [
    
    {
      name: "CodeChef",
      link: "https://www.codechef.com/users/ayush_176",
      stats: ["Rating: 1325 Star", "13 Contests"],
    },
    {
      name: "HackerRank",
      link: "https://www.hackerrank.com/profile/ayushmalik852",
      stats: ["4 Badges", "Level: Silver"],
    },
    {
      name: "LeetCode",
      link: "https://leetcode.com/u/ayush_176/",
      stats: ["370+ Problems Solved"],
    },
    
  ];

  return (
    <section id="coding-platforms" className="py-16 bg-background text-center">
      <h2 className="text-3xl font-bold text-purple-600 mb-10">Coding Platforms</h2>
      <div className="h-1 w-20 bg-purple-600 mx-auto mb-6"></div>
      <div className="container mx-auto px-4 flex flex-wrap justify-center gap-8">
      
        {platforms.map((platform) => (
          <a
            href={platform.link}
            target="_blank"
            rel="noopener noreferrer"
            key={platform.name}
            className="bg-card border border-muted rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-left"
          >
            <div className="flex items-center mb-4 text-purple-500">
              <Trophy size={20} className="mr-2" />
              <h3 className="text-xl font-semibold text-foreground">
                {platform.name}
              </h3>
            </div>
            <ul className="text-muted-foreground text-sm space-y-1">
              {platform.stats.map((stat, idx) => (
                <li key={idx}>{stat}</li>
              ))}
            </ul>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CodingPlatforms;
