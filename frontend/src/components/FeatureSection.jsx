import { Users, CodeXml, MessageSquareText, Zap, Save } from "lucide-react";

export default function FeatureSection() {
  return (
    <section className="px-6 py-20 bg-gray-800">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-8 text-white">
          Why Choose CodeSync?
        </h2>
        <p className="text-xl text-center mb-10 text-gray-300">
          Built for developers, by developers. <br />Experience the future of collaborative coding
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-green-400 transition-colors group">
            <div className="bg-green-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Real-Time Collaboration</h3>
            <p className="text-gray-300">
              Collaborate in real time with live cursors that show exactly where your teammates are working. See changes instantly as they happen.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-blue-400 transition-colors group">
            <div className="bg-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-blue-500 transition-colors">
              <CodeXml className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Multi-Language Support</h3>
            <p className="text-gray-300">
              Code in Python, JavaScript, Java, C++, and 10+ other languages with full syntax highlighting.
            </p>
          </div>

          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-purple-400 transition-colors group">
            <div className="bg-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-purple-500 transition-colors">
              <MessageSquareText className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Built-in Chat Support</h3>
            <p className="text-gray-300">
              Communicate in real time with your teammates using integrated text chat. Whether it's discussing together, planning next steps, or just dropping a quick emoji, stay in sync without switching tabs.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-yellow-400 transition-colors group">
            <div className="bg-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-yellow-500 transition-colors">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Lightning Fast</h3>
            <p className="text-gray-300">
              Experience lightning-fast real-time collaboration powered by Yjs with Hocuspocus, CRDTs, and WebSocket technology - ensuring ultra-low latency and conflict-free editing.
            </p>
          </div>
          <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 hover:border-orange-400 transition-colors group">
            <div className="bg-orange-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-orange-500 transition-colors">
              <Save className="h-6 w-6 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-white">Autosave to Database</h3>
            <p className="text-gray-300">
              Never lose a line - CodeSync's intelligent autosave keeps your code safe in real time. Every keystroke is automatically saved and synced across sessions using CRDT-powered Yjs with Hocuspocus, ensuring seamless recovery and uninterrupted collaboration.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}