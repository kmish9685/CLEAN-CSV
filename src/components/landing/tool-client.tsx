
"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { suggestCleaningStrategies } from "@/ai/flows/suggest-cleaning-strategies";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import {
  UploadCloud,
  File as FileIcon,
  RefreshCw,
  BrainCircuit,
  Sparkles,
  Loader2,
  Download,
  Wand2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type CleaningStrategy = {
  id: string;
  label: string;
  description: string;
};

const prebuiltTemplates: CleaningStrategy[] = [
  { id: "phone_cleanup", label: "Phone Number Cleanup", description: "Formats US phone numbers to (XXX) XXX-XXXX." },
  { id: "date_standardization", label: "Date Standardization", description: "Converts dates to YYYY-MM-DD format." },
  { id: "shopify_formatter", label: "Shopify Export Formatter", description: "Cleans up common Shopify export issues." },
  { id: "financial_cleaner", label: "Financial Data Cleaner", description: "Removes currency symbols and formats numbers." },
];

const customOptions: CleaningStrategy[] = [
  { id: "remove_duplicates", label: "Remove Duplicates", description: "Deletes all but the first occurrence of identical rows." },
  { id: "trim_whitespace", label: "Trim Whitespace", description: "Removes leading/trailing spaces from all cells." },
  { id: "standardize_capitalization", label: "Standardize Capitalization", description: "Converts text to a consistent case (e.g., Title Case)." },
  { id: "remove_special_chars", label: "Remove Special Characters", description: "Strips non-alphanumeric characters (keeps spaces)." },
];

const parseCsv = (text: string): string[][] => {
  const rows = text.trim().split("\n");
  return rows.map((row) => row.split(",").map((cell) => cell.trim()));
};

const stringifyCsv = (data: string[][]): string => {
  return data.map((row) => row.join(",")).join("\n");
};

