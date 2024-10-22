import { getPages } from "@/app/source";
import { createSearchAPI } from "fumadocs-core/search/server";
import { NextResponse } from 'next/server';

// export const { GET } = createSearchAPI("advanced", {
//   indexes: getPages().map(page => ({
//     title: page.data.title,
//     structuredData: page.data.structuredData,
//     id: page.url,
//     url: page.url,
//   })),
// });
// Define an empty function

// Define an empty function that returns a default response
const emptyFunction = () => {
    return NextResponse.json({ message: "No data available" }, { status: 200 });
};

// Export the function as GET
export const GET = emptyFunction;