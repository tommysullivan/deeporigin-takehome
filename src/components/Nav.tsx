import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link } from "@tanstack/react-router";

export const Nav = () => {
  return (
    <>
      <SignedIn>
        <div className="flex flex-row justify-end items-center gap-5">
          <Link to="/" className="text-blue-300 hover:underline">
            Dashboard
          </Link>
          <UserButton />
        </div>
      </SignedIn>
      <SignedOut>
        <SignInButton>
          <span className="text-blue-300 hover:underline cursor-pointer">
            Sign In
          </span>
        </SignInButton>
      </SignedOut>
    </>
  );
};
