export default function SectionDivider() {
  return (
    <div className="relative flex items-center justify-center py-16">
      <div className="absolute left-1/2 top-1/2 h-px w-3/4 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-500/30 to-transparent" />

      <div className="relative z-10 flex h-8 w-8 items-center justify-center">
        <div className="absolute inset-0 animate-ping rounded-full bg-green-500/20" />

        <div className="relative h-2 w-2 rounded-full bg-green-400" />
      </div>
    </div>
  );
}
