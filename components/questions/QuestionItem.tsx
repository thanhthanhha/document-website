
import React, { useState } from 'react';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { Question, QuestionItemProps } from '@/types';
import ReplyList from '@/components/replies/ReplyList';
import { GoTrash } from "react-icons/go";


const QuestionItem: React.FC<QuestionItemProps> = ({ block, replyGroup, onReplySubmit, onClickDelete }) => {

  const question_key = block.timestamp ? block.timestamp : '';
  return (
    <div key={block.timestamp} className="mb-4">
      <details className="bg-gray-300 open:bg-amber-200 duration-300">

        <summary className="bg-inherit px-5 py-3 text-lg cursor-pointer">
          <span className="flex justify-between items-center">{block.title}<div onClick={(event) => onClickDelete(block.timestamp)}><GoTrash/></div></span>
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
        <ReplyList
            replies={replyGroup[question_key]}
            question_id={question_key}
            onSubmit={onReplySubmit}
        />
      </details>
    </div>
  );
};

export default QuestionItem;