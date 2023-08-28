import PostThread from "@/components/forms/PostThread";
import ProfileHeader from "@/components/shared/ProfileHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import Image from "next/image";
import { profileTabs } from "@/constants";
import ThreadTab from "@/components/shared/ThreadTab";
import UserCard from "@/components/cards/UserCard";

const Page = async () => {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect("/onboarding");
    
    //fectch users
    const results = await fetchUsers({
        userId: user.id,
        searchTerm: '',
        pageNumber: 1,
        pageSize: 20

    })
  return (
    <section>
          <h1 className="head-text mb-10"></h1>
          
          <div className="mt-14 flex flex-col gap-9">
              {results.users.length === 0 ? (
                  <p className="no-result">No users</p>
              ) : (
                      <>
                          {results.users.map((person) => (
                              <UserCard
                                  key={person.id}
                                  id={person.id}
                                  name={person.name}
                              username={person.username}
                              imgURL={person.image}
                              personType='USER'
                              
                              />
                      ))}
                      </>
              )}
          </div>
    </section>
  );
};

export default Page;
