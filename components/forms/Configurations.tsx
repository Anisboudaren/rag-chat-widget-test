"use client"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "../ui/input"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const personalitySchema = z.object({
  primaryTraits: z.array(z.string()).min(1, {
    message: "Select at least one personality trait",
  }),
  communicationTone: z.string(),
  formalityLevel: z.number(),
  empathyLevel: z.number(),
  primaryFunction: z.string(),
  brandValues: z.string().optional(),
})

const knowledgeSchema = z.object({
  rules: z.string().min(1, "Rules are required"),
  companyInformation: z.string().min(1, "Company information is required"),
})

const TRAIT_OPTIONS = [
  "Analytical", "Friendly", "Authoritative",
  "Supportive", "Neutral", "Enthusiastic"
]

const FUNCTION_OPTIONS = [
  "Advisor", "Assistant", "Educator", "Entertainer", "Task-Automator"
]

export function BuildConfiguration() {
  const [activeTab, setActiveTab] = useState("personality")
  
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const [websiteUrl, setWebsiteUrl] = useState("")
  const [isImporting, setIsImporting] = useState(false)

  // ... (keep your existing form definitions)

  const handleOpenImportDialog = () => {
    setIsImportDialogOpen(true)
  }

  const handleCloseImportDialog = () => {
    if (!isImporting) {
      setIsImportDialogOpen(false)
      setWebsiteUrl("")
    }
  }

  const handleImportFromWebsite = () => {
    if (!websiteUrl) return
    
    setIsImporting(true)
    
    // Simulate API call
    setTimeout(() => {
      knowledgeForm.setValue("companyInformation", 
        `## Content imported from: ${websiteUrl}\n\n` +
        `Here's the information we found on your website...\n` +
        `• About Us\n• Product Details\n• Contact Information`
      )
      setIsImporting(false)
      setIsImportDialogOpen(false)
      setWebsiteUrl("")
    }, 3000)
  }

  const personalityForm = useForm({
    resolver: zodResolver(personalitySchema),
    defaultValues: {
      primaryTraits: [],
      communicationTone: "conversational",
      formalityLevel: 1,
      empathyLevel: 1,
      primaryFunction: "",
      brandValues: "",
    },
  })

  const knowledgeForm = useForm({
    resolver: zodResolver(knowledgeSchema),
    defaultValues: {
      rules: "",
      companyInformation: "",
    },
  })

  const handleNext = () => {
    // Validate current tab before proceeding
    if (activeTab === "personality") {
      personalityForm.trigger().then(isValid => {
        if (isValid) {
          setActiveTab("knowledge")
        }
      })
    }
  }

  const handleBack = () => {
    setActiveTab("personality")
  }

  const handleRevertFAQ = () => {
    // Mock implementation for reverting FAQ
    knowledgeForm.setValue("companyInformation", "Default FAQ content...")
  }

  const handleSubmit = () => {
    // Validate both forms
    Promise.all([
      personalityForm.trigger(),
      knowledgeForm.trigger()
    ]).then(([isPersonalityValid, isKnowledgeValid]) => {
      if (isPersonalityValid && isKnowledgeValid) {
        const personalityValues = personalityForm.getValues()
        const knowledgeValues = knowledgeForm.getValues()
        
        console.log("Form 1 (Personality) values:", personalityValues)
        console.log("Form 2 (Knowledge) values:", knowledgeValues)
        
        // Here you would typically send the data to your API
        alert("Configuration saved successfully!")
      }
    })
  }

  
  return (
    <>
    <Tabs value={activeTab} className="w-full space-y-6">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="personality">Personality & Purpose</TabsTrigger>
        <TabsTrigger value="knowledge">Rules & Knowledge</TabsTrigger>
      </TabsList>

      <TabsContent value="personality">
        <Form {...personalityForm}>
          <form className="w-full space-y-6">
            {/* Personality Traits */}
            <FormField
              control={personalityForm.control}
              name="primaryTraits"
              render={() => (
                <FormItem>
                  <FormLabel>Primary Personality Traits (Select 3-5)</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {TRAIT_OPTIONS.map((trait) => (
                      <FormField
                        key={trait}
                        control={personalityForm.control}
                        name="primaryTraits"
                        render={({ field }) => (
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(trait)}
                                onCheckedChange={(checked) => {
                                  const current = field.value || []
                                  return checked
                                    ? field.onChange([...current, trait])
                                    : field.onChange(current.filter(v => v !== trait))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">{trait}</FormLabel>
                          </FormItem>
                        )}
                      />
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Communication Tone */}
            <FormField
              control={personalityForm.control}
              name="communicationTone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Communication Tone</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select tone" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="formal">Formal</SelectItem>
                      <SelectItem value="conversational">Conversational</SelectItem>
                      <SelectItem value="casual">Casual</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Formality Level */}
            <FormField
              control={personalityForm.control}
              name="formalityLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Formality Level:{" "}
                    {field.value === 0 ? "Low" : field.value === 1 ? "Medium" : "High"}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={2}
                      step={1}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Low</span>
                    <span>Medium</span>
                    <span>High</span>
                  </div>
                </FormItem>
              )}
            />

            {/* Empathy Level */}
            <FormField
              control={personalityForm.control}
              name="empathyLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Empathy Level:{" "}
                    {field.value === 0 ? "Logical" : field.value === 1 ? "Balanced" : "Compassionate"}
                  </FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[field.value]}
                      max={2}
                      step={1}
                      onValueChange={(vals) => field.onChange(vals[0])}
                    />
                  </FormControl>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Logical</span>
                    <span>Balanced</span>
                    <span>Compassionate</span>
                  </div>
                </FormItem>
              )}
            />

            {/* Primary Function */}
            <FormField
              control={personalityForm.control}
              name="primaryFunction"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Function</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select function" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {FUNCTION_OPTIONS.map(func => (
                        <SelectItem key={func} value={func.toLowerCase()}>{func}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Brand Values */}
            <FormField
              control={personalityForm.control}
              name="brandValues"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Values (Optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Ex: innovation, trust, simplicity" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end">
              <Button type="button" onClick={handleNext}>
                Next: Rules & Knowledge
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>

      <TabsContent value="knowledge">
        <Form {...knowledgeForm}>
          <form className="w-full space-y-6">
            {/* Rules Section */}
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Rules</h3>
              <p className="text-sm text-muted-foreground">
                Define the rules that govern how your assistant should behave in specific situations.
              </p>
              <FormField
                control={knowledgeForm.control}
                name="rules"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Example: Always respond in under 100 words. Never provide medical advice. Redirect sales inquiries to the sales team."
                        className="min-h-[120px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Company Information Section */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-medium">Company Information for FAQ</h3>
                  <p className="text-sm text-muted-foreground">
                    Provide information about your company that will be used to answer common questions.
                  </p>
                </div>
                <div className="flex space-x-2">
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleOpenImportDialog}
                    >
                      Import from Website
                    </Button>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={handleRevertFAQ}
                    >
                      Revert to Default FAQ
                    </Button>
                  </div>
              </div>
              <FormField
                control={knowledgeForm.control}
                name="companyInformation"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea
                        placeholder="Example: Our company was founded in 2010 and specializes in AI solutions. Our headquarters are in San Francisco..."
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-between">
              <Button type="button" variant="outline" onClick={handleBack}>
                Back to Personality
              </Button>
              <Button type="button" onClick={handleSubmit}>
                Submit & Save
              </Button>
            </div>
          </form>
        </Form>
      </TabsContent>
    </Tabs>
     <Dialog open={isImportDialogOpen} onOpenChange={handleCloseImportDialog}>
     <DialogContent className="sm:max-w-[425px]">
       <DialogHeader>
         <DialogTitle>Import from Website</DialogTitle>
         <DialogDescription>
           Enter a website URL to import company information automatically.
         </DialogDescription>
       </DialogHeader>
       
       <div className="grid gap-4 py-4">
         <div className="grid grid-cols-4 items-center gap-4">
           <Input
             id="website-url"
             placeholder="https://example.com/about"
             className="col-span-4"
             value={websiteUrl}
             onChange={(e) => setWebsiteUrl(e.target.value)}
             disabled={isImporting}
           />
         </div>
       </div>
       
       <DialogFooter>
         <Button 
           variant="outline" 
           onClick={handleCloseImportDialog}
           disabled={isImporting}
         >
           Cancel
         </Button>
         <Button 
           type="button"
           onClick={handleImportFromWebsite}
           disabled={!websiteUrl || isImporting}
         >
           {isImporting ? (
             <>
               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
               Importing...
             </>
           ) : (
             "Start Import"
           )}
         </Button>
       </DialogFooter>
     </DialogContent>
   </Dialog>
    </>
  )
}