export default function DownloadSection() {
  return (
    <section className="text-center py-20">
      <h2 className="text-3xl font-bold text-teal-700 mb-6">Uygulamayı İndir</h2>
      <p className="text-gray-600 mb-8">Platformunu seç ve hemen indir.</p>
      <div className="flex justify-center gap-6 flex-wrap">
        <a
          href="https://downloads.raporin.com/RaporinAI-1.1.26.msi"
          className="bg-teal-600 text-white px-6 py-3 rounded-xl hover:bg-teal-700 transition"
        >
          Uygulamayı İndir          </a>

      </div>
    </section>
  );
}

