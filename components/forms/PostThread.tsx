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

import { Textarea } from "../ui/textarea";
import { usePathname, useRouter } from "next/navigation";
import { ThreadValidation } from "@/lib/validations/thread";
import { createThread } from "@/lib/actions/thread.action";
  

    const PostThread =  ({ userId }: { userId: string }) => {
       
        
        const pathname = usePathname();
        const router = useRouter()
      
        const form = useForm({
          defaultValues: {
                thread: '',
              accountId: userId
          },
          resolver:zodResolver(ThreadValidation)
        })

    const onSubmit = async (values: z.infer<typeof ThreadValidation>)=> {
        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathname
        })
        
        router.push("/")

        }
      
  return (
    <>
          <h1>Post Thread Form</h1>
          <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}
                  className="flex mt-10 flex-col justify-start gap-10">
                  
                  <FormField 
          control={form.control}
          name="thread"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-3 w-full">
              <FormLabel className="text-base-semibold text-light-2">
                Content
              </FormLabel>
              <FormControl  className="no-focus p-4 text-light-1 border border-dark-4 bg-dark-3" >
                <Textarea 
                 {...field} rows={15}  />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
                  />
                  <Button type="submit" className="bg-primary-500 cursor-pointer  ">
                      Post Thread
                  </Button>
              </form>
        </Form>
    </>
  )
}

export default PostThread
