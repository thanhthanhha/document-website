"use client"

import React, { useState, useEffect } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import QuestionItem from './QuestionItem';
import QuestionForm from './QuestionsForm';
import { useQuestions } from '@/hooks/useQuestions';
import { useReply } from '@/hooks/useReply';
import { useReplyContext } from '@/context/QuestionProvider';
import { Question, AddQuestion } from '@/types';
import envConfig from '@/static/global';
import { Loading } from "@/components/loading";
import { Error } from "@/components/error";

const QuestionList: React.FC = () => {
  const [title, setTitle] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const question_table = envConfig.DYNAMODB_QUESTION_TABLE ? envConfig.DYNAMODB_QUESTION_TABLE : '';
  const reply_table = envConfig.DYNAMODB_REPLY_TABLE ? envConfig.DYNAMODB_REPLY_TABLE : '';
  const partition_key = envConfig.DYNAMODB_QUESTION_TABLE_PARTITION ? envConfig.DYNAMODB_QUESTION_TABLE_PARTITION : '';

  const {
    Editor,
    loading,
    error,
    editorRepState,
    setEditorRepState
  } = useReplyContext();
  const { questions, addQuestion, refreshQuestions , deleteQuestion } = useQuestions(question_table, partition_key);
  const { replies, replyGroup, addReply, refreshReplies } = useReply(reply_table);

  useEffect(() => {
    initPage();
  }, []);

  const initPage = async () => {
    try {
      await refreshQuestions();
      await refreshReplies();
    } catch (error) {
      console.error("Error fetching files: ", error);
    }
  };

  const handleDeleteItem = async (question_id: string) => {
    deleteQuestion(question_id)
  };

  const handleQuestionSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rawContent = convertToRaw(editorState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent);
    const content = htmlContent;
    
    const newQuestion: AddQuestion = {
      title,
      text: content
    };

    await addQuestion(newQuestion, file);
    setTitle('');
    setEditorState(EditorState.createEmpty());
    setFile(null);
  };

  const handleReplySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const questionId = formData.get('key') as string;
    const rawContent = convertToRaw(editorRepState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent);
    const content = htmlContent;

    await addReply(questionId, content);
    setEditorRepState(EditorState.createEmpty());
  };

  if (loading) return <Loading/>;
  if (error) return <Error error_msg={error}/>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Questions</h2>
      <div className="mt-8">
        { questions && questions.length > 0 ? (questions.map((question) => (
          <QuestionItem
            key={question.timestamp}
            block={question}
            replyGroup={replyGroup}
            onReplySubmit={handleReplySubmit}
            onClickDelete={handleDeleteItem}
          />
        ))) : (
            <p>No questions available.</p>
        )}
        <QuestionForm
            onSubmit={handleQuestionSubmit}
            editorState={editorState}
            setEditorState={setEditorState}
            title={title}
            setTitle={setTitle}
            file={file}
            setFile={setFile}
            Editor={Editor}
        />
      </div>
    </div>
  );
};

export default QuestionList;