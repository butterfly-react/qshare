import Image from "next/image";
import { Button } from "./ui/button";
import { buttonVariants } from "./ui/button";
import { GitHubLogoIcon } from "@radix-ui/react-icons";

export const Hero = () => {
  return (
    <div className="hero-section">
      <section className="container grid lg:grid-cols-2 place-items-center py-20 md:py-32 gap-8">
        <div className="text-center lg:text-start space-y-6">
          <main className="text-5xl md:text-6xl font-bold text-balance">
            <h1 className="inline">
              <span className="inline bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-transparent bg-clip-text">
                QShare
              </span>{" "}
              Management Board
            </h1>{" "}
            <h2 className=" mt-5">
              <span className="inline bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-transparent bg-clip-text">
                Promote
              </span>{" "}
              <span className="inline bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-transparent bg-clip-text">
                your products with Qshare
              </span>{" "}
              <div />
              <div className="mt-5 bg-gradient-to-r from-[#667EEA] to-[#764BA2] text-transparent bg-clip-text">
                Subscribe with custom plans
              </div>{" "}
              <p className="text-xl text-muted-foreground md:w-10/12 mx-auto lg:mx-0 text-balance">
                Manage your products at one place
              </p>
            </h2>
          </main>
        </div>

        {/* Hero cards sections */}
        <div className="z-10">
          {/* <HeroCards /> */}
          <Image
            src="/hero.jpeg"
            width={986}
            height={512}
            alt=""
            className="rounded-md select-none pointer-events-none"
          />
        </div>

        {/* Shadow effect */}
        <div className="shadow"></div>
      </section>
    </div>
  );
};
