import { signIn, signOut, useSession } from "next-auth/react";

import { useRouter } from "next/router";


const Auth: React.FC = () => {
    const { data: sessionData } = useSession();
    const router = useRouter();
 
  
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <p className="text-center text-2xl text-white">
          {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
     
        </p>
        <button
          className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
          onClick={sessionData ? () => void signOut() : () => void signIn()}
        >
          {sessionData ? "Sign out" : "Sign in"}
        </button>
        {/* Link to FormList if signed in */}
        {sessionData && (
          <button onClick={() => router.push('/formlist')} className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20">
            Create Form page
          </button>
        )}
      </div>
    );
  }

  export default Auth;