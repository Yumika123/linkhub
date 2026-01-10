export default function Loading() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
        <p className="text-white/40 font-medium">Loading...</p>
      </div>
    </div>
  );
}
