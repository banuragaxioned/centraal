import React, { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "@/components/ui/button";

import NotepadCards from "./notepad-cards";
import { ScrollArea } from "./ui/scroll-area";

const NotepadResponse = ({ aiResponses, setAiResponses, projects, handleSubmit }: any) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (aiResponses.length > 0) {
      setOpen(true);
    }
    if (open && aiResponses.length === 0) {
      setOpen(false);
    }
  }, [aiResponses, open]);

  useEffect(() => {
    if (!open) {
      setAiResponses([]);
    }
  }, [open, setAiResponses]);

  const handleRemove = (id: number) => {
    setAiResponses(aiResponses.filter((response: any) => response.id !== id));
  };

  const renderTimeCards = aiResponses?.map((response: any, index: number) => {
    return (
      <NotepadCards
        projects={projects}
        data={response}
        handleRemove={handleRemove}
        handleSubmit={handleSubmit}
        key={response.project.id}
        id={index + 1}
      />
    );
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        className="max-w-[calc(100%-44px)] overflow-y-auto p-0 lg:max-w-4xl"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onInteractOutside={(e) => e.preventDefault()}
      >
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="flex items-center justify-between">
            <div className="flex items-start gap-2">Add time entries</div>
            <Button size="sm" className={`mr-5 ${aiResponses.length > 1 ? "visible" : "invisible"}`} disabled>
              Submit all
            </Button>
          </DialogTitle>
          <DialogDescription className="mt-0 w-[85%] text-left">
            This is an AI-generated response and might be inaccurate. You can click on the inputs below to update the
            response.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[302px]">
          <div className="grid grid-cols-12 justify-center gap-3 px-6 pb-6 pt-3">{renderTimeCards}</div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default NotepadResponse;
