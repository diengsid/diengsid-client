import { Users } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-zinc-900">Users</h1>
        <p className="text-sm text-zinc-500">Manajemen pengguna platform</p>
      </div>
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-20 text-center">
        <Users size={40} className="mb-3 text-zinc-200" />
        <p className="font-medium text-zinc-400">Halaman users</p>
        <p className="text-sm text-zinc-300">Segera hadir</p>
      </div>
    </div>
  );
}