export default function ToolClient() {
  const { toast } = useToast();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<string[][] | null>(null);
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [supabase]);

  const previewData = useMemo(() => csvData.slice(0, 5), [csvData]);
  const processedPreviewData = useMemo(() => processedData ? processedData.slice(0, 5) : [], [processedData]);

  const fetchAiSuggestions = useCallback(async (content: string) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "Log in to use AI-powered suggestions."
      });
      return;
    }

    setIsLoadingAi(true);
    try {
      const csvSample = content.split("\n").slice(0, 10).join("\n");
      const result = await suggestCleaningStrategies({ csvSample });
      setAiSuggestions(result.suggestedStrategies);
    } catch (error) {
      console.error("AI suggestion error:", error);
      toast({
        variant: "destructive",
        title: "AI Error",
        description: "Could not get AI suggestions. Please try again.",
      });
    } finally {
      setIsLoadingAi(false);
    }
  }, [toast, user]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) {
        toast({
          variant: "destructive",
          title: "File too large",
          description: "Please upload a file smaller than 10MB.",
        });
        return;
      }
      setFile(uploadedFile);
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setFileContent(text);
        const parsedData = parseCsv(text);
        setCsvData(parsedData);
        fetchAiSuggestions(text);
      };
      reader.readAsText(uploadedFile);
    }
  }, [toast, fetchAiSuggestions]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false });

  const handleStrategyToggle = (id: string, checked: boolean) => {
    setSelectedStrategies((prev) => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(id);
      } else {
        newSet.delete(id);
      }
      return newSet;
    });
  };

  const handleReset = () => {
    setFile(null);
    setFileContent("");
    setCsvData([]);
    setProcessedData(null);
    setSelectedStrategies(new Set());
    setAiSuggestions([]);
    setProgress(0);
  };

  const applyTransformations = (data: string[][]): string[][] => {
    let temp_data = JSON.parse(JSON.stringify(data));

    if (selectedStrategies.has("trim_whitespace")) {
      temp_data = temp_data.map(row => row.map(cell => cell.trim()));
    }
    if (selectedStrategies.has("standardize_capitalization")) {
      temp_data = temp_data.map(row => row.map(cell => cell.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())));
    }
    if (selectedStrategies.has("phone_cleanup")) {
      temp_data = temp_data.map(row => row.map(cell => cell.replace(/(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/, "($1) $2-$3")));
    }
    if (selectedStrategies.has("date_standardization")) {
      temp_data = temp_data.map(row => row.map(cell => {
        const d = new Date(cell);
        return isNaN(d.getTime()) ? cell : d.toISOString().split("T")[0];
      }));
    }
    if (selectedStrategies.has("remove_special_chars")) {
      temp_data = temp_data.map(row => row.map(cell => cell.replace(/[^a-zA-Z0-9\s@.-]/g, "")));
    }
    if (selectedStrategies.has("financial_cleaner")) {
      temp_data = temp_data.map(row => row.map(cell => cell.replace(/[$,€£]/g, "")));
    }
    if (selectedStrategies.has("remove_duplicates")) {
      const uniqueRows = new Map<string, string[]>();
      temp_data.forEach(row => uniqueRows.set(JSON.stringify(row), row));
      temp_data = Array.from(uniqueRows.values());
    }

    return temp_data;
  };

  const processFile = async () => {
    if (selectedStrategies.size === 0) {
      toast({
        variant: "destructive",
        title: "No strategies selected",
        description: "Please select at least one cleaning strategy.",
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => (prev >= 90 ? prev : prev + 10));
    }, 200);

    setTimeout(() => {
      const transformedData = applyTransformations(csvData);
      setProcessedData(transformedData);
      clearInterval(interval);
      setProgress(100);
      setIsProcessing(false);
      toast({
        title: "Processing Complete!",
        description: "Your file has been successfully cleaned.",
      });
    }, 2000);
  };

  const downloadFile = () => {
    if (!processedData) return;
    const csvString = stringifyCsv(processedData);
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cleaned_${file?.name || "data.csv"}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const renderTable = (data: string[][]) => (
    <ScrollArea className="w-full whitespace-nowrap rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {data[0]?.map((header, i) => <TableHead key={i}>{header}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.slice(1).map((row, i) => (
            <TableRow key={i}>
              {row.map((cell, j) => <TableCell key={j}>{cell}</TableCell>)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );

  return (
    <section id="tool" className="container mx-auto max-w-7xl px-4 py-20 sm:py-24">
      {/* Rest of your JSX remains unchanged */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Upload & Options */}
        <div className="lg:col-span-1 space-y-6">
          <Card id="upload-step">
            <CardHeader>
              <CardTitle>1. Upload Your File</CardTitle>
              <CardDescription>Drag & drop or select a CSV file.</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                {...getRootProps()}
                className={`flex flex-col items-center justify-center p-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${isDragActive ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50'}`}
              >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 text-muted-foreground" />
                <p className="mt-4 text-sm text-muted-foreground">
                  {isDragActive ? 'Drop the file here...' : 'Drag & drop a file here, or click to select'}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Max file size: 10MB</p>
              </div>
              {file && (
                <div className="mt-4 flex items-center justify-between p-3 rounded-md bg-secondary">
                  <div className="flex items-center gap-3">
                    <FileIcon className="w-6 h-6 text-primary" />
                    <div className="text-sm">
                      <p className="font-semibold">{file.name}</p>
                      <p className="text-muted-foreground">{Math.round(file.size / 1024)} KB</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={handleReset}>
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {csvData.length > 0 && (
            <Card id="options-step">
              <CardHeader>
                <CardTitle>2. Choose Cleaning Options</CardTitle>
                <CardDescription>Select from templates or custom rules.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="ai">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="ai"><Sparkles className="w-4 h-4 mr-2" />AI</TabsTrigger>
                    <TabsTrigger value="templates">Templates</TabsTrigger>
                    <TabsTrigger value="custom">Custom</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="ai" className="mt-4 space-y-4">
                     <div className="flex items-center justify-between">
                        <Label htmlFor="ai-suggestions" className="flex items-center gap-2 font-semibold">
                          <BrainCircuit className="w-5 h-5 text-primary" />
                          AI Suggestions
                        </Label>
                        <Button variant="ghost" size="sm" onClick={() => fetchAiSuggestions(fileContent)} disabled={isLoadingAi}>
                           {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                        </Button>
                     </div>
                      {isLoadingAi ? (
                        <div className="space-y-2">
                           <div className="flex items-center space-x-2">
                              <Checkbox id="ai-suggestion-skeleton-1" disabled />
                              <Label htmlFor="ai-suggestion-skeleton-1" className="w-full h-4 bg-muted rounded-md animate-pulse"></Label>
                           </div>
                           <div className="flex items-center space-x-2">
                              <Checkbox id="ai-suggestion-skeleton-2" disabled />
                              <Label htmlFor="ai-suggestion-skeleton-2" className="w-3/4 h-4 bg-muted rounded-md animate-pulse"></Label>
                           </div>
                        </div>
                      ) : aiSuggestions.length > 0 ? (
                        aiSuggestions.map((suggestion) => {
                          const allOptions = [...prebuiltTemplates, ...customOptions];
                          const matchedOption = allOptions.find(opt => opt.label === suggestion);
                          return matchedOption ? (
                            <div key={matchedOption.id} className="flex items-start space-x-2">
                               <Checkbox
                                id={matchedOption.id}
                                checked={selectedStrategies.has(matchedOption.id)}
                                onCheckedChange={(checked) => handleStrategyToggle(matchedOption.id, !!checked)}
                              />
                              <div className="grid gap-1.5 leading-none">
                                <Label htmlFor={matchedOption.id}>{matchedOption.label}</Label>
                                <p className="text-sm text-muted-foreground">{matchedOption.description}</p>
                              </div>
                            </div>
                          ) : null;
                        })
                      ) : (
                        <p className="text-sm text-muted-foreground text-center py-4">No suggestions found. Try refreshing.</p>
                      )}
                  </TabsContent>

                  <TabsContent value="templates" className="mt-4 space-y-4">
                    {prebuiltTemplates.map((template) => (
                      <div key={template.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={template.id}
                          checked={selectedStrategies.has(template.id)}
                          onCheckedChange={(checked) => handleStrategyToggle(template.id, !!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor={template.id}>{template.label}</Label>
                          <p className="text-sm text-muted-foreground">{template.description}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                  <TabsContent value="custom" className="mt-4 space-y-4">
                    {customOptions.map((option) => (
                      <div key={option.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={option.id}
                          checked={selectedStrategies.has(option.id)}
                          onCheckedChange={(checked) => handleStrategyToggle(option.id, !!checked)}
                        />
                        <div className="grid gap-1.5 leading-none">
                          <Label htmlFor={option.id}>{option.label}</Label>
                           <p className="text-sm text-muted-foreground">{option.description}</p>
                        </div>
                      </div>
                    ))}
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Preview & Process */}
        <div className="lg:col-span-2">
          {csvData.length > 0 ? (
            <Card id="preview-step">
              <CardHeader>
                <CardTitle>3. Preview & Process</CardTitle>
                <CardDescription>Review your changes before downloading.</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="before">
                  <TabsList>
                    <TabsTrigger value="before">Before</TabsTrigger>
                    <TabsTrigger value="after">After</TabsTrigger>
                  </TabsList>
                  <TabsContent value="before" className="mt-4">
                    <p className="text-sm text-muted-foreground mb-2">Showing first 5 rows.</p>
                    {renderTable([csvData[0], ...previewData.slice(1)])}
                  </TabsContent>
                  <TabsContent value="after" className="mt-4">
                     <p className="text-sm text-muted-foreground mb-2">Showing first 5 rows.</p>
                    {processedData ? 
                      renderTable([processedData[0], ...processedPreviewData.slice(1)])
                      : <div className="text-center py-10 text-muted-foreground">Process the file to see the result</div>}
                  </TabsContent>
                </Tabs>

                <Separator className="my-6" />

                <div className="space-y-4">
                   <div className="flex items-center justify-between">
                     <Button 
                       onClick={processFile}
                       disabled={isProcessing || selectedStrategies.size === 0}
                       className="w-full"
                       size="lg"
                     >
                       {isProcessing ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Wand2 className="w-5 h-5 mr-2" />}
                       {isProcessing ? 'Processing...' : 'Process File'}
                     </Button>
                   </div>
                  {isProcessing && <Progress value={progress} className="w-full" />}
                </div>

                {processedData && (
                  <div className="mt-6">
                    <Button onClick={downloadFile} className="w-full" size="lg" variant="outline">
                      <Download className="w-5 h-5 mr-2" />
                      Download Cleaned File
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
             <Card className="flex flex-col items-center justify-center h-full min-h-[400px] text-center p-8 bg-secondary/50">
               <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                  <Sparkles className="w-8 h-8 text-primary" />
               </div>
              <CardTitle className="text-2xl font-headline">Ready to Clean?</CardTitle>
              <CardDescription className="mt-2 max-w-sm">
                Upload your CSV file to get started. The tool interface will appear here once your file is loaded.
              </CardDescription>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
