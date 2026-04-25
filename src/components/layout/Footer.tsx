export function Footer() {
  return (
    <footer className="border-t py-4">
      <div className="container mx-auto max-w-7xl px-4 text-center text-sm text-muted-foreground">
        <p>School Timetable Generator &copy; {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}