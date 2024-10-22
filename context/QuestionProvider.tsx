"use client"

import React, { createContext, useState, useContext, SetStateAction, Dispatch  } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import dynamic from 'next/dynamic';
import { EditorProps } from 'react-draft-wysiwyg';
import { ReplyContextType } from '@/types'


const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

const ReplyContext = createContext<ReplyContextType | undefined>(undefined);

export const useReplyContext = () => {
  const context = useContext(ReplyContext);
  if (context === undefined) {
    throw new Error('useReplyContext must be used within a ReplyContextProvider');
  }
  return context;
};

interface ReplyContextProviderProps {
  children: React.ReactNode;
}

export const ReplyContextProvider: React.FC<ReplyContextProviderProps> = ({ children }) => {
  const [isEditing, setIsEditing] = useState<string>("");
  const [editorRepState, setEditorRepState] = useState<EditorState>(EditorState.createEmpty());
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);


  const value = {
    Editor,
    isEditing,
    setIsEditing,
    editorRepState,
    setEditorRepState,
    error,
    setError,
    loading,
    setLoading
  };

  return (
    <ReplyContext.Provider value={value}>
      {children}
    </ReplyContext.Provider>
  );
};

export default ReplyContextProvider;