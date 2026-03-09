import Link from "next/link";

const players = ["Alice", "Bob", "Carol", "Dave"];
const colors = ["bg-blue-500", "bg-green-500", "bg-purple-500", "bg-orange-500"];
const words = ["Cat", "Rocket", "Pizza", "Ghost"];

export default function AboutPage() {
  return (
    <div className="min-h-screen p-4 pb-20">
      <div className="mx-auto max-w-2xl space-y-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition">
            &larr; Back to home
          </Link>
        </div>

        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold">How Telephone Draw Works</h1>
          <p className="text-gray-400">A step-by-step guide with 4 example players</p>
        </div>

        {/* Step 1: Create or Join */}
        <section className="space-y-4">
          <StepHeader number={1} title="Create or Join a Game" />
          <p className="text-gray-400">
            One player creates a game and shares the 6-letter code. Others join using the code.
          </p>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-3">
            <div className="text-center font-mono text-2xl tracking-widest text-blue-400">ABC123</div>
            <div className="grid grid-cols-2 gap-2">
              {players.map((name, i) => (
                <div key={name} className="flex items-center gap-2 rounded bg-gray-800 px-3 py-2">
                  <div className={`h-3 w-3 rounded-full ${colors[i]}`} />
                  <span className="text-sm">{name}</span>
                  {i === 0 && <span className="ml-auto text-xs text-yellow-400">Host</span>}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 2: Everyone Gets a Word */}
        <section className="space-y-4">
          <StepHeader number={2} title="Everyone Gets a Secret Word" />
          <p className="text-gray-400">
            Each player is secretly assigned a random word. No one else can see it.
          </p>
          <div className="grid grid-cols-2 gap-3">
            {players.map((name, i) => (
              <div key={name} className="rounded-lg border border-gray-700 bg-gray-900 p-3 text-center">
                <p className="text-xs text-gray-500 mb-1">{name}</p>
                <p className="text-lg font-bold text-blue-400">{words[i]}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Step 3: Draw What You See */}
        <section className="space-y-4">
          <StepHeader number={3} title="Draw What You See" />
          <p className="text-gray-400">
            In drawing rounds, you see a word (or a guess) and draw it as best you can before the timer runs out.
          </p>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-3">
            <div className="text-center">
              <p className="text-xs text-gray-500">Draw this word:</p>
              <p className="text-xl font-bold text-blue-400">Cat</p>
            </div>
            <div className="aspect-[4/3] rounded bg-white flex items-center justify-center">
              {/* Simple cat face illustration */}
              <svg viewBox="0 0 200 200" className="h-32 w-32">
                <path d="M60 60 L80 30 L90 60" fill="none" stroke="#333" strokeWidth="3" />
                <path d="M140 60 L120 30 L110 60" fill="none" stroke="#333" strokeWidth="3" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="#333" strokeWidth="3" />
                <circle cx="85" cy="90" r="5" fill="#333" />
                <circle cx="115" cy="90" r="5" fill="#333" />
                <path d="M90 110 Q100 120 110 110" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="60" y1="100" x2="30" y2="95" stroke="#333" strokeWidth="2" />
                <line x1="60" y1="105" x2="30" y2="110" stroke="#333" strokeWidth="2" />
                <line x1="140" y1="100" x2="170" y2="95" stroke="#333" strokeWidth="2" />
                <line x1="140" y1="105" x2="170" y2="110" stroke="#333" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Alice is drawing...</span>
              <span>0:45</span>
            </div>
          </div>
        </section>

        {/* Step 4: Guess the Drawing */}
        <section className="space-y-4">
          <StepHeader number={4} title="Guess the Drawing" />
          <p className="text-gray-400">
            In guessing rounds, you see someone else&apos;s drawing and type your best guess for what it is.
          </p>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-3">
            <div className="aspect-[4/3] rounded bg-white flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="h-32 w-32">
                <path d="M60 60 L80 30 L90 60" fill="none" stroke="#333" strokeWidth="3" />
                <path d="M140 60 L120 30 L110 60" fill="none" stroke="#333" strokeWidth="3" />
                <circle cx="100" cy="100" r="50" fill="none" stroke="#333" strokeWidth="3" />
                <circle cx="85" cy="90" r="5" fill="#333" />
                <circle cx="115" cy="90" r="5" fill="#333" />
                <path d="M90 110 Q100 120 110 110" fill="none" stroke="#333" strokeWidth="2" />
                <line x1="60" y1="100" x2="30" y2="95" stroke="#333" strokeWidth="2" />
                <line x1="60" y1="105" x2="30" y2="110" stroke="#333" strokeWidth="2" />
                <line x1="140" y1="100" x2="170" y2="95" stroke="#333" strokeWidth="2" />
                <line x1="140" y1="105" x2="170" y2="110" stroke="#333" strokeWidth="2" />
              </svg>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 rounded-lg border border-gray-700 bg-gray-800 px-3 py-2 text-yellow-400">
                Kitty
              </div>
              <div className="rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white">
                Submit
              </div>
            </div>
            <p className="text-xs text-gray-500">Bob is guessing Alice&apos;s drawing...</p>
          </div>
        </section>

        {/* Step 5: Pass It Along */}
        <section className="space-y-4">
          <StepHeader number={5} title="Pass It Along" />
          <p className="text-gray-400">
            Each round, your work gets passed to the next player. They draw your guess, or guess your drawing. Like a game of telephone, the message transforms as it goes around!
          </p>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4">
            <div className="flex flex-col items-center gap-1">
              {[
                { from: "Alice", action: "gets word", value: "Cat", color: "text-blue-400" },
                { from: "Bob", action: "draws", value: "Cat", color: "text-blue-400" },
                { from: "Carol", action: "guesses", value: "Kitty", color: "text-yellow-400" },
                { from: "Dave", action: "draws", value: "Kitty", color: "text-yellow-400" },
              ].map((step, i) => (
                <div key={i} className="w-full">
                  {i > 0 && (
                    <div className="flex justify-center py-1">
                      <div className="text-gray-600">&darr;</div>
                    </div>
                  )}
                  <div className="flex items-center gap-3 rounded bg-gray-800 px-3 py-2">
                    <div className={`h-3 w-3 rounded-full ${colors[i]}`} />
                    <span className="text-sm text-gray-400">{step.from} {step.action}</span>
                    <span className={`ml-auto text-sm font-bold ${step.color}`}>&quot;{step.value}&quot;</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Step 6: The Big Reveal */}
        <section className="space-y-4">
          <StepHeader number={6} title="The Big Reveal" />
          <p className="text-gray-400">
            After all rounds, the host reveals each chain one at a time. See how the original word transformed as it passed through each player! Navigate between chains with Previous/Next buttons.
          </p>
          <div className="rounded-lg border border-gray-700 bg-gray-900 p-4 space-y-3">
            <p className="text-center text-sm text-gray-500">Chain 1 of 4</p>
            <div className="rounded bg-gray-800 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Alice&apos;s word</p>
              <p className="text-xl font-bold text-blue-400">Cat</p>
            </div>
            <div className="rounded bg-gray-800 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Bob drew</p>
              <div className="text-3xl">&#128049;</div>
            </div>
            <div className="rounded bg-gray-800 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Carol guessed</p>
              <p className="text-xl font-bold text-yellow-400">Kitty</p>
            </div>
            <div className="rounded bg-gray-800 p-3 text-center">
              <p className="text-xs text-gray-500 mb-1">Dave drew</p>
              <div className="text-3xl">&#128008;</div>
            </div>
            <div className="flex justify-center gap-2 pt-2">
              <div className="rounded bg-gray-700 px-4 py-2 text-sm text-gray-400">Previous</div>
              <div className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold text-white">Next Chain</div>
            </div>
          </div>
        </section>

        <div className="text-center pt-4">
          <Link
            href="/"
            className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-lg font-bold text-white transition hover:bg-blue-700"
          >
            Play Now
          </Link>
        </div>
      </div>
    </div>
  );
}

function StepHeader({ number, title }: { number: number; title: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold">
        {number}
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
    </div>
  );
}
