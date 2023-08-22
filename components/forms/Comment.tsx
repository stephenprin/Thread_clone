'use client'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"

import * as z from "zod"
import { Button } from "../ui/button";

import { usePathname, useRouter } from "next/navigation";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";
import { addCommentToThread } from "@/lib/actions/thread.action";

//import { createThread } from "@/lib/actions/thread.action";


interface Props{
    threadId: string;
    currentUserId: string;
    currentUserImg: string;
}


const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
    
    const pathname = usePathname();
    const router = useRouter()
  
    const form = useForm({
      defaultValues: {
            thread: '',

      },
      resolver:zodResolver(CommentValidation)
    })

const onSubmit = async (values: z.infer<typeof CommentValidation>)=> {
    await  addCommentToThread(threadId, values.thread, JSON.parse(currentUserId), pathname)
    console.log(JSON.parse(currentUserId))
    form.reset();

    }
  return (
      <>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
                  className="comment-form">
                  
                  <FormField 
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex items-center gap-3 w-full">
              <FormLabel >
                <Image src={currentUserImg} alt="profile image" width={44} height={44} className="rounded-full object-cover" />
              </FormLabel>
              <FormControl  className="border-none bg-transparent" >
                <Input 
                 {...field} type="text" placeholder="Comment..." className="no-focus text-light-1 outline-none" />
              </FormControl>
            
            </FormItem>
          )}
                  />
                  <Button type="submit" className="comment-form_btn ">
                      Reply
                  </Button>
              </form>
        </Form>
      </>
  )
}

export default Comment
