import { useState, useEffect, useCallback } from 'react';
import { scanItems, createItemReply } from '@/utils/dbUtils';
import { Reply, ReplyGroup, ItemData } from '@/types'
import { useReplyContext } from '@/context/QuestionProvider';

export const useReply = (replyTableName: string) => {
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyGroup, setReplyGroup] = useState<ReplyGroup>({});
  const {
    loading,
    setLoading,
    error,
    setError
  } = useReplyContext();

  const initAllRepItems = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedReplies = await scanItems(replyTableName);
      setReplies(fetchedReplies);

      const groupedReplies: ReplyGroup = {};
      fetchedReplies.forEach(({ thread_id, question_id, text }) => {
        if (!groupedReplies[question_id]) {
          groupedReplies[question_id] = [];
        }
        groupedReplies[question_id].push({ thread_id, question_id, text });
      });
      setReplyGroup(groupedReplies);
      setError(null);
    } catch (err) {
      setError('Error fetching replies');
      console.error("Error fetching replies: ", err);
    } finally {
      setLoading(false);
    }
  }, [replyTableName]);

  useEffect(() => {
    initAllRepItems();
  }, [initAllRepItems]);

  const addReply = async (questionId: string, text: string) => {
    try {
      const thread_id = Date.now().toString();
      const newReply = { question_id: questionId, thread_id, text };
      
      await createItemReply(replyTableName, questionId, thread_id, { text });
      
      setReplies(prevReplies => [...prevReplies, newReply]);
      setReplyGroup(prevGroup => ({
        ...prevGroup,
        [questionId]: [...(prevGroup[questionId] || []), newReply]
      }));
    } catch (err) {
      setError('Error adding reply');
      console.error('Error adding reply:', err);
    }
  };

  const refreshReplies = () => {
    initAllRepItems();
  };

  return { replies, replyGroup, addReply, refreshReplies };
};