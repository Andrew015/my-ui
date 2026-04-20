"use client";

import { useState } from "react";

type ChatRoomProps = {
  ownerName: string;
  itemStatus?: "active" | "offline" | "done";
};

type ChatMessage = {
  id: string;
  role: "other" | "me";
  text: string;
  sentAt: string;
};

function formatTimeLabel(date: Date) {
  const hour = date.getHours();
  const period = hour >= 12 ? "下午" : "上午";
  return `${period} ${String(hour).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
}

function formatGroupLabel(date: Date) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
  const dayDiff = Math.round((today - target) / (24 * 60 * 60 * 1000));
  if (dayDiff === 0) return "今天";
  if (dayDiff === 1) return "昨天";
  return `${date.getMonth() + 1}月${date.getDate()}日`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function ChatRoom({ ownerName, itemStatus = "active" }: ChatRoomProps) {
  const initialTimeA = new Date();
  initialTimeA.setHours(14, 32, 0, 0);
  const initialTimeB = new Date(initialTimeA);
  initialTimeB.setMinutes(initialTimeA.getMinutes() + 1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "1",
      role: "other",
      text: "你好，物品还在的，可以先看看详情～",
      sentAt: initialTimeA.toISOString(),
    },
    {
      id: "2",
      role: "me",
      text: "好的，我想确认一下是否支持当面验货。",
      sentAt: initialTimeB.toISOString(),
    },
  ]);

  const handleSend = () => {
    if (itemStatus !== "active") return;
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const replyAt = new Date(now);
    replyAt.setMinutes(now.getMinutes() + 1);

    setMessages((prev) => [
      ...prev,
      { id: `${Date.now()}`, role: "me", text, sentAt: now.toISOString() },
      {
        id: `${Date.now()}-reply`,
        role: "other",
        text: `收到，我是 ${ownerName}，可以约今晚小区门口当面看。`,
        sentAt: replyAt.toISOString(),
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col px-4 pb-4">
      <div className="flex-1 space-y-3 overflow-y-auto py-4">
        {messages.map((message, index) => (
          <div key={message.id} className={message.role === "me" ? "text-right" : "text-left"}>
            {(() => {
              const currDate = new Date(message.sentAt);
              const prevDate = messages[index - 1] ? new Date(messages[index - 1].sentAt) : null;
              const shouldShowGroup = !prevDate || !isSameDay(currDate, prevDate);
              return shouldShowGroup ? (
                <div className="mb-3 text-center">
                  <span className="inline-flex rounded-full bg-stone-200/80 px-3 py-1 text-xs text-stone-500">
                    {formatGroupLabel(currDate)}
                  </span>
                </div>
              ) : null;
            })()}
            <div className={`flex ${message.role === "me" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[78%] rounded-2xl px-3 py-2 text-sm leading-6 ${
                  message.role === "me"
                    ? "bg-brand text-brand-foreground"
                    : "bg-stone-100 text-stone-700 ring-1 ring-stone-200/80"
                }`}
              >
                {message.text}
              </div>
            </div>
            <p className="mt-1 text-xs text-stone-400">
              {formatTimeLabel(new Date(message.sentAt))}
            </p>
          </div>
        ))}
      </div>

      {itemStatus !== "active" ? (
        <div className="mt-2 rounded-2xl bg-white px-3 py-2 text-xs text-stone-500 ring-1 ring-orange-100/90">
          {itemStatus === "done"
            ? "该商品已完成，当前聊天仅作历史记录展示"
            : "该商品已下架，当前聊天仅作历史记录展示"}
        </div>
      ) : null}
      <div className="mt-2 flex items-center gap-2 rounded-3xl bg-white p-2 ring-1 ring-orange-100/90">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="说点什么，和对方沟通…"
          className="min-w-0 flex-1 bg-transparent px-1 text-sm text-stone-700 placeholder:text-stone-400 outline-none"
          disabled={itemStatus !== "active"}
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
          disabled={itemStatus !== "active"}
          className="shrink-0 rounded-xl bg-brand px-4 py-2 text-sm font-medium text-brand-foreground transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          发送
        </button>
      </div>
    </div>
  );
}
