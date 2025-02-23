"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function CVAnalyzer() {
  const [file, setFile] = useState<File | null>(null)
  const [vacancy, setVacancy] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [output, setOutput] = useState("")

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0])
    }
  }

  const handleAnalysis = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setOutput(
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      )
    }, 2000)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>CV Analyzer</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="cv-upload">Upload CV (PDF or DOC)</Label>
            <Input id="cv-upload" type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />
          </div>
          <div>
            <Label htmlFor="vacancy">Vacancy Description</Label>
            <Textarea
              id="vacancy"
              value={vacancy}
              onChange={(e) => setVacancy(e.target.value)}
              placeholder="Enter vacancy description"
            />
          </div>
          <div>
            <Label htmlFor="default-prompt">Default Prompt</Label>
            <Textarea
              id="default-prompt"
              readOnly
              value="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col items-center space-y-4">
          <Button onClick={handleAnalysis} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Analyzing..." : "Analyze CV"}
          </Button>
          {output && (
            <div className="w-full">
              <Label htmlFor="output">Analysis Result</Label>
              <Textarea id="output" readOnly value={output} />
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}

