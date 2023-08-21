'use server'
import { revalidatePath } from "next/cache"
import Thread from "../models/thread.model"
import User from "../models/user.model"
import { connectToDB } from "../mongoose"
import mongoose from "mongoose";

interface Params{
    text: string,
    author: string,
    communityId: string | null,
    path: string
}

export async function createThread({ text, author, communityId, path }: Params) {
    try {
        connectToDB()

    const createdThread = await Thread.create({
        text,
        author,
        community:null
    })
 
   

    await User.findByIdAndUpdate(author, {
        $push:{threads:createdThread._id}
    })

    revalidatePath(path)
    
   } catch (error:any) {
    throw new Error(`Failed to create thread: ${error.message}`);
   }
}


export async function fetchPosts(pageNumber: number = 1, pageSize: number = 20) {
    await connectToDB(); 

    // Calculate the number of posts to skip
    const skipAmount = (pageNumber - 1) * pageSize;

    // Fetch posts with no parent
    const postQuery = Thread.find({ parentId: { $in: [null, undefined] } })
        .sort({ createdAt: 'desc' })
        .skip(skipAmount)
        .limit(pageSize)
        .populate({ path: 'author', model: 'User' })
        .populate({
            path: 'children',
            populate: {
                path: 'author',
                model: 'User',
                select: '_id name parentId image'
            }
        });

    
    const posts = await postQuery.exec(); 

    
    const totalPostsCount = await Thread.countDocuments({ parentId: { $in: [null, undefined] } });

    
    const isNextPage = totalPostsCount > skipAmount + posts.length;

    return { posts, isNextPage };
}


export async function fetchThreadById(id: string) {
    connectToDB();
    try {
        const thread = await Thread.findById(id)
            .populate({
                path: 'author',
                model: 'User',
                select: '_id id name image'
            })
            .populate({
                path: 'children',
                populate: [
                    {
                        path: 'author',
                        model: 'User',
                        select: '_id id name parentId image'

                    },
                    {
                        path: 'children',
                        model: Thread,
                        populate: {
                            path: 'author',
                            model: User,
                            select: '_id id name parentId image'
                        }
                    }
                ]
            }).exec();
        
        
        return thread
        
    } catch (error:any) {
        throw new Error(`Soomething went wrong ${error.message}`)
    }
}

export async function addCommentToThread(
    threadId: string,
    commentText: string,
    userId: string,
    path: string){
    try {

        const originalThread = await Thread.findById(threadId);
        if (!originalThread) {
            throw new Error("Couldn't find thread")
        }

        const commentThread = new Thread({
            text: commentText,
            author: userId,
            parentId: threadId,
        })
        const savedCommentThread = await commentThread.save();

        //update the origiinal thread to include the nnew comment
        originalThread.children.push(savedCommentThread._id)
        await originalThread.save();

        revalidatePath(path)
    } catch (error:any) {
        throw new Error(`Something went wrong ${error.message}`)
    }
}

