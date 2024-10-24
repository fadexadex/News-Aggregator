import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import TextInput from "./TextInput";

const Login = () => {
  return (
    <div className=" flex flex-col md:flex-row items-center text-white font-open w-full mt-20 md:mt-0">
      {/* {Left} */}
      <div className="md:w-1/2 md:px-16 w-full px-20 xl:px-36">
        <div className="text-center w-full">
          <h1 className="font-medium text-2xl mb-3">Sign in to Aggregator</h1>
          <p className="text-sm text-gray-400">
            Welcome back! Please sign in to continue
          </p>
        </div>

        <form className="mt-7 w-full">
          <TextInput
            label="Email"
            type="email"
            id="email"
            name="email"
            className="mb-5"
            required
          />
          <TextInput
            label="Password"
            type="password"
            id="password"
            name="password"
            className="mb-5"
            required
          />
          <Button className="w-full h-10 bg-white hover:bg-gray-300 text-gray-950">
            Login
          </Button>
          <p className="mt-6 text-center">
            Don't have an account?{" "}
            <Link to="/signup" className="hover:underline">
              Sign Up
            </Link>
          </p>
        </form>
      </div>

      {/* {Right} */}
      <div className=" md:w-1/2 xl:w-3/4 hidden md:flex h-full overflow-hidden">
        <img
          src="/side.webp"
          alt="Aggregator"
          className="object-cover w-full h-full"
        />
      </div>
    </div>
  );
};

export default Login;
