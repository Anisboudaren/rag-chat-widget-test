"use client"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Separator } from "../ui/separator"
import { useState } from "react"
import { Checkbox } from "../ui/checkbox"

const formSchema = z.object({
  aiName: z.string().min(2),
  template: z.string(),
  model: z.string(),
  tokenLimit: z.number().min(0).optional(),
  messageLength: z.number().min(0).optional(),
  openAIKey: z.string().optional(),
  allowHumanAgent: z.boolean().optional(),
})

export function BasicSettings() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      aiName: "",
      template: "sales",
      model: "gpt-4-turbo",
      tokenLimit: 1000, // Example default value for token limit
      messageLength: 500, // Example default value for message length
      openAIKey: "",
      allowHumanAgent: true,
    },
  })

  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => setIsOpen(!isOpen);

  return (
    <Form {...form}>
      <form className="w-full space-y-6 ">

        {/* AI Name Field */}
        <FormField
          control={form.control}
          name="aiName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>AI Name</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Sales Assistant" {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        {/* Template Selection Field */}
        <FormField
          control={form.control}
          name="template"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pick a Template</FormLabel>
              <FormControl>
                <Select defaultValue={field.value} onValueChange={field.onChange}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sales">Sales AI</SelectItem>
                    <SelectItem value="support">Support AI</SelectItem>
                    <SelectItem value="blank">Start Blank</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
            </FormItem>
          )}
        />

        {/* Model Selection Field */}
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>Select a Model</FormLabel>
              <Select defaultValue={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Model" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                  <SelectItem value="deepseek-v1">DeepSeek v1</SelectItem>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />

        <Separator />

        <Collapsible open={isOpen} onOpenChange={handleToggle}>
          <CollapsibleTrigger className="flex items-center  text-muted-foreground cursor-pointer space-x-2 mb-4  ">
            <span >Advanced settings</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`w-4 h-4 transform transition-transform duration-700 ${isOpen ? "rotate-180" : "rotate-0"}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </CollapsibleTrigger>
          <CollapsibleContent className={`overflow-hidden space-y-6 max-h-0 transition-all duration-700 ease-in-out ${isOpen ? "max-h-96" : ""}`}>
            {/* Token Limit Field */}
            <FormField
              control={form.control}
              name="tokenLimit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Token Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter token limit"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Message Length Field */}
            <FormField
              control={form.control}
              name="messageLength"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message Length Limit</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter message length limit"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* OpenAI API Key */}
            <FormField
              control={form.control}
              name="openAIKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your OpenAI API Key</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      placeholder="Enter your OpenAI API key"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Allow Human Agent Toggle */}
            <FormField
              control={form.control}
              name="allowHumanAgent"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                <FormControl>
                  <Checkbox
                  defaultChecked={true}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>
                    Allow Client to Request Human Agent
                  </FormLabel>
                  <FormDescription>
                    This is activated by Default for all agents.
                    
                  </FormDescription>
                </div>
              </FormItem>
              )}
            />
          </CollapsibleContent>
        </Collapsible>

      </form>
    </Form>
  )
}
