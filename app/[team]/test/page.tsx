"use client";

import { useState } from "react";
import { ClientMessage } from "@/app/_actions/ai-action";
import { useActions, useUIState } from "ai/rsc";
import { generateId } from "ai";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Force the page to be dynamic and allow streaming responses up to 30 seconds
export const dynamic = "force-dynamic";
export const maxDuration = 30;

export default function Home() {
  const [input, setInput] = useState<string>("");
  const [conversation, setConversation] = useUIState();
  const { continueConversation } = useActions();

  return (
    <div>
      <div>
        {conversation.map((message: ClientMessage) => (
          <div key={message.id}>
            {message.role}: {message.display}
          </div>
        ))}
      </div>
      <div>
        <Input
          type="text"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
          }}
        />
        <Button
          onClick={async () => {
            setConversation((currentConversation: ClientMessage[]) => [
              ...currentConversation,
              { id: generateId(), role: "user", display: input },
            ]);

            const message = await continueConversation(input);

            setConversation((currentConversation: ClientMessage[]) => [...currentConversation, message]);
          }}
        >
          Send Message
        </Button>
      </div>
    </div>
  );
}
