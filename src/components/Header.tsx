"use client";

// using inline SVG for the header icon to avoid external icon dependency

interface HeaderProps {
  description?: string;
}

export function Header({
  description =
    "Pantau jumlah client per lokasi dan per sesi (pagi/siang) secara real-time menggunakan data dari BRIN Client Count.",
}: HeaderProps) {

  return (
    <header className="w-full border-b bg-background">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-8 py-6">
        <div className="flex items-start space-x-4">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: "var(--brin-red)", color: "var(--brin-white)" }}
          >
            {/* Bar chart inline icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="w-6 h-6"
              aria-hidden="true"
            >
              <path d="M5 3a1 1 0 0 1 1 1v14h12a1 1 0 1 1 0 2H5a2 2 0 0 1-2-2V4a1 1 0 0 1 1-1h1z" />
              <rect x="7" y="10" width="3" height="6" rx="0.5" />
              <rect x="11" y="7" width="3" height="9" rx="0.5" />
              <rect x="15" y="5" width="3" height="11" rx="0.5" />
            </svg>
          </div>

          {/* Title and description */}
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground">
              BRIN Client Count
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-4xl">
              {description}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
