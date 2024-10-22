import React from 'react';
import { ReplyContextProvider } from '@/context/QuestionProvider';
import QuestionList from '@/components/questions/QuestionList';

const Supportpage: React.FC = () => {

  return (
    <ReplyContextProvider>
      <QuestionList/>
    </ReplyContextProvider>
  );
};

export default Supportpage;