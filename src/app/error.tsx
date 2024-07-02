"use client";

import { NextPageContext } from "next";
import Link from "next/link";

interface ErrorProps {
  statusCode: number;
}

const Error = ({ statusCode }: ErrorProps) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4 text-gray-800 dark:bg-gray-900 dark:text-gray-200">
      <h1 className="text-4xl font-bold">{statusCode}</h1>
      <p className="mt-4 text-lg">
        {statusCode
          ? `An error ${statusCode} occurred on server`
          : "An error occurred on client"}
      </p>
      <Link href="/">Go back home</Link>
    </div>
  );
};

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default Error;
