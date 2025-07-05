export default function HowItWorks() {
  return (
    <section className="px-6 py-20">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-6 text-white">
          Get Started in Seconds
        </h2>
        <p className="text-xl text-center mb-15 text-gray-300">
          Get started in three simple steps and begin collaborating instantly.
        </p>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              1
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white">Create or Join</h3>
              <p className="text-gray-300">Start a new coding session or join an existing room with a room code.</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              2
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white">Invite Your Team</h3>
              <p className="text-gray-300">Share the room code with your teammates and start collaborating instantly.</p>
            </div>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">
              3
            </div>
            <div className="bg-slate-800 p-5 rounded-2xl border border-gray-700">
              <h3 className="text-xl font-semibold mb-3 text-white">Code Together</h3>
              <p className="text-gray-300">Write and build amazing code together in real-time.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}