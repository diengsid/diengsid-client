export function Footer() {
  return (
    <footer className="mt-12 border-t border-gray-200 bg-gray-50 py-10">
      <div className="container mx-auto px-4 md:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h4 className="mb-4 font-bold text-gray-900">Dukungan</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Pusat Bantuan
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  AirCover
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Anti-diskriminasi
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Dukungan disabilitas
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-gray-900">Tuan Rumah</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Jadikan rumah Anda homestay
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Daftarkan Jeep Anda
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Forum komunitas
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Hosting secara bertanggung jawab
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-gray-900">Dieng.id</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>
                <a href="#" className="hover:underline">
                  Tentang kami
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Fitur baru
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Karir
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Investor
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 font-bold text-gray-900">Kontak</h4>
            <ul className="space-y-3 text-sm text-gray-600">
              <li>Dieng, Wonosobo</li>
              <li>Jawa Tengah, Indonesia</li>
              <li>hello@dieng.id</li>
              <li>+62 812 3456 7890</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between border-t border-gray-200 pt-8 text-sm text-gray-600 md:flex-row">
          <div className="flex gap-4">
            <span>© 2024 Dieng.id, Inc.</span>
            <span>·</span>
            <a href="#" className="hover:underline">
              Privasi
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Ketentuan
            </a>
            <span>·</span>
            <a href="#" className="hover:underline">
              Peta Situs
            </a>
          </div>
          <div className="mt-4 flex gap-4 font-medium md:mt-0">
            <span className="cursor-pointer hover:underline">
              Bahasa Indonesia (ID)
            </span>
            <span className="cursor-pointer hover:underline">Rp IDR</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
