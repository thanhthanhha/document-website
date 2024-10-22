import React, { useState } from 'react';
import { ReplyFormProps } from '@/types';
import { useReplyContext } from '@/context/QuestionProvider';
import { EditorState, convertToRaw } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';


const ReplyForm: React.FC<ReplyFormProps> = ({
  question_id,
  onSubmit,
  Editor
}) => {
  const {
    isEditing,
    setIsEditing,
    editorRepState,
    setEditorRepState
  } = useReplyContext();

  const onEditorRepStateChange = (newEditorState: EditorState): void => {
    setEditorRepState(newEditorState);
  };

  return (
    <div className="bg-white px-5 py-3 border border-gray-300 text-md font-light">
      {isEditing && isEditing == question_id ? (
        <form onSubmit={onSubmit} className="w-full p-4 bg-white rounded-lg shadow-md">
          <div className="mb-4 hidden">
            <input
              type="text"
              id="key"
              name="key"
              defaultValue={question_id}
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="editor" className="block text-sm font-medium text-gray-700">
              Comment:
            </label>
            <Editor
              editorState={editorRepState}
              editorStyle={{
                border: "1px solid #d1d5db",
                minHeight: "5em",
                height: "7em",
                padding: "0.5em"
              }}
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              onEditorStateChange={onEditorRepStateChange}
              mention={{
                separator: " ",
                trigger: "@"
              }}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition duration-200"
          >
            Send Reply
          </button>
        </form>
      ) : (
        <div 
          onClick={() => setIsEditing(question_id)} 
          className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md cursor-pointer"
        >
          <p>Click here to add a comment</p>
        </div>
      )}
    </div>
  );
};

export default ReplyForm;