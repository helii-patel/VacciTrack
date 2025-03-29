export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-slate-200">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between md:flex-row">
          <div className="flex items-center">
            <i className="fas fa-syringe text-primary text-lg mr-2"></i>
            <span className="font-medium text-slate-900">VaxTrack</span>
          </div>
          <div className="mt-4 md:mt-0">
            <p className="text-sm text-slate-500">© {currentYear} VaxTrack. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
