"use client";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
interface Repo {
  id: number;
  name: string;
  description: string;
}
interface ProfileData {
  avatar_url: string;
  name: string;
  bio?: string;
}
export default function Profile() {
  const pathname = usePathname();
  const path = pathname.slice(1);
  const router = useRouter();

  const [data, setData] = useState<ProfileData | null>();
  const [repo, setrepo] = useState<Repo[]>([]);
  useEffect(() => {
    const githubAPI = async () => {
      try {
        const [profileResponse, repoResponse] = await Promise.all([
          fetch(`https://api.github.com/users/${path}`),
          fetch(`https://api.github.com/users/${path}/repos`),
        ]);
        const profileData = await profileResponse.json();
        const repoDatas = await repoResponse.json();
        console.log(profileData.name);
        console.log(repoDatas);
        if (repoDatas && repoDatas.length > 0) {
          setData(profileData);
          setrepo(repoDatas.slice(1, 5));
        } else {
          toast.error("Please enter the correct  user profile ...", {
            position: "top-center",
          });
          console.log("Please enter the correct  user profile ...");
          router.push("/");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    if (path) {
      githubAPI();
    }
  }, [path]);
  return (
    <>
      <h1 className=" text-7xl font-bold  text-center pt-10">Github Profile</h1>

      <div className=" md:flex  md:justify-evenly pt-5 ">
        <div className=" md:w-64 h-full">
          <div className="flex justify-center">
            {data && (
              <img
                src={data.avatar_url}
                alt="Profile"
                className="h-60 w-60 rounded-full m-5 items-center"
              />
            )}
          </div>
          {data && (
            <>
              <h1 className="text-3xl font-bold py-2">{data.name}</h1>
              <h2 className="sm:px-20 md:px-0">{data.bio}</h2>
            </>
          )}
        </div>
        <div className="md:w-1/2 h-full py-10 md:px-20 text-start">
          {repo.map((repo) => (
            <div
              className=" text-xl py-1 px-5 bg-zinc-700 rounded-xl m-1 "
              key={repo.id}
            >
              <h2 className="font-bold ">{repo.name}</h2>
              <p className=" text-sm ">{repo.description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
