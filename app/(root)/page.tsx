import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.action";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs";

export default async function Home() {
  const result = await fetchPosts(1, 20);
  
  const user = await currentUser()
  


  return (
    <div>
      <h1 className="head-text text-left">
        <section className="mt-10 flex flex-col gap-10">
          {result.posts.length === 0 ? (
            <p className="no-result">No posts found</p>
          ) : (
            <>
              {result.posts.map((post) => (
                <ThreadCard
                  key={post._id}
                  id={post._id}
                  currentUserId={user?.id || " "}
                  parentId={post.parentId}
                  content={post.text}
                  author={post.author}
                  community={post.community}
                  createdAt={post.createdAt}
                  comments={post.children}

                />
                 
              ))}
            </>
          )}
        </section>
      </h1>
    </div>
  );
}
