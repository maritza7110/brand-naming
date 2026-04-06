export default function GallerySkeletonCard() {
  return (
    <div className="bg-[#1A1A1E] border border-white/5 rounded-2xl p-4 animate-pulse">
      <div className="bg-[#4A4440] rounded-full w-16 h-5 mb-3" />
      <div className="space-y-2 mb-3">
        <div className="bg-[#4A4440] rounded-lg h-5 w-3/4" />
        <div className="bg-[#4A4440] rounded-lg h-5 w-1/2" />
      </div>
      <div className="border-t border-[#4A4440] mt-3 pt-3">
        <div className="flex justify-between">
          <div className="bg-[#4A4440] rounded h-4 w-20" />
          <div className="bg-[#4A4440] rounded h-4 w-10" />
        </div>
      </div>
    </div>
  );
}
