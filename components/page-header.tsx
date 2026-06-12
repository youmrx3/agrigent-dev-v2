type PageHeaderProps = {
  title: string;
  subtitle: string;
};

export default function PageHeader({
  title,
  subtitle,
}: PageHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-green-400">
          AGRIGENT Dashboard
        </p>

        <h1 className="mt-2 text-5xl font-black">
          {title}
        </h1>

        <p className="mt-4 text-slate-400">
          {subtitle}
        </p>
      </div>
    </div>
  );
}