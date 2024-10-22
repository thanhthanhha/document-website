import React from 'react';
import { ReplyItemProps } from '@/types'

const ReplyItem: React.FC<ReplyItemProps> = ({ text }) => {
  return (
    <div className="bg-white px-5 py-3 border border-gray-300 text-sm font-light">
      <div dangerouslySetInnerHTML={{ __html: text }} />
    </div>
  );
};

export default ReplyItem;