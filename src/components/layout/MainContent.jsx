export default function MainContent({ children, sidebarOpen }) {
  return (
    <main
      className={`flex-1 p-4 transition-all duration-300 ease-in-out
        ${sidebarOpen ? "md:ml-60" : "md:ml-0"}`}
    >
      {children}
    </main>
  );
}
