import { DashedLine } from "@/components/decorations/dashed-line";

const Testimonial = () => {
  return (
    <div className="w-full overflow-hidden">
      <h2 className="font-black font-doto text-2xl text-fg-default tracking-tight dark:font-extrabold">
        Testimonials
      </h2>

      <p className="mt-1 max-w-3xl text-balance text-base/relaxed text-fg-tertiary">
        I&apos;ve had the chance to work with some amazing people. Here&apos;s
        what they think about our time building things together.
      </p>

      <div className="relative mt-6 grid w-full grid-cols-1 gap-12 text-fg-default sm:mt-4 sm:grid-cols-2 sm:gap-0">
        <DashedLine className="hidden sm:block" orientation="horizontal" />
        <DashedLine className="hidden sm:block" orientation="vertical" />

        <div className="flex size-full w-full flex-col justify-center gap-6 p-2 [mask:radial-gradient(85%_85%_at_50%,rgb(0,0,0)_65%,rgba(0,0,0,0)_90%)] sm:p-12 sm:pt-8 sm:pl-1">
          <div className="flex gap-6">
            <div className="-rotate-6 size-12 shrink-0 bg-white p-1">
              {/* biome-ignore lint/performance/noImgElement: off */}
              {/* biome-ignore lint/correctness/useImageSize: off */}
              <img
                alt="avatar"
                className="size-full object-cover object-center"
                src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXZhdGFyfGVufDB8fDB8fHww"
              />
            </div>

            <div>
              <h5 className="font-medium text-fg-default text-sm">
                Sann Ko Ko
              </h5>
              <p className="text-fg-tertiary/80 text-xs">
                Product Manager at BSCV
              </p>
            </div>
          </div>

          <p className="text-fg-tertiary text-sm">
            Working with Htet was a fantastic experience. He has an incredible
            ability to turn ideas into reality, making the process very
            enjoyable. It&apos;s rare to find someone who can translate concepts
            into designs so perfectly on the first try.
          </p>
        </div>

        <div className="flex size-full w-full flex-col justify-center gap-6 p-2 [mask:radial-gradient(85%_85%_at_50%,rgb(0,0,0)_65%,rgba(0,0,0,0)_90%)] sm:p-12 sm:pt-8 sm:pr-0">
          <div className="flex gap-6">
            <div className="-rotate-6 size-12 shrink-0 bg-white p-1">
              {/* biome-ignore lint/performance/noImgElement: off */}
              {/* biome-ignore lint/correctness/useImageSize: off */}
              <img
                alt="avatar"
                className="size-full object-cover object-center"
                src="/images/khin_mg_htet.jpg"
              />
            </div>

            <div>
              <h5 className="font-medium text-fg-default text-sm">
                Khin Maung Htet
              </h5>
              <p className="text-fg-tertiary/80 text-xs">
                Software Developer at Pico
              </p>
            </div>
          </div>

          <p className="text-fg-tertiary text-sm">
            Working with Htet Aung Lin honestly changed the way I look at
            teamwork. He’s incredibly organized and pays attention to every
            little detail, not in a rigid way, but in a way that shows how much
            he truly cares about what he’s doing. His determination and
            consistency are on another level, and his work ethic just pulls me
            to work harder.
          </p>
        </div>

        <div className="flex size-full w-full flex-col justify-center gap-6 p-2 [mask:radial-gradient(85%_85%_at_50%,rgb(0,0,0)_65%,rgba(0,0,0,0)_90%)] sm:p-12 sm:pl-1">
          <div className="flex gap-6">
            <div className="-rotate-6 size-12 shrink-0 bg-white p-1">
              {/* biome-ignore lint/performance/noImgElement: off */}
              {/* biome-ignore lint/correctness/useImageSize: off */}
              <img
                alt="avatar"
                className="size-full object-cover object-center"
                src="/images/wai_yan_phone_aant.jpg"
              />
            </div>

            <div>
              <h5 className="font-medium text-fg-default text-sm">
                Wai Yan Phone Aant
              </h5>
              <p className="text-fg-tertiary/80 text-xs">
                Full Stack Developer at Pico
              </p>
            </div>
          </div>

          <p className="line-clamp-6 text-fg-tertiary text-sm">
            It has been an absolute pleasure collaborating with Htet Aung Lin.
            He is an incredibly creative front-end developer, and I truly value
            the quality and aesthetic of the designs he consistently produces.
            As a backend engineer, I especially appreciate his flexibility and
            his open approach to discussion and negotiation.
          </p>
        </div>

        <div className="flex size-full w-full flex-col justify-center gap-6 p-2 [mask:radial-gradient(85%_85%_at_50%,rgb(0,0,0)_65%,rgba(0,0,0,0)_90%)] sm:p-12 sm:pr-0">
          <div className="flex gap-6">
            <div className="-rotate-6 size-12 shrink-0 bg-white p-1">
              {/* biome-ignore lint/performance/noImgElement: off */}
              {/* biome-ignore lint/correctness/useImageSize: off */}
              <img
                alt="avatar"
                className="size-full object-cover object-center"
                src="https://plus.unsplash.com/premium_photo-1691784781482-9af9bce05096?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MzN8fGF2YXRhcnxlbnwwfHwwfHx8MA%3D%3D"
              />
            </div>

            <div>
              <h5 className="font-medium text-fg-default text-sm">
                Fabian Schmidt
              </h5>
              <p className="text-fg-tertiary/80 text-xs">
                Senior ML Engineer at Tesco
              </p>
            </div>
          </div>

          <p className="text-fg-tertiary text-sm">
            Working with Htet was a pleasure. He was able to help me with the
            design of my projects from start to finish. He communicated his
            UI/UX ideas in a clear and convincing way and made my work a lot
            easier.
          </p>
        </div>
      </div>
    </div>
  );
};

export { Testimonial };
