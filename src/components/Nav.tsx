import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/clerk-react";
import { Link, useRouterState } from "@tanstack/react-router";

export const Nav = () => {
  const routerState = useRouterState();
  const currentPath = routerState.location.pathname;

  return (
    <>
      <SignedIn>
        <div className="flex flex-row justify-end items-center gap-5">
          {currentPath !== "/" && (
            <Link to="/" className="text-blue-300 hover:underline">
              Home
            </Link>
          )}
          {currentPath !== "/dashboard" && (
            <Link to="/dashboard" className="text-blue-300 hover:underline">
              Dashboard
            </Link>
          )}
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
