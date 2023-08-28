'use server'
import { revalidatePath } from 'next/cache';
import User from '../models/user.model';
import {connectToDB} from '../mongoose'
import Thread from '../models/thread.model';
import { FilterQuery, SortOrder } from 'mongoose';

interface Params{
    userId: string;
    name: string;
    username: string; 
    bio: string;
    image: string;
    path : string;

}

export async function updateUser({
    userId,
    username,
    name,
    bio,
    image,
    path
}:Params): Promise<void>{
    connectToDB();

    try {
        
        await User.findOneAndUpdate(
            { id:userId },
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                onboarded:true
            },
            {upsert:true }
        )
        if (path === '/profile/edit') {
            revalidatePath(path)
        }
    } catch (error:any) {
        throw new Error(`failed to update user ${error.message}`)
    }
}

export async function fetchUser(userId: string) {
    connectToDB();
    try {
        return await User.findOne({ id: userId })
        //     .populate({
        //     path: 'communities',
        //     model:Community
        // })
        
    } catch (error:any) {
        throw new Error(`Failed to fetch user ${error.message}`)
    }
    
}

export async function fetchUserPost(userId: string) {

    try {

        connectToDB();
        // find all thread authored by user with the user Id
        const threads = await User.findOne({ _id: userId })
            .populate({
                path: 'threads',
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate: {
                        path: 'author',
                        model: User,
                        select:'name, image, id'
                    }
                }
                
            })
        console.log(threads)
        
        return threads
        
    } catch (error:any) {
        throw new Error(`Failed to fetch user post ${error.message}`)
    }
    
}

export async function fetchUsers({
    userId, 
    searchTerm= '',
    pageNumber= 1,
    pageSize= 10,
    sortBy= 'desc'
}: {
        userId: string;
        searchTerm? :string;
        pageNumber?: number;
        pageSize?: number;
        sortBy?: SortOrder;
}) {
    try {
        connectToDB();

        const skipAmount = (pageNumber - 1) * pageSize;
        const regex = new RegExp(searchTerm, 'i');

        const query:FilterQuery<typeof User> = {
            id:{$ne:userId}
        }
        if (searchTerm.trim() !== '') {
            query.$or = [
                { username: { $regex: regex } },
                {name: {$regex: regex}}
            ]
        }
        const sortOptions = { createdAt: sortBy }
        const userQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        
        const totalUsersCount = await User.countDocuments(query);

        const users = await userQuery.exec();
        
        const isNext = totalUsersCount > skipAmount + users.length
        
        return { users, isNext }
        
    } catch (error:any) {
        throw new Error("Failed to fetch users", error)
    }
}

