import React from 'react';

import ReplyItem from './ReplyItem';
import ReplyForm from './ReplyForm';
import { ReplyItemProps as Reply, ReplyListProps } from '@/types';
import { useReplyContext } from '@/context/QuestionProvider';


const ReplyList: React.FC<ReplyListProps> = ({
  replies,
  question_id,
  onSubmit
}) => {
    const {
        Editor
    } = useReplyContext();

  return (
    <div className="bg-white px-5 py-3 border border-gray-300 text-md font-light">
      <h3 className="font-medium mb-2">Replies:</h3>
      <div className="bg-white px-5 py-3 text-sm font-light">
        {replies && replies.length > 0 ? (
          replies.map((reply) => (
            <ReplyItem key={reply.thread_id} text={reply.text} />
          ))
        ) : (
          <p>No replies yet.</p>
        )}
      </div>
      <div className="mt-4">
        <h4 className="font-medium mb-2">Add a reply:</h4>
        <ReplyForm
          question_id={question_id}
          onSubmit={onSubmit}
          Editor={Editor}
        />
      </div>
    </div>
  );
};

export default ReplyList;