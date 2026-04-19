"use client";

import { useState } from "react";

type ChatRoomProps = {
  ownerName: string;
};

type ChatMessage = {
  id: string;
  role: "other" | "me";
  text: string;
};

export function ChatRoom({ ownerName }: ChatRoomProps) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "1", role: "other", text: "你好，物品还在的，可以先看看详情～" },
    { id: "2", role: "me", text: "好的，我想确认一下是否支持当面验货。" },
  ]);

  const handleSend = () => {
    const text = input.trim();
    if (!text) return;

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, role: "me", text },
      {
        id: `${Date.now()}-reply`,
        role: "other",
        text: `收到，我是 ${ownerName}，可以约今晚小区门口当面看。`,
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <div className="flex-1 space-y-3 overflow-y-auto py-3">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === "me" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                message.role === "me"
                  ? "bg-brand text-brand-foreground"
                  : "bg-white text-stone-700 ring-1 ring-orange-100/90"
              }`}
            >
              {message.text}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-2 flex items-center gap-2 rounded-2xl bg-white p-2 ring-1 ring-orange-100/90">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="说点什么，和对方沟通..."
          className="min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-700 placeholder:text-stone-400 outline-none"
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              handleSend();
            }
          }}
        />
        <button
          type="button"
          onClick={handleSend}
          className="shrink-0 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover"
        >
          发送
        </button>
      </div>
    </div>
  );
}
