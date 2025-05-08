
import { useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { PatentData } from "./PatentCard";
import { ArrowLeft, Bot, Send } from "lucide-react";

// Mock patent data
const mockPatents: { [key: string]: PatentData } = {
  "1": {
    id: "1",
    title: "Method and System for AI-Based Patent Analysis",
    inventor: "Jane Doe",
    filingDate: "2023-05-12",
    status: "Granted",
    abstract: "This patent describes a novel approach to analyzing patent documents using artificial intelligence techniques to extract key information and provide insights.",
    category: "Technology",
  },
  "2": {
    id: "2",
    title: "Improved Neural Network for Natural Language Processing in Legal Documents",
    inventor: "John Smith",
    filingDate: "2023-06-23",
    status: "Pending",
    abstract: "A specialized neural network architecture designed specifically for processing and understanding complex legal language in patent documents and other legal texts.",
    category: "Software",
  },
  "3": {
    id: "3",
    title: "Quantum Computing Method for Molecular Simulation",
    inventor: "Michael Johnson",
    filingDate: "2022-11-05",
    status: "Pending",
    abstract: "A novel quantum computing algorithm that enables faster and more accurate simulation of molecular structures for pharmaceutical research and development.",
    category: "Pharmaceutical",
  },
  "4": {
    id: "4",
    title: "Biodegradable Polymer Composition for Medical Implants",
    inventor: "Sarah Williams",
    filingDate: "2022-08-17",
    status: "Rejected",
    abstract: "A composition comprising biodegradable polymers designed specifically for use in temporary medical implants with controlled degradation rates.",
    category: "Chemical",
  },
  "5": {
    id: "5",
    title: "Energy-Efficient Microprocessor Architecture",
    inventor: "Robert Chen",
    filingDate: "2023-01-30",
    status: "Granted",
    abstract: "A novel microprocessor architecture that significantly reduces power consumption while maintaining or improving performance compared to conventional designs.",
    category: "Electrical",
  },
};

interface Message {
  role: "user" | "assistant";
  content: string;
}

const PatentPromptEngineer = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Get patent data
  const patent = id ? mockPatents[id] : null;
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast({
        variant: "destructive",
        title: "Empty prompt",
        description: "Please enter a prompt to continue",
      });
      return;
    }
    
    setIsGenerating(true);
    const userMessage: Message = { role: "user", content: prompt };
    setMessages((prev) => [...prev, userMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const responseText = generateMockResponse(prompt, patent);
      const aiMessage: Message = { role: "assistant", content: responseText };
      
      setMessages((prev) => [...prev, aiMessage]);
      setPrompt("");
      setIsGenerating(false);
      
      // Scroll to bottom after rendering
      setTimeout(scrollToBottom, 100);
    }, 1500);
  };
  
  // Generate mock AI responses
  const generateMockResponse = (userPrompt: string, patent: PatentData | null): string => {
    if (!patent) return "I don't have information about this patent.";
    
    const promptLower = userPrompt.toLowerCase();
    
    if (promptLower.includes("explain") || promptLower.includes("describe") || promptLower.includes("what is")) {
      return `This patent titled "${patent.title}" by ${patent.inventor} describes ${patent.abstract} The patent was filed on ${patent.filingDate} and is currently ${patent.status.toLowerCase()}. It falls under the ${patent.category} category.`;
    }
    
    if (promptLower.includes("similar") || promptLower.includes("related")) {
      return `Based on my analysis, patents similar to "${patent.title}" include several in the ${patent.category} category that address related problems. For example, there are patents focusing on improved data processing techniques, optimization algorithms, and novel applications in the same field.`;
    }
    
    if (promptLower.includes("novel") || promptLower.includes("unique") || promptLower.includes("innovative")) {
      return `The key innovation in "${patent.title}" appears to be the specific approach to ${patent.abstract.substring(0, 100).toLowerCase()}... This differentiates it from prior art by focusing on improved efficiency and effectiveness in this specific domain.`;
    }
    
    if (promptLower.includes("application") || promptLower.includes("use case")) {
      return `"${patent.title}" has several potential applications, including commercial use in ${patent.category} industries, research applications for advancing the field, and possible integration with existing systems to improve their functionality. The core technology could be adapted for various related purposes.`;
    }
    
    // Default response
    return `I've analyzed the patent "${patent.title}" and can provide insights based on your query. This ${patent.status.toLowerCase()} patent in the ${patent.category} category by ${patent.inventor} describes an innovation that addresses specific challenges in this field. What specific aspects would you like me to elaborate on?`;
  };
  
  if (!patent) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Patent Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The patent you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back to Patent
      </Button>
      
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-primary" />
            <div>
              <CardTitle>AI Prompt Engineer</CardTitle>
              <CardDescription>
                Generate insights and analysis for {patent.title}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="bg-muted p-4 rounded-md mb-4">
            <h3 className="font-medium mb-1">Patent Summary</h3>
            <p className="text-sm">{patent.title} ({patent.status}) - {patent.inventor}</p>
            <p className="text-xs text-muted-foreground mt-1">{patent.abstract.substring(0, 150)}...</p>
          </div>
          
          <div className="h-[350px] overflow-y-auto border rounded-md p-4 mb-4">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground">
                <Bot className="h-10 w-10 mb-2" />
                <p>Ask the AI to analyze this patent, suggest improvements, find similar patents, or identify potential applications.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      message.role === "assistant" ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] px-4 py-2 rounded-lg ${
                        message.role === "assistant"
                          ? "bg-muted text-foreground"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          
          <div className="flex items-end gap-2">
            <Textarea
              placeholder="Ask a question about this patent..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="flex-1 min-h-[80px]"
              disabled={isGenerating}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleGenerate();
                }
              }}
            />
            <Button 
              className="mb-[1px] flex-shrink-0" 
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? "Generating..." : (
                <>
                  <Send className="h-4 w-4 mr-2" /> Send
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PatentPromptEngineer;
