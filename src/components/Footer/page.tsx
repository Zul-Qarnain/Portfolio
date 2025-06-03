
export function Footer() {
    return (
      <footer className="bg-muted text-muted-foreground dark:bg-card dark:text-card-foreground py-8">
        <div className="section-container text-center">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Persona. Built with Next.js and Tailwind CSS.
          </p>
          <p className="text-xs mt-1">
            Designed by{' '}
            <a href="https://github.com/Zul-Qarnain" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              Zul-Qarnain
            </a>
          </p>
        </div>
      </footer>
    );
  }