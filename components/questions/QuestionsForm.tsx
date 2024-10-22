import React, { useState, ChangeEvent } from 'react';
import { EditorState, convertToRaw } from 'draft-js';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { QuestionFormProps, Question } from '@/types';

const QuestionForm: React.FC<QuestionFormProps> = ({ 
  onSubmit,
  editorState,
  setEditorState,
  title,
  setTitle,
  file,
  setFile,
  Editor
}) => {

  const onEditorStateChange = (newEditorState: EditorState): void => {
    setEditorState(newEditorState);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <form onSubmit={onSubmit} className="w-full p-4 bg-white rounded-lg shadow-md border border-gray-300 mt-28">
      <div className="mb-4">
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title:
        </label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="editor" className="block text-sm font-medium text-gray-700">
          Content:
        </label>
        <Editor
          editorState={editorState}
          onEditorStateChange={onEditorStateChange}
          editorStyle={{
            border: "1px solid #d1d5db",
            minHeight: "7em",
            height: "8em",
            padding: "0.5em"
          }}
          toolbarClassName="toolbarClassName"
          wrapperClassName="wrapperClassName"
          editorClassName="editorClassName"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="file" className="block text-sm font-medium text-gray-700">
          Attach a file:
        </label>
        <input
          type="file"
          id="file"
          onChange={handleFileChange}
          className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-blue-500"
        />
        {file && (
          <p className="mt-1 text-sm text-gray-500">Selected file: {file.name}</p>
        )}
      </div>

      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
      >
        Submit Question
      </button>
    </form>
  );
};

export default QuestionForm;