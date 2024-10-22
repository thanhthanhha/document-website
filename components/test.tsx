
import React, { useState } from 'react';
import { EditorState } from 'draft-js';
import dynamic from 'next/dynamic';
import draftToHtml from 'draftjs-to-html';
import { EditorProps } from 'react-draft-wysiwyg';
import { createItemReply } from '@/utils/dbUtils';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
);

interface Reply {
  thread_id: string;
  text: string;
}

interface QuestionItemProps {
  block: {
    timestamp: string;
    title: string;
    text: string;
    file_url?: string;
  };
  replyGroup: {
    [key: string]: Reply[];
  };
}

const QuestionItem: React.FC<QuestionItemProps> = ({ block, replyGroup }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editorRepState, setEditorRepState] = useState<EditorState>(EditorState.createEmpty());

  const onEditorRepStateChange = (newEditorState: EditorState): void => {
    setEditorRepState(newEditorState);
  };

  const handleSubmitReply = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const rawContent = convertToRaw(editorRepState.getCurrentContent());
    const htmlContent = draftToHtml(rawContent);
    const content = htmlContent;
    const timestamp = Date.now().toString();
    const thread_id = timestamp;
    const question_id = block.timestamp;

    const jsonData = {
      text: content,
    };

    try {
      await createItemReply('netxjs-app-reply', question_id, thread_id, jsonData);
      console.log('Reply uploaded successfully id:', thread_id);
      
      // Reset form and update UI
      setEditorRepState(EditorState.createEmpty());
      setIsEditing(false);
      // You might want to add a function to update the replyGroup state here
    } catch (error) {
      console.error('Error uploading reply:', error);
    }
  };

  return (
    <div className="mb-4">
      <details className="bg-gray-300 open:bg-amber-200 duration-300">
        <summary className="bg-inherit px-5 py-3 text-lg cursor-pointer">
          {block.title}
        </summary>
        <div className="bg-white px-5 py-3 border border-gray-300 text-sm font-light">
          <div dangerouslySetInnerHTML={{ __html: block.text }} />
        </div>
        {block.file_url && (
          <div className="bg-white px-5 py-3 border border-gray-300 text-md font-light">
            Attachments:
            <div className="bg-white px-5 py-3 text-sm font-light">
              <a
                href={block.file_url}
                className="text-blue-500 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {block.file_url}
              </a>
            </div>
          </div>
        )}
        <div className="bg-white px-5 py-3 border border-gray-300 text-md font-light">
          Replies:
          <div className="bg-white px-5 py-3 text-sm font-light">
            {replyGroup && replyGroup[block.timestamp] ? (
              replyGroup[block.timestamp].map((rep: Reply) => (
                <div key={rep.thread_id} className="bg-white px-5 py-3 border border-gray-300 text-sm font-light">
                  <div dangerouslySetInnerHTML={{ __html: rep.text }} />
                </div>
              ))
            ) : null}
          </div>
        </div>
        <div className="bg-white px-5 py-3 border border-gray-300 text-md font-light">
          {isEditing ? (
            <form onSubmit={handleSubmitReply} className="w-full p-4 bg-white rounded-lg shadow-md">
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
            <div onClick={() => setIsEditing(true)} className="max-w-lg mx-auto p-4 bg-white rounded-lg shadow-md">
              <p>Click here to add a comment</p>
            </div>
          )}
        </div>
      </details>
    </div>
  );
};

export default QuestionItem;