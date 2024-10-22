'use server';
import { DynamoDB } from 'aws-sdk';
import { ItemData, Question, ReplyGroup, Reply } from '@/types';
import envConfig from '@/static/global';
// Initialize DynamoDB DocumentClient
const region = envConfig.AWS_REGION ? envConfig.AWS_REGION : "";
const accessKeyId = envConfig.AWS_ACCESS_KEY_ID ? envConfig.AWS_ACCESS_KEY_ID : "";
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY ? process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY : "";


const dynamoDB = new DynamoDB.DocumentClient({
    region: region,
    credentials: {
        accessKeyId: accessKeyId, // Keep your credentials secure
        secretAccessKey: secretAccessKey, // Keep your credentials secure
    },
});

const TABLE_NAME = 'your-dynamodb-table-name'; // Replace with your table name

export const createItem = async (
    tableName: string,
    partitionKey: string,
    sortKey: string,
    data: ItemData,
    file_url?: string
): Promise<{ message: string }> => {
    const url_string = file_url ? file_url : "";
    const params = {
        TableName: tableName,
        Item: {
            question_id: partitionKey,
            timestamp: sortKey,
            file_url: url_string,
            ...data,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return { message: 'Item created successfully' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not create item: ${error.message}`);
        }
        throw new Error('Could not create item: Unknown error occurred');
    }
};

export const createItemReply = async (
    tableName: string,
    partitionKey: string,
    sortKey: string,
    data: ItemData
): Promise<{ message: string }> => {
    const params = {
        TableName: tableName,
        Item: {
            question_id: partitionKey,
            thread_id: sortKey,
            ...data,
        },
    };

    try {
        await dynamoDB.put(params).promise();
        return { message: 'Item created successfully' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not create item: ${error.message}`);
        }
        throw new Error('Could not create item: Unknown error occurred');
    }
};

// Modify an existing item in DynamoDB
export const modifyItem = async (
    tableName: string,
    partitionKey: string,
    sortKey: string,
    data: any
): Promise<any> => {
    const params = {
        TableName: tableName,
        Key: {
            question_id: partitionKey,
            timestamp: sortKey,
        },
        UpdateExpression: 'set #data = :data',
        ExpressionAttributeNames: {
            '#data': 'data', // Adjust as necessary
        },
        ExpressionAttributeValues: {
            ':data': data,
        },
        ReturnValues: 'UPDATED_NEW',
    };

    try {
        const result = await dynamoDB.update(params).promise();
        return result.Attributes;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not modify item: ${error.message}`);
        }
        throw new Error('Could not modify item: Unknown error occurred');
    }
};

// Delete an item from DynamoDB
const deleteItem_helper = async (item: Reply, replyTableName: string) => {
    try {
    await deleteReplyItem(replyTableName, item.question_id, item.thread_id);
    console.log(`Delete reply item ${item.thread_id} successfully`);
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not delete item: ${error.message}`);
        }
        throw new Error('Could not delete item: Unknown error occurred');
    }
}

export const deleteItem = async (
    tableName: string,
    partitionKey: string,
    sortKey: string
): Promise<{ message: string }> => {
    const params = {
        TableName: tableName,
        Key: {
            question_id: partitionKey,
            timestamp: sortKey,
        },
    };
    const replyTableName = envConfig.DYNAMODB_REPLY_TABLE ? envConfig.DYNAMODB_REPLY_TABLE : "";
    try {
        const fetchedReplies = await scanItems(replyTableName);
        const groupedReplies: ReplyGroup = {};
        fetchedReplies.forEach(({ thread_id, question_id, text }) => {
        if (!groupedReplies[question_id]) {
            groupedReplies[question_id] = [];
        }
        groupedReplies[question_id].push({ thread_id, question_id, text });
        });
        await dynamoDB.delete(params).promise();
        console.log(`Delete item ${sortKey} successfully`);
        console.log(`Delete item ${sortKey} reply items`);
        if (groupedReplies[sortKey] && groupedReplies[sortKey].length > 0) {
            groupedReplies[sortKey].forEach(item => deleteItem_helper(item, replyTableName)) 
        }
        return { message: 'Item deleted successfully' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not delete item: ${error.message}`);
        }
        throw new Error('Could not delete item: Unknown error occurred');
    }
};

export const deleteReplyItem = async (
    tableName: string,
    partitionKey: string,
    sortKey: string
): Promise<{ message: string }> => {
    const params = {
        TableName: tableName,
        Key: {
            question_id: partitionKey,
            thread_id: sortKey,
        },
    };

    try {
        await dynamoDB.delete(params).promise();
        console.log(`Delete reply item ${sortKey}`)
        return { message: 'Reply item deleted successfully' };
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not delete reply item: ${error.message}`);
        }
        throw new Error('Could not delete reply item: Unknown error occurred');
    }
};

//Find Item

export const findItem = async (
    tableName: string,
    partitionKey: string,
    sortKey: string
): Promise<Question> => {
    const params = {
        Key: {
            question_id: partitionKey,
            timestamp: sortKey
        },
        TableName: tableName,
    };

    try {
        const result = await dynamoDB.get(params).promise();
        const formated_result:  Question = {
            ...(result.Item as Question)
        }
        return formated_result; // Cast to Question array
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not get item ${sortKey}: ${error.message}`);
        }
        throw new Error(`Could not get item ${sortKey}: Unknown error occurred`);
    }
};

// Get all items from DynamoDB
export const getAllItems = async (
    tableName: string,
    partitionKey: string
): Promise<Question[]> => {
    const params = {
        KeyConditionExpression: 'question_id = :question_id',
        ExpressionAttributeValues: {
            ':question_id': partitionKey,
        },
        TableName: tableName,
    };

    try {
        const result = await dynamoDB.query(params).promise();
        return result.Items as Question[]; // Cast to Question array
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not get items: ${error.message}`);
        }
        throw new Error('Could not get items: Unknown error occurred');
    }
};


export const scanItems = async (
    tableName: string,
): Promise<any[]> => {
    const params: DynamoDB.ScanInput = {
        TableName: tableName,
        ExclusiveStartKey: undefined 
    };

    const scanResults: any[] = [];
    let items;

    try {

        do{
            items = await dynamoDB.scan(params).promise();
            if (items.Items) {
                scanResults.push(...items.Items); // Use spread syntax for cleaner code
            }
            params.ExclusiveStartKey = items.LastEvaluatedKey || undefined; 
        }while(typeof items.LastEvaluatedKey !== "undefined");

        return scanResults;
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Could not get items: ${error.message}`);
        }
        throw new Error('Could not get items: Unknown error occurred');
    }
};