import { EditorState } from 'draft-js';
import { EditorProps } from 'react-draft-wysiwyg';

export interface Question {
    question_id: string;
    timestamp: string;
    file_url: string;
    text: string;
    title: string;
}

export interface AddQuestion {
    text: string;
    title: string;
}

export interface Reply {
    question_id: string;
    thread_id: string;
    text: string;
}

export interface AddReply {
    question_id: string;
    thread_id?: string;
    text: string;
}

export interface ReplyGroup {
    [key: string]: Reply[];
  }
  

//Flexible Data
export interface ItemData {
    [key: string]: any; // Allow additional properties
}

export interface EnvConfig {
    [key: string]: string; // Allow additional properties
}

//S3 Data
export interface S3Object {
    Key: string;
}
  
export interface FileWithContent {
name: string;
content: any; // Adjust the type as necessary for your content
url?: string;
}

//Reply Components
export interface ReplyFormProps {
    question_id: string;
    onSubmit: (e: React.FormEvent) => void;
    Editor: React.ComponentType<EditorProps>;
}

export interface ReplyItemProps {
    text: string;
    key: string;
}

export interface ReplyListProps {
    replies: Reply[];
    question_id: string;
    onSubmit: (event: React.FormEvent) => void;
  }

export interface ReplyContextType {
    Editor: React.ComponentType<EditorProps>;
    isEditing: string;
    setIsEditing: React.Dispatch<React.SetStateAction<string>>;
    editorRepState: EditorState;
    setEditorRepState: React.Dispatch<React.SetStateAction<EditorState>>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    error: string | null;
    setError: React.Dispatch<React.SetStateAction<string | null>>;
}

//Question Component

export interface QuestionFormProps {
    onSubmit: (event: React.FormEvent) => void;
    editorState: EditorState;
    setEditorState: React.Dispatch<React.SetStateAction<EditorState>>;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
    file: File | null;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    Editor: React.ComponentType<EditorProps>;
  }

  export interface QuestionItemProps {
    block: Question;
    replyGroup: {
      [key: string]: Reply[];
    };
    onReplySubmit: (event: React.FormEvent) => void;
    onClickDelete: (question_id: string) => void;
  }
