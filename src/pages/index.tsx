import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "../utils/api";
import { Layout } from "@/components/layout";

const Home: NextPage = () => {
  const hello = api.example.hello.useQuery({ text: "from tRPC" });

  return (
    <Layout>
      <Head>
        <title>Centraal</title>
        <meta
          name="description"
          content="Centraal App - Open Source Dashboard"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="tracking-tightsm:text-[5rem] text-5xl font-extrabold">
            Welcome to Centraal
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="hover:bg-slate/20 flex max-w-xs flex-col gap-4 rounded-xl bg-slate-400/10 p-4  hover:bg-slate-400/20"
              href="/dashboard"
            >
              <h3 className="text-2xl font-bold">Dashboard →</h3>
              <div className="text-lg">
                The application lives here. Right now, its only layouts and
                static components.
              </div>
            </Link>
            <Link
              className="hover:bg-slate/20 flex max-w-xs flex-col gap-4 rounded-xl bg-slate-400/10 p-4  hover:bg-slate-400/20"
              href="https://create.t3.gg/en/introduction"
              target="_blank"
            >
              <h3 className="text-2xl font-bold">Documentation →</h3>
              <div className="text-lg">
                Learn more about Create T3 App, the libraries it uses, and how
                to deploy it.
              </div>
            </Link>
          </div>
          <div className="flex flex-col items-center gap-2">
            {/* <p className="text-2xl ">
              {hello.data ? hello.data.greeting : "Loading tRPC query..."}
            </p> */}
            <AuthShowcase />
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl ">
        {sessionData && <span>Logg ed in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-slate-400/10 px-10 py-3 font-semibold  no-underline transition hover:bg-slate-400/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
