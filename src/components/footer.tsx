export default function Footer() {
  return (
    <footer className="flex flex-col items-center gap-2 pt-8">
      <p className="text-secondary text-sm">
        We respect your privacy. No spam, ever.
      </p>
      <p className="text-secondary/60 text-xs">
        Staying Ahead &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
}
