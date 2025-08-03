
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
import { UploadCloud, File as FileIcon, X, BrainCircuit, Sparkles, Loader2, Download, Wand2, RefreshCw, Zap } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type CleaningStrategy = {
  id: string;
  label: string;
  description: string;
};

type UserPlan = {
  plan: string;
  rows_used: number;
  rows_limit: number;
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
  const rows = text.trim().split('\n');
  return rows.map(row => row.split(',').map(cell => cell.trim()));
};

const stringifyCsv = (data: string[][]): string => {
  return data.map(row => row.join(',')).join('\n');
};

export default function ToolClient() {
  const { toast } = useToast();
  const supabase = createClient();
  const [user, setUser] = useState<any>(null);
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [fileContent, setFileContent] = useState<string>("");
  const [csvData, setCsvData] = useState<string[][]>([]);
  const [processedData, setProcessedData] = useState<string[][] | null>(null);
  const [selectedStrategies, setSelectedStrategies] = useState<Set<string>>(new Set());
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const fetchUserPlan = useCallback(async (userId: string) => {
    const { data: userExtended, error } = await supabase
      .from('users_extended')
      .select('plan, rows_used, rows_limit')
      .eq('user_id', userId)
      .single();
    if (userExtended) {
      setUserPlan(userExtended);
    }
    if (error) {
        console.error("Error fetching user plan details: ", error);
        toast({
          title: "Could not load your plan",
          description: "Your usage details could not be loaded. Please try refreshing.",
          variant: "destructive"
        })
    }
  }, [supabase, toast]);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        fetchUserPlan(user.id);
      }
    };
    getUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      if (currentUser) {
        fetchUserPlan(currentUser.id);
      } else {
        setUserPlan(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };

  }, [supabase, fetchUserPlan]);

  const previewData = useMemo(() => csvData.slice(0, 5), [csvData]);
  const processedPreviewData = useMemo(() => processedData ? processedData.slice(0, 5) : [], [processedData]);

  const fetchAiSuggestions = useCallback(async (content: string) => {
    setIsLoadingAi(true);
    try {
      const csvSample = content.split('\n').slice(0, 10).join('\n');
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
  }, [toast]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Please log in",
        description: "You need to be logged in to upload files.",
      });
      return;
    }
    const uploadedFile = acceptedFiles[0];
    if (uploadedFile) {
      if (uploadedFile.size > 10 * 1024 * 1024) { // 10MB limit
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
  }, [toast, fetchAiSuggestions, user]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'text/csv': ['.csv'] }, multiple: false });

  const handleStrategyToggle = (id: string, checked: boolean) => {
    setSelectedStrategies(prev => {
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
    let temp_data = JSON.parse(JSON.stringify(data)); // Deep copy
    if (selectedStrategies.has('trim_whitespace')) {
      temp_data = temp_data.map(row => row.map(cell => cell.trim()));
    }
    if (selectedStrategies.has('standardize_capitalization')) {
      temp_data = temp_data.map(row => row.map(cell => cell.toLowerCase().replace(/(^|\s)\S/g, l => l.toUpperCase())));
    }
    if (selectedStrategies.has('phone_cleanup')) {
      temp_data = temp_data.map(row => row.map(cell => cell.replace(/(\d{3})[^\d]*(\d{3})[^\d]*(\d{4})/, '($1) $2-$3')));
    }
    if (selectedStrategies.has('date_standardization')) {
      temp_data = temp_data.map(row => row.map(cell => {
        const d = new Date(cell);
        if (!isNaN(d.getTime())) {
          return d.toISOString().split('T')[0];
        }
        return cell;
      }));
    }
    if (selectedStrategies.has('remove_special_chars')) {
      temp_data = temp_data.map(row => row.map(cell => cell.replace(/[^a-zA-Z0-9\s@.-]/g, '')));
    }
    if (selectedStrategies.has('financial_cleaner')) {
      temp_data = temp_data.map(row => row.map(cell => cell.replace(/[$,€£]/g, '')));
    }
    if (selectedStrategies.has('remove_duplicates')) {
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
    if (!user || !userPlan) {
      toast({ variant: "destructive", title: "Authentication Error", description: "Could not verify user details." });
      return;
    }

    const newRows = csvData.length;
    if (userPlan.rows_used + newRows > userPlan.rows_limit) {
      toast({
        variant: "destructive",
        title: "Usage Limit Reached",
        description: `You can only process ${userPlan.rows_limit - userPlan.rows_used} more rows. Please upgrade your plan for more.`,
      });
      return;
    }

    setIsProcessing(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 200);

    // Simulate processing delay
    setTimeout(async () => {
      const transformedData = applyTransformations(csvData);
      setProcessedData(transformedData);
      
      const { error } = await supabase
        .from('users_extended')
        .update({ rows_used: userPlan.rows_used + newRows })
        .eq('user_id', user.id);

      if (error) {
        console.error("Error updating usage:", error);
        toast({ variant: "destructive", title: "Error", description: "Failed to update your usage data." });
      } else {
        setUserPlan(prev => prev ? { ...prev, rows_used: prev.rows_used + newRows } : null);
      }

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
    const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `cleaned_${file?.name || 'data.csv'}`);
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
      <div className="text-center mb-12">
        <h2 className="font-headline text-3xl font-bold tracking-tight text-foreground sm:text-4xl">The Cleaning Tool</h2>
        <p className="mt-4 text-lg text-muted-foreground">Upload your file and see the magic happen.</p>
      </div>

      <Card className="w-full shadow-xl">
        {!file ? (
          <CardContent className="p-0">
            <div {...getRootProps()} className={`flex flex-col items-center justify-center p-12 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors ${isDragActive ? 'border-primary bg-primary/10' : ''}`}>
              <input {...getInputProps()} />
              <UploadCloud className="w-12 h-12 text-muted-foreground mb-4" />
              <p className="font-semibold">{user ? "Drag & drop a CSV file here, or click to select a file" : "Please log in to use the tool"}</p>
              <p className="text-sm text-muted-foreground mt-2">Up to 10MB free</p>
            </div>
             {user && userPlan && (
                <div className="p-4 border-t text-center text-sm text-muted-foreground">
                  Your plan: <span className="font-semibold text-primary capitalize">{userPlan.plan}</span>. 
                  Usage: <span className="font-semibold">{userPlan.rows_used.toLocaleString()} / {userPlan.rows_limit.toLocaleString()} rows</span> used.
                  {userPlan.plan === 'free' && (
                     <Button asChild variant="link" className="p-1 h-auto text-accent">
                        <a href="#pricing">
                          Upgrade to Pro <Zap className="ml-1 h-4 w-4" />
                        </a>
                     </Button>
                  )}
                </div>
              )}
          </CardContent>
        ) : (
          <div>
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <FileIcon className="w-6 h-6 text-primary" />
                <div>
                  <CardTitle className="text-xl">{file.name}</CardTitle>
                  <CardDescription>{(file.size / 1024).toFixed(2)} KB - {csvData.length} rows</CardDescription>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleReset}>
                <RefreshCw className="w-5 h-5" />
              </Button>
            </CardHeader>
            <Separator />
            <div className="grid grid-cols-1 lg:grid-cols-3">
              <div className="lg:col-span-1 lg:border-r">
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Wand2 className="w-5 h-5 text-primary" /> Pre-built Templates</h3>
                    <div className="space-y-3 mt-4">
                      {prebuiltTemplates.map(item => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <Checkbox id={item.id} onCheckedChange={(c) => handleStrategyToggle(item.id, c as boolean)} />
                          <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={item.id}>{item.label}</Label>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2"><BrainCircuit className="w-5 h-5 text-primary" /> AI Suggestions</h3>
                    <div className="space-y-3 mt-4">
                      {isLoadingAi ? (
                        <div className="flex items-center text-muted-foreground"><Loader2 className="w-4 h-4 mr-2 animate-spin" />Analyzing...</div>
                      ) : aiSuggestions.length > 0 ? (
                        aiSuggestions.map(item => (
                          <div key={item} className="flex items-center space-x-3">
                            <Checkbox id={item} onCheckedChange={(c) => handleStrategyToggle(item, c as boolean)} />
                            <Label htmlFor={item}>{item}</Label>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground">No specific suggestions found.</p>
                      )}
                    </div>
                  </div>
                   <Separator />
                  <div>
                    <h3 className="text-lg font-semibold flex items-center gap-2"><Sparkles className="w-5 h-5 text-primary" /> Custom Cleanup</h3>
                    <div className="space-y-3 mt-4">
                       {customOptions.map(item => (
                        <div key={item.id} className="flex items-start space-x-3">
                          <Checkbox id={item.id} onCheckedChange={(c) => handleStrategyToggle(item.id, c as boolean)} />
                           <div className="grid gap-1.5 leading-none">
                            <Label htmlFor={item.id}>{item.label}</Label>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2 p-6">
                 <Tabs defaultValue="original" className="w-full">
                  <TabsList>
                    <TabsTrigger value="original">Original ({previewData.length-1} rows)</TabsTrigger>
                    <TabsTrigger value="processed" disabled={!processedData}>Processed</TabsTrigger>
                  </TabsList>
                  <TabsContent value="original" className="mt-4">
                    {previewData.length > 0 ? renderTable(previewData) : <p>No data to display.</p>}
                  </TabsContent>
                  <TabsContent value="processed" className="mt-4">
                    {processedPreviewData.length > 0 ? renderTable(processedPreviewData) : <p>Process the file to see the result.</p>}
                  </TabsContent>
                </Tabs>
                
                {isProcessing && <Progress value={progress} className="w-full mt-4" />}
                
                <div className="mt-6 flex gap-4">
                  <Button onClick={processFile} disabled={isProcessing || selectedStrategies.size === 0} className="w-full" size="lg">
                    {isProcessing ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Processing...</> : "Process File"}
                  </Button>
                  <Button onClick={downloadFile} disabled={!processedData || isProcessing} className="w-full" size="lg" variant="outline">
                    <Download className="mr-2 h-4 w-4" /> Download
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Card>
    </section>
  );
}
