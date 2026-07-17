import type { Metadata } from 'next';
import ChatClient from './ChatClient';

export const metadata: Metadata = {
  title: 'Assistant personnalité — Chatbot IA | UrCecret',
  description: 'Discute avec l\'assistant IA UrCecret pour mieux comprendre ta personnalité, ton type MBTI et tes fonctions cognitives.',
  alternates: { canonical: 'https://urcecret.site/chat' },
  robots: { index: false, follow: false }, // page applicative privée (compte requis)
};

export default function ChatPage() {
  return <ChatClient />;
}
