import { Metadata } from 'next';
import Supportpage from "@/components/support_page";
import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { NotVercel } from "@/components/not-vercel";

export const metadata: Metadata = {
  title: 'Q&A Page',
  description: 'Page',
};

export default function QuestionPage() {
  return (
    <DocsPage
    tableOfContent={{
    header: (
        <div className="flex flex-col gap-6 mb-6">
        <NotVercel />
        </div>
    ),
    }}
  >
      <DocsBody>
        <Supportpage/>
      </DocsBody>
    </DocsPage>
  );
}