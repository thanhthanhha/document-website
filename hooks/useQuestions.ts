import { useState, useEffect, useCallback } from 'react';
import { getAllItems, createItem, findItem, deleteItem } from '@/utils/dbUtils';
import { AddQuestion, Question } from '@/types';
import { uploadFileToS3 } from '@/utils/s3Utils';
import { deleteFile } from '@/utils/s3Utils_server';
import { useReplyContext } from '@/context/QuestionProvider';
import { existsSync } from 'fs';
import envConfig from '@/static/global';

export const useQuestions = (tableName: string, partitionText: string) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const bucket = envConfig.S3_UPLOAD_BUCKET ? envConfig.S3_UPLOAD_BUCKET : '';
  const region = envConfig.AWS_REGION ? envConfig.AWS_REGION : '';
  const prefix_uploads = envConfig.S3_UPLOAD_BUCKET_PREFIX ? envConfig.S3_UPLOAD_BUCKET_PREFIX : '';

  const {
    loading,
    setLoading,
    error,
    setError
  } = useReplyContext();

  const initAllItems = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedItems: Question[] = await getAllItems(tableName, partitionText);
      setQuestions(fetchedItems);
      setError(null);
    } catch (err) {
      setError('Error fetching questions');
      setLoading(true);
      console.error("Error fetching items: ", err);
    } finally {
      setLoading(false);
    }
  }, [tableName, partitionText]);

  const addQuestion = async (questionData: AddQuestion, file: File | null) => {
    try {
      const timestamp = Date.now().toString();
      const question_id = partitionText;
      const unique_filename = file ? `${timestamp}-${file.name}` : "";
      const file_url = file ? `https://${bucket}.s3.${region}.amazonaws.com/${prefix_uploads}/${unique_filename}` : "";

      await createItem(tableName, partitionText, timestamp, questionData, file_url);
      setQuestions(prevQuestions => [...prevQuestions, { ...questionData, timestamp, question_id, file_url }]);
      if (file) {
        addQuestionFile(file, timestamp, unique_filename);
      }
    } catch (err) {
      setError('Error adding question');
      console.error('Error adding question:', err);
    }
  };

  const deleteQuestion = async (question_id: string) => {
    try {
      const question_item = await findItem(tableName, partitionText, question_id);
      console.log(`fetch item ${question_item.timestamp}`);
      await deleteItem(tableName, partitionText, question_id);
      if (question_item.file_url) {
        console.log(`delete file ${question_item.file_url}`);
        const urlObj = new URL(question_item.file_url);
        const s3_file_key = urlObj.pathname.slice(1);
        await deleteFile(bucket, s3_file_key)
      }
      setQuestions(prevQuestions => 
        prevQuestions.filter(question => question.timestamp !== `${question_id}`)
      );
    } catch (err) {
      setError('Error adding question');
      console.error('Error adding question:', err);
    }
  };

  const addQuestionFile = async (file: File, timestamp: string, unique_filename: string) => {
    await uploadFileToS3(file, unique_filename);
    console.log('Attached file uploaded successfully:', unique_filename);
  }

  const refreshQuestions = () => {
    initAllItems();
  };

  return { questions, addQuestion, refreshQuestions, deleteQuestion };
};