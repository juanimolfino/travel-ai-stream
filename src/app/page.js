"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";

export default function SloganGenerator() {
  const [finished, setUseFinished] = useState(false);
  const handleFinished = () => {
    setUseFinished(true);
  };
  const {
    completion,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    stop,
  } = useCompletion({
    onFinish: () => {
      handleFinished();
    },
  });

  const onSubmit = () => {
    const he = document.documentElement.clientHeight;
    setTimeout(() => {
      window.scrollTo({
        top: he,
        behavior: "smooth", // Para hacer el scroll suave
      });
    }, 1000);
  };

  function newGenerate() {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Para hacer el scroll suave
    });
  }

  function scrollDown() {
    const he = document.documentElement.clientHeight;
    window.scrollTo({
      top: he,
      behavior: "smooth", // Para hacer el scroll suave
    });
  }

  return (
    <main>
      <section className="h-screen flex items-center justify-center bg-cover bg-center bg-[url('/images/portada.jpeg')] opacity-90">
        <section className="md:w-2/3 sm:w-3/4 w-5/6">
          <h1 className="text-white text-6xl sm:text-8xl text-center font-soehne font-bold">
            Travel AI
          </h1>
          <p className="text-white text-md sm:text-xl text-center font-soehne">
            Search for your city and see the best places to visit on your trip
          </p>
          <div>
            <form onSubmit={handleSubmit}>
              <input
                className="p-2 bg-neutral-700 block text-white w-full rounded-md mt-10"
                type="text"
                onChange={handleInputChange}
                value={input}
                placeholder="Write a city to search (you can add country and more information)"
              />

              {!isLoading && (
                <button
                  className="bg-yellow-500 p-2 rounded-md block disabled:bg-opacity-80 mt-4 hover:bg-yellow-400"
                  type="submit"
                  onClick={onSubmit}
                  disabled={isLoading}
                >
                  {/* {isLoading ? "Thinking..." : "Generate"} */}
                  Generate
                </button>
              )}
              {isLoading && (
                <button
                  className="bg-red-500 p-2 rounded-md block mt-4 hover:bg-red-400"
                  onClick={stop}
                >
                  Stop generate
                </button>
              )}
            </form>
          </div>
        </section>
      </section>
      {completion && (
        <section className=" py-10 flex flex-col items-center justify-center bg-cover bg-center bg-amber-200 opacity-90 sm:px-20 px-10">
          <div className="container mx-auto flex flex-col align-middle">
            <h2 className="font-bold text-2xl">
              Lugares recomendados para tu visita a: {input}
            </h2>
            <br />
            <div
              className="text-black font-soehne text-md"
              dangerouslySetInnerHTML={{ __html: completion }}
            />
            <div>
              {finished && (
                <button
                  className="bg-yellow-500 p-2 rounded-md block disabled:bg-opacity-40 mt-8 mb-8 hover:bg-yellow-600"
                  onClick={newGenerate}
                >
                  New generate
                </button>
              )}
            </div>
          </div>
        </section>
      )}
      {isLoading && (
        <div className="fixed bottom-8 right-8 z-50">
          <button onClick={scrollDown} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full shadow">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 13.5L12 21m0 0l-7.5-7.5M12 21V3"
              />
            </svg>
          </button>
        </div>
      )}
    </main>
  );
}
