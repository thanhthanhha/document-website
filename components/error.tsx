

import { DocsPage, DocsBody, DocsTitle } from "fumadocs-ui/page";
import { NotVercel } from "@/components/not-vercel";

export function Error({ error_msg }: { error_msg: string }) {
    return (
            <>
                <style jsx>{`
                    * {
                    font-family: "Whitney SSm A", "Whitney SSm B", "Helvetica Neue", Helvetica, Arial, Sans-Serif;
                    }

                    .error-text {
                    font-size: 130px;
                    }

                    @media (min-width: 768px) {
                    .error-text {
                        font-size: 220px;
                    }
                    }
                `}</style>

                <div className="h-screen w-screen bg-blue-600 flex justify-center items-center flex-wrap">
                    <p className="font-sans text-white error-text">404</p>
                </div>

                <div className="absolute w-screen bottom-0 mb-6 text-white text-center font-sans text-xl">
                    <span className="opacity-50">{error_msg}</span>
                </div>
            </>
    );
  }
  
  