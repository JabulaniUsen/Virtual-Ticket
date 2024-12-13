import Image from "next/image";
import React from "react";
import Link from "next/link";
import { FaSearchengin } from "react-icons/fa6";
import { BiMenu } from "react-icons/bi";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function Mainheader() {
  return (
    <header className=" flex flex-row px-12 py-5 justify-between bg-primary items-center ">
      <Image src={"/logo.png"} width={50} height={50} alt="Logo" />
      <nav className=" hidden sm:flex  flex-row gap-3 w-fit    ">
        <Link className=" text-lg font-semibold text-white w-fit " href={"/"}>
          Home
        </Link>
        <Link className=" text-lg font-semibold text-white w-fit " href={"/"}>
          Events
        </Link>
        <Link className=" text-lg font-semibold text-white w-fit " href={"/"}>
          About
        </Link>
        <Link className=" text-lg font-semibold text-white w-fit " href={"/"}>
          Contact
        </Link>
        <Link className=" text-lg font-semibold text-white w-fit " href={"/"}>
          Pricing
        </Link>
        <Link className=" text-lg font-semibold text-white w-fit " href={"/"}>
          Help
        </Link>
      </nav>
      <div>
        <FaSearchengin className=" hidden sm:inline fill-orange-400 w-8 h-8 " />
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <BiMenu className=" inline sm:hidden fill-orange-500 w-8 h-8   " />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>
              <Link className=" font-semibold w-fit " href={"/"}>
                Home
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className=" font-semibold  w-fit " href={"/"}>
                Events
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className=" font-semibold  w-fit " href={"/"}>
                About
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className=" font-semibold  w-fit " href={"/"}>
                Contact
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link className=" font-semibold  w-fit " href={"/"}>
                Pricing
              </Link>
            </DropdownMenuItem>{" "}
            <DropdownMenuItem>
              <Link className=" font-semibold  w-fit " href={"/"}>
                Help
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

export default Mainheader;
